import expressListEndpoints from 'express-list-endpoints'
import { HTTPMethod } from '~/constants/role.constant'
import { prismaService, PrismaService } from '~/services/prisma.service'
import { logger } from './logger'

class CreatePermissionScript {
  constructor(private readonly prismaService: PrismaService) {}

  bootstrap = async (app: Express.Application) => {
    const endpoints = expressListEndpoints(app)

    const availableRoutes = endpoints
      .map((item) => {
        return item.methods.map((method) => {
          return {
            path: item.path,
            method: method as keyof typeof HTTPMethod,
            name: method + ' ' + item.path
          }
        })
      })
      .flat()
      .filter((item) => item !== undefined)

    const result = await this.prismaService.permission.createMany({
      data: availableRoutes,
      skipDuplicates: true
    })

    return result
  }
}

export const bootstrap = new CreatePermissionScript(prismaService).bootstrap
