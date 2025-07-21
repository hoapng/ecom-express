import { HTTPMethod, RoleName } from '~/constants/role.constant'
import { hashingService, HashingService } from '~/services/hashing.service'
import { PrismaService, prismaService } from '~/services/prisma.service'
import envConfig from './evnConfig'
import expressListEndpoints from 'express-list-endpoints'
import { logger } from './logger'

export const initialScript = async () => {
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

export const bootstrap = async (app: Express.Application) => {
  const endpoints = expressListEndpoints(app)

  const permissionsInDb = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })

  const availableRoutes: { path: string; method: keyof typeof HTTPMethod; name: string }[] = endpoints
    .map((item) => {
      return item.methods.map((method) => {
        return {
          path: item.path,
          method: method as keyof typeof HTTPMethod,
          name: method + ' ' + item.path,
          module: item.path.split('/')[1] // Lấy module từ path
        }
      })
    })
    .flat()
    .filter((item) => item !== undefined)

  // Tạo object permissionInDbMap với key là [method-path]
  const permissionInDbMap: Record<string, (typeof permissionsInDb)[0]> = permissionsInDb.reduce(
    (acc, item) => {
      acc[`${item.method}-${item.path}`] = item
      return acc
    },
    {} as Record<string, (typeof permissionsInDb)[0]>
  )
  // Tạo object availableRoutesMap với key là [method-path]
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce(
    (acc, item) => {
      acc[`${item.method}-${item.path}`] = item
      return acc
    },
    {} as Record<string, (typeof availableRoutes)[0]>
  )

  // Tìm permissions trong database mà không tồn tại trong availableRoutes
  const permissionsToDelete = permissionsInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`]
  })
  // Xóa permissions không tồn tại trong availableRoutes
  if (permissionsToDelete.length > 0) {
    const deleteResult = await prismaService.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id)
        }
      }
    })
    logger.info(`Deleted permissions: ${deleteResult.count}`)
  } else {
    logger.info('No permissions to delete')
  }
  // Tìm routes mà không tồn tại trong permissionsInDb
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDbMap[`${item.method}-${item.path}`]
  })

  if (routesToAdd.length > 0) {
    const permissionsToAdd = await prismaService.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true
    })
    logger.info(`Added permissions: ${permissionsToAdd.count}`)
  } else {
    logger.info('No permissions to add')
  }

  // Lấy lại permissions trong database sau khi thêm mới (hoặc bị xóa)
  const updatedPermissionsInDb = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })
  // Cập nhật lại các permissions trong Admin Role
  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
      deletedAt: null
    }
  })
  await prismaService.role.update({
    where: {
      id: adminRole.id
    },
    data: {
      permissions: {
        set: updatedPermissionsInDb.map((item) => ({ id: item.id }))
      }
    }
  })
}
