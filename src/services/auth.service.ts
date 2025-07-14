import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'
import { HashingService } from './hashing.service'
import { prismaService } from './prisma.service'
import { RolesService } from './role.service'
import createHttpError from 'http-errors'
import { TokenService } from './token.service'
import { RegisterBodyType, RegisterResSchema, SendOTPBodyType } from '~/models/auth.model'
import { AuthRepository } from '~/repositories/auth.repo'
import { UserRepository } from '~/repositories/user.repo'
import { addMilliseconds } from 'date-fns'
import envConfig from '~/config/evnConfig'
import ms, { StringValue } from 'ms'
import { TypeOfVerificationCode } from '~/constants/auth.constant'
import { EmailService } from './email.service'
import { StatusCodes } from 'http-status-codes'

export class AuthService {
  static async register(body: RegisterBodyType) {
    try {
      const vevificationCode = await AuthRepository.findUniqueVerificationCode({
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

      const clientRoleId = await RolesService.getClientRoleId()
      const hashedPassword = await HashingService.hash(body.password)

      return await AuthRepository.createUser({
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

  static async sendOTP(body: SendOTPBodyType) {
    // 1. Kiểm tra email đã tồn tại trong database chưa
    const user = await UserRepository.findUnique({
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
    const verificationCode = AuthRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })
    // 3. Gửi mã OTP
    const { error } = await EmailService.sendOTP({
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

  static async login(body: any) {
    const user = await prismaService.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user) {
      throw createHttpError.Unauthorized('Account is not exist')
    }

    const isPasswordMatch = await HashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
        message: [
          {
            field: 'password',
            error: 'Password is incorrect'
          }
        ]
      })
    }
    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  static async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      TokenService.signAccessToken(payload),
      TokenService.signRefreshToken(payload)
    ])
    const decodedRefreshToken = await TokenService.verifyRefreshToken(refreshToken)
    await prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date((decodedRefreshToken.exp || 0) * 1000)
      }
    })
    return { accessToken, refreshToken }
  }

  static async refreshToken(refreshToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      const { userId } = await TokenService.verifyRefreshToken(refreshToken)
      // 2. Kiểm tra refreshToken có tồn tại trong database không
      await prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken
        }
      })
      // 3. Xóa refreshToken cũ
      await prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
      // 4. Tạo mới accessToken và refreshToken
      return await this.generateTokens({ userId })
    } catch (error) {
      // Trường hợp đã refresh token rồi, hãy thông báo cho user biết
      // refresh token của họ đã bị đánh cắp
      if (isNotFoundPrismaError(error)) {
        throw createHttpError.Unauthorized('Refresh token has been revoked')
      }
      throw createHttpError.Unauthorized()
    }
  }

  static async logout(refreshToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      await TokenService.verifyRefreshToken(refreshToken)
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
