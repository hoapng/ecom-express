import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  UpdateBrandTranslationBodySchema
} from '~/models/brand-translation.model'
import { MessageResSchema } from '~/models/response.model'
import { brandTranslationService, BrandTranslationService } from '~/services/brand-translation.service'

export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetBrandTranslationParamsSchema.parse(req.params)
    const data = await this.brandTranslationService.findById(params.brandTranslationId)
    req.data = GetBrandTranslationDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateBrandTranslationBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandTranslationService.create({
      data: body,
      createdById: userId
    })
    req.data = GetBrandTranslationDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateBrandTranslationBodySchema.parse(req.body)
    const params = GetBrandTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandTranslationService.update({
      data: body,
      id: params.brandTranslationId,
      updatedById: userId
    })
    req.data = GetBrandTranslationDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetBrandTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const brandTranslationController = new BrandTranslationController(brandTranslationService)
