import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationDetailResSchema,
  GetProductTranslationParamsSchema,
  UpdateProductTranslationBodySchema
} from '~/models/product-translation.model'
import { MessageResSchema } from '~/models/response.model'
import { productTranslationService, ProductTranslationService } from '~/services/product-translation.service'

export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetProductTranslationParamsSchema.parse(req.params)
    const data = await this.productTranslationService.findById(params.productTranslationId)
    req.data = GetProductTranslationDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateProductTranslationBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productTranslationService.create({
      data: body,
      createdById: userId
    })
    req.data = GetProductTranslationDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateProductTranslationBodySchema.parse(req.body)
    const params = GetProductTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productTranslationService.update({
      data: body,
      id: params.productTranslationId,
      updatedById: userId
    })
    req.data = GetProductTranslationDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetProductTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productTranslationService.delete({
      id: params.productTranslationId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const productTranslationController = new ProductTranslationController(productTranslationService)
