import { prismaService } from '~/services/prisma.service'
import { RegisterBodyType, RegisterResSchema, UserType } from '~/models/auth.model'

export class AuthRepository {
  static async createUser(
    user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>
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
}
