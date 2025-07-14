import { UserType } from '~/models/user.model'
import { prismaService } from '~/services/prisma.service'

export class UserRepository {
  static findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return prismaService.user.findUnique({
      where: uniqueObject
    })
  }
}
