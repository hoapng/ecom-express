import { PermissionType } from '~/models/permission.model'
import { RoleType } from '~/models/role.model'
import { CreateUserBodyType, GetUsersQueryType, GetUsersResType, UserType } from '~/models/user.model'
import { PrismaService, prismaService } from '~/services/prisma.service'

type UserIncludeRolePermissionsType = UserType & { role: RoleType & { permissions: PermissionType[] } }

export type WhereUniqueUserType = { id: number; [key: string]: any } | { email: string; [key: string]: any }
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findUnique(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where
    })
  }

  findUniqueIncludeRolePermissions(where: WhereUniqueUserType): Promise<UserIncludeRolePermissionsType | null> {
    return this.prismaService.user.findUnique({
      where,
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      }
    })
  }

  update(where: WhereUniqueUserType, data: Partial<UserType>): Promise<UserType | null> {
    return this.prismaService.user.update({
      where,
      data
    })
  }

  async list(pagination: GetUsersQueryType): Promise<GetUsersResType> {
    const skip = (pagination.page - 1) * pagination.limit
    const take = pagination.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.user.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.user.findMany({
        where: {
          deletedAt: null
        },
        skip,
        take,
        include: {
          role: true
        }
      })
    ])
    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit)
    }
  }

  create({ createdById, data }: { createdById: number | null; data: CreateUserBodyType }): Promise<UserType> {
    return this.prismaService.user.create({
      data: {
        ...data,
        createdById
      }
    })
  }

  delete(
    {
      id,
      deletedById
    }: {
      id: number
      deletedById: number
    },
    isHard?: boolean
  ): Promise<UserType> {
    return isHard
      ? this.prismaService.user.delete({
          where: {
            id
          }
        })
      : this.prismaService.user.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date(),
            deletedById
          }
        })
  }
}

export const userRepository = new UserRepository(prismaService)
