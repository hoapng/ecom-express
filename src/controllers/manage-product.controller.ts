import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateProductBodySchema,
  GetManageProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsResSchema,
  ProductSchema,
  UpdateProductBodySchema
} from '~/models/product.model'
import { MessageResSchema } from '~/models/response.model'
import { manageProductService, ManageProductService } from '~/services/manage-product.service'
import { AccessTokenPayload } from '~/types/jwt.type'

export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = GetManageProductsQuerySchema.parse(req.query)
    const user = req[REQUEST_USER_KEY] as AccessTokenPayload
    const data = await this.manageProductService.list(
      {
        query,
        roleNameRequest: user.roleName,
        userIdRequest: user.userId
      },
      lang
    )
    req.data = GetProductsResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const params = GetProductParamsSchema.parse(req.params)
    const user = req[REQUEST_USER_KEY] as AccessTokenPayload
    const data = await this.manageProductService.getDetail(
      {
        productId: params.productId,
        roleNameRequest: user.roleName,
        userIdRequest: user.userId
      },
      lang
    )
    req.data = GetProductDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateProductBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.manageProductService.create({
      data: body,
      createdById: userId
    })
    req.data = GetProductDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateProductBodySchema.parse(req.body)
    const params = GetProductParamsSchema.parse(req.params)
    const user = req[REQUEST_USER_KEY] as AccessTokenPayload
    const data = await this.manageProductService.update({
      data: body,
      productId: params.productId,
      updatedById: user.userId,
      roleNameRequest: user.roleName
    })
    req.data = ProductSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetProductParamsSchema.parse(req.params)
    const user = req[REQUEST_USER_KEY] as AccessTokenPayload
    const data = await this.manageProductService.delete({
      productId: params.productId,
      deletedById: user.userId,
      roleNameRequest: user.roleName
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const manageProductController = new ManageProductController(manageProductService)
