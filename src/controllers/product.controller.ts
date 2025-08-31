import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateProductBodySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  ProductSchema,
  UpdateProductBodySchema
} from '~/models/product.model'
import { MessageResSchema } from '~/models/response.model'
import { productService, ProductService } from '~/services/product.service'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = GetProductsQuerySchema.parse(req.query)
    const data = await this.productService.list(
      {
        page: query.page,
        limit: query.limit
      },
      lang
    )
    req.data = GetProductsResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const params = GetProductParamsSchema.parse(req.params)
    const data = await this.productService.findById(params.productId, lang)
    req.data = GetProductDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateProductBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productService.create({
      data: body,
      createdById: userId
    })
    req.data = GetProductDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateProductBodySchema.parse(req.body)
    const params = GetProductParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productService.update({
      data: body,
      id: params.productId,
      updatedById: userId
    })
    req.data = ProductSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetProductParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.productService.delete({
      id: params.productId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const productController = new ProductController(productService)
