import { PermissionType } from '~/models/permission.model'
import { RoleType } from '~/models/role.model'
import { UserType } from '~/models/user.model'
import { PrismaService, prismaService } from '~/services/prisma.service'

type UserIncludeRolePermissionsType = UserType & { role: RoleType & { permissions: PermissionType[] } }

type WhereUniqueUserType = { id: number; [key: string]: any } | { email: string; [key: string]: any }
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
}

export const userRepository = new UserRepository(prismaService)
