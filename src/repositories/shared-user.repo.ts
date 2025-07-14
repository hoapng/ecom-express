import { UserType } from '~/models/user.model'
import { PrismaService, prismaService } from '~/services/prisma.service'

export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(uniqueObject: { email: string } | { id: number }): Promise<UserType | null> {
    return prismaService.user.findUnique({
      where: uniqueObject
    })
  }
}

export const sharedUserRepository = new SharedUserRepository(prismaService)
