import { NextFunction, Request, Response } from 'express'
import {
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema
} from '~/models/product.model'
import { productService, ProductService } from '~/services/product.service'

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = GetProductsQuerySchema.parse(req.query)
    const data = await this.productService.list(
      {
        query
      },
      lang
    )
    req.data = GetProductsResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const params = GetProductParamsSchema.parse(req.params)
    const data = await this.productService.getDetail(
      {
        productId: params.productId
      },
      lang
    )
    req.data = GetProductDetailResSchema.parse(data)
    return next()
  }
}

export const productController = new ProductController(productService)
