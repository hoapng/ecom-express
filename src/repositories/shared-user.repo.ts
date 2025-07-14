import { UserType } from '~/models/shared-user.model'
import { PrismaService, prismaService } from '~/services/prisma.service'

export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where: uniqueObject
    })
  }
}

export const sharedUserRepository = new SharedUserRepository(prismaService)
