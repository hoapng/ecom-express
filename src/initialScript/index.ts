import envConfig from '~/config/evnConfig'
import { RoleName } from '~/constants/role.constant'
import { hashingService } from '~/services/hashing.service'
import { prismaService } from '~/services/prisma.service'

export const main = async () => {
  const roleCount = await prismaService.role.count()
  if (roleCount > 0) {
    throw new Error('Database already')
  }
  const roles = await prismaService.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role'
      },
      {
        name: RoleName.Client,
        description: 'Client role'
      },
      {
        name: RoleName.Seller,
        description: 'Seller role'
      }
    ]
  })

  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin
    }
  })
  const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD)
  const adminUser = await prismaService.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id
    }
  })
  return {
    createdRoleCount: roles.count,
    adminUser
  }
}
