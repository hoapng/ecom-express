import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'
import { HashingService } from './hashing.service'
import { prismaService } from './prisma.service'
import { rolesService } from './role.service'
import createHttpError from 'http-errors'
import { TokenService } from './token.service'

export class AuthService {
  static async register(body: any) {
    try {
      const clientRoleId = await rolesService.getClientRoleId()
      const hashedPassword = await HashingService.hash(body.password)
      const user = await prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
          phoneNumber: body.phoneNumber,
          roleId: clientRoleId
        },
        omit: {
          password: true,
          totpSecret: true
        }
      })
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw createHttpError.Conflict('Email đã tồn tại')
      }
      throw error
    }
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
      throw createHttpError(422, [
        {
          field: 'password',
          error: 'Password is incorrect'
        }
      ])
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
