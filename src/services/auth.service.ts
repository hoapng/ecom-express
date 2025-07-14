import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'
import { hashingService, HashingService } from './hashing.service'
import { prismaService } from './prisma.service'
import { rolesService, RolesService } from './role.service'
import createHttpError from 'http-errors'
import { tokenService, TokenService } from './token.service'
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  RegisterResSchema,
  SendOTPBodyType
} from '~/models/auth.model'
import { authRepository, AuthRepository } from '~/repositories/auth.repo'
import { SharedUserRepository, sharedUserRepository } from '~/repositories/shared-user.repo'
import { addMilliseconds } from 'date-fns'
import envConfig from '~/config/evnConfig'
import ms, { StringValue } from 'ms'
import { TypeOfVerificationCode } from '~/constants/auth.constant'
import { emailService, EmailService } from './email.service'
import { StatusCodes } from 'http-status-codes'
import { AccessTokenPayloadCreate } from '~/types/jwt.type'

export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService
  ) {}
  async register(body: RegisterBodyType) {
    try {
      const vevificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER
      })
      if (!vevificationCode) {
        throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
          message: [
            {
              message: 'Mã OTP không hợp lệ',
              path: 'code'
            }
          ]
        })
      }
      if (vevificationCode.expiresAt < new Date()) {
        throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
          message: [
            {
              message: 'Mã OTP đã hết hạn',
              path: 'code'
            }
          ]
        })
      }

      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
          message: [
            {
              message: 'Email đã tồn tại',
              path: 'email'
            }
          ]
        })
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    // 1. Kiểm tra email đã tồn tại trong database chưa
    const user = await this.sharedUserRepository.findUnique({
      email: body.email
    })
    if (user) {
      throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
        message: [
          {
            message: 'Email đã tồn tại',
            path: 'email'
          }
        ]
      })
    }
    // 2. Tạo mã OTP
    const code = generateOTP()
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })
    // 3. Gửi mã OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code
    })
    if (error) {
      throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
        message: [
          {
            message: 'Gửi mã OTP thất bại',
            path: 'code'
          }
        ]
      })
    }
    return verificationCode
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email
    })

    if (!user) {
      throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
        message: [
          {
            message: 'Email không tồn tại',
            path: 'email'
          }
        ]
      })
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
        message: [
          {
            path: 'password',
            error: 'Mật khẩu không đúng'
          }
        ]
      })
    }
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip
    })
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })
    return tokens
  }

  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName
      }),
      this.tokenService.signRefreshToken({
        userId
      })
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      const { userId } = this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Kiểm tra refreshToken có tồn tại trong database không
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken
      })
      if (!refreshTokenInDb) {
        // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
        // refresh token của họ đã bị đánh cắp
        throw createHttpError.Unauthorized('Refresh Token đã được sử dụng')
      }
      const {
        deviceId,
        user: { roleId, name: roleName }
      } = refreshTokenInDb
      // 3. Cập nhật device
      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        ip,
        userAgent
      })
      // 4. Xóa refreshToken cũ
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken
      })
      // 5. Tạo mới accessToken và refreshToken
      const $tokens = this.generateTokens({ userId, roleId, roleName, deviceId })
      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])
      return tokens
    } catch (error) {
      if (createHttpError.isHttpError(error)) {
        throw error
      }
      throw createHttpError.Unauthorized()
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Xóa refreshToken trong database
      await prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
      return { message: 'Logout successfully' }
    } catch (error) {
      // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
      // refresh token của họ đã bị đánh cắp
      if (isNotFoundPrismaError(error)) {
        throw createHttpError.Unauthorized('Refresh token has been revoked')
      }
      throw createHttpError.Unauthorized()
    }
  }
}

export const authService = new AuthService(
  hashingService,
  rolesService,
  authRepository,
  sharedUserRepository,
  emailService,
  tokenService
)
