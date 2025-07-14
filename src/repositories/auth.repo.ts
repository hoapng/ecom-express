import { prismaService } from '~/services/prisma.service'
import { DeviceType, RegisterBodyType, RegisterResSchema, RoleType, VerificationCodeType } from '~/models/auth.model'
import { UserType } from '~/models/user.model'
import { TypeOfVerificationCodeType } from '~/constants/auth.constant'

export class AuthRepository {
  static async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    const data = await prismaService.user.create({
      data: user
      // omit: {
      //   password: true,
      //   totpSecret: true
      // }
    })
    return RegisterResSchema.parse(data)
  }

  static async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return await prismaService.verificationCode.upsert({
      where: {
        email: payload.email
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
        createdAt: new Date()
      }
    })
  }

  static async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string
          code: string
          type: TypeOfVerificationCodeType
        }
  ): Promise<VerificationCodeType | null> {
    return await prismaService.verificationCode.findUnique({
      where: uniqueValue
    })
  }

  static async createRefreshToken(data: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return await prismaService.refreshToken.create({
      data
    })
  }

  static async createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>
  ) {
    return await prismaService.device.create({
      data
    })
  }

  static async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number }
  ): Promise<(UserType & { role: RoleType }) | null> {
    return await prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true
      }
    })
  }
}
