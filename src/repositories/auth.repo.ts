import { PrismaService, prismaService } from '~/services/prisma.service'
import { DeviceType, RegisterBodyType, RegisterResSchema, RoleType, VerificationCodeType } from '~/models/auth.model'
import { UserType } from '~/models/user.model'
import { TypeOfVerificationCodeType } from '~/constants/auth.constant'

export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    const data = await this.prismaService.user.create({
      data: user
      // omit: {
      //   password: true,
      //   totpSecret: true
      // }
    })
    return RegisterResSchema.parse(data)
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.upsert({
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

  async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string
          code: string
          type: TypeOfVerificationCodeType
        }
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({
      where: uniqueValue
    })
  }

  async createRefreshToken(data: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return await this.prismaService.refreshToken.create({
      data
    })
  }

  async createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>
  ) {
    return await this.prismaService.device.create({
      data
    })
  }

  async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number }
  ): Promise<(UserType & { role: RoleType }) | null> {
    return await this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true
      }
    })
  }
}

export const authRepository = new AuthRepository(prismaService)
