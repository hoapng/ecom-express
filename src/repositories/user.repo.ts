import { UserType } from '~/models/user.model'
import { PrismaService, prismaService } from '~/services/prisma.service'

export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject
    })
  }
}

export const userRepository = new UserRepository(prismaService)
