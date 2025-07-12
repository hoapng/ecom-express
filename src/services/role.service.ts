import { RoleName } from '~/constants/role.constant'
import { prismaService } from '~/services/prisma.service'

class RolesService {
  private clientRoleId: number | null = null

  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const role = await prismaService.role.findUniqueOrThrow({
      where: {
        name: RoleName.Client
      }
    })
    this.clientRoleId = role.id
    return role.id
  }
}

export const rolesService = new RolesService()
