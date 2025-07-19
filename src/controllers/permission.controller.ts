import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsSchema,
  GetPermissionsQuerySchema,
  GetPermissionsResSchema,
  UpdatePermissionBodySchema
} from '~/models/permission.model'
import { MessageResSchema } from '~/models/response.model'
import { permissionService, PermissionService } from '~/services/permission.service'

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const query = GetPermissionsQuerySchema.parse(req.query)
    const data = await this.permissionService.list({
      page: query.page,
      limit: query.limit
    })
    req.data = GetPermissionsResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetPermissionParamsSchema.parse(req.params)
    const data = await this.permissionService.findById(params.permissionId)
    req.data = GetPermissionDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreatePermissionBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.permissionService.create({
      data: body,
      createdById: userId
    })
    req.data = GetPermissionDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdatePermissionBodySchema.parse(req.body)
    const params = GetPermissionParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.permissionService.update({
      data: body,
      id: params.permissionId,
      updatedById: userId
    })
    req.data = GetPermissionDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetPermissionParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.permissionService.delete({
      id: params.permissionId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const permissionController = new PermissionController(permissionService)
