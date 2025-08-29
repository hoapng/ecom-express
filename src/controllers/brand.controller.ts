import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { I18nTranslations } from '~/generated/i18n.generated'
import {
  CreateBrandBodySchema,
  GetBrandDetailResSchema,
  GetBrandParamsSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema
} from '~/models/brand.model'
import { PaginationQuerySchema } from '~/models/request.model'
import { MessageResSchema } from '~/models/response.model'
import { brandService, BrandService } from '~/services/brand.service'

export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = PaginationQuerySchema.parse(req.query)
    const data = await this.brandService.list(
      {
        page: query.page,
        limit: query.limit
      },
      lang
    )
    req.data = GetBrandsResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const params = GetBrandParamsSchema.parse(req.params)
    const data = await this.brandService.findById(params.brandId, lang)
    req.data = GetBrandDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateBrandBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandService.create({
      data: body,
      createdById: userId
    })
    req.data = GetBrandDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateBrandBodySchema.parse(req.body)
    const params = GetBrandParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandService.update({
      data: body,
      id: params.brandId,
      updatedById: userId
    })
    req.data = GetBrandDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetBrandParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandService.delete({
      id: params.brandId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const brandController = new BrandController(brandService)
