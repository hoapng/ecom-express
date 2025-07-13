import { RoleName } from '~/constants/role.constant'
import { prismaService } from '~/services/prisma.service'

export class RolesService {
  private static clientRoleId: number | null = null

  static async getClientRoleId() {
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
