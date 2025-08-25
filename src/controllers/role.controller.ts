import { NextFunction, Request, Response } from 'express'
import {
  GetRolesQuerySchema,
  GetRolesResSchema,
  GetRoleParamsSchema,
  GetRoleDetailResSchema,
  CreateRoleBodySchema,
  CreateRoleResSchema,
  UpdateRoleBodySchema
} from '~/models/role.model'
import { MessageResSchema } from '~/models/response.model'
import { roleService, RoleService } from '~/services/role.service'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const query = GetRolesQuerySchema.parse(req.query)
    const data = await this.roleService.list({
      page: query.page,
      limit: query.limit
    })
    req.data = GetRolesResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetRoleParamsSchema.parse(req.params)
    const data = await this.roleService.findById(params.roleId)
    req.data = GetRoleDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateRoleBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.roleService.create({
      data: body,
      createdById: userId
    })
    req.data = CreateRoleResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateRoleBodySchema.parse(req.body)
    const params = GetRoleParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.roleService.update({
      data: body,
      id: params.roleId,
      updatedById: userId
    })
    req.data = GetRoleDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetRoleParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.roleService.delete({
      id: params.roleId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const roleController = new RoleController(roleService)
