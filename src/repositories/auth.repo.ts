import { prismaService } from '~/services/prisma.service'
import { RegisterBodyType, RegisterResSchema, VerificationCodeType } from '~/models/auth.model'
import { UserType } from '~/models/user.model'
import { TypeOfVerificationCodeType } from '~/constants/auth.constant'

export class AuthRepository {
  static async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    const data = await prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true
      }
    })
    return RegisterResSchema.parse(data)
  }

  static async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'type' | 'code' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return prismaService.verificationCode.upsert({
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
    return prismaService.verificationCode.findUnique({
      where: uniqueValue
    })
  }
}
