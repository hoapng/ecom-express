import { HTTPMethodType, RoleName } from '~/constants/role.constant'
import { prismaService } from '~/services/prisma.service'
import expressListEndpoints from 'express-list-endpoints'
import { logger } from '~/config/logger'

const SellerModule = ['auth', 'media', 'products', 'product-translations', 'profile']

const ClientModule = ['auth', 'media', 'profile', 'cart']

export const bootstrap = async (app: Express.Application) => {
  const endpoints = expressListEndpoints(app)

  const permissionsInDb = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })

  const availableRoutes: { path: string; method: HTTPMethodType; name: string }[] = endpoints
    .map((item) => {
      return item.methods.map((method) => {
        return {
          path: item.path,
          method: method as HTTPMethodType,
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
  // Thêm routes mà không tồn tại trong permissionsInDb
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

  const adminPermissionIds = updatedPermissionsInDb.map((item) => ({ id: item.id }))
  const sellerPermissionIds = updatedPermissionsInDb
    .filter((item) => SellerModule.includes(item.module))
    .map((item) => ({ id: item.id }))
  await Promise.all([updateRole(adminPermissionIds, RoleName.Admin), updateRole(sellerPermissionIds, RoleName.Seller)])
}

const updateRole = async (permissionIds: { id: number }[], roleName: string) => {
  // Cập nhật lại các permissions trong Admin Role
  const role = await prismaService.role.findFirstOrThrow({
    where: {
      name: roleName,
      deletedAt: null
    }
  })
  await prismaService.role.update({
    where: {
      id: role.id
    },
    data: {
      permissions: {
        set: permissionIds
      }
    }
  })
}
