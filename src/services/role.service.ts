import { RoleName } from '~/constants/role.constant'
import { PrismaService, prismaService } from '~/services/prisma.service'

export class RolesService {
  private clientRoleId: number | null = null

  constructor(private readonly prismaService: PrismaService) {}

  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const role = await this.prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client
      }
    })
    this.clientRoleId = role.id
    return role.id
  }
}

export const rolesService = new RolesService(prismaService)
