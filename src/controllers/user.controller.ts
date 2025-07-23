import { NextFunction, Request, Response } from 'express'
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from '~/constants/auth.constant'
import { MessageResSchema } from '~/models/response.model'
import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetUserParamsSchema,
  GetUserProfileResSchema,
  GetUsersQuerySchema,
  GetUsersResSchema,
  UpdateProfileResSchema,
  UpdateUserBodySchema
} from '~/models/user.model'
import { userService, UserService } from '~/services/user.service'

export class UserController {
  constructor(private readonly userService: UserService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const query = GetUsersQuerySchema.parse(req.query)
    const data = await this.userService.list({
      page: query.page,
      limit: query.limit
    })
    req.data = GetUsersResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetUserParamsSchema.parse(req.params)
    const data = await this.userService.findById(params.userId)
    req.data = GetUserProfileResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateUserBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const roleName = req[REQUEST_ROLE_PERMISSIONS]?.name as string
    const data = await this.userService.create({
      data: body,
      createdById: userId,
      createdByRoleName: roleName
    })
    req.data = CreateUserResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateUserBodySchema.parse(req.body)
    const params = GetUserParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const roleName = req[REQUEST_ROLE_PERMISSIONS]?.name as string
    const data = await this.userService.update({
      data: body,
      id: params.userId,
      updatedById: userId,
      updatedByRoleName: roleName
    })
    req.data = UpdateProfileResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetUserParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const roleName = req[REQUEST_ROLE_PERMISSIONS]?.name as string
    const data = await this.userService.delete({
      id: params.userId,
      deletedById: userId,
      deletedByRoleName: roleName
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const userController = new UserController(userService)
