import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateCategoryTranslationBodySchema,
  GetCategoryTranslationDetailResSchema,
  GetCategoryTranslationParamsSchema,
  UpdateCategoryTranslationBodySchema
} from '~/models/category-translation.model'
import { MessageResSchema } from '~/models/response.model'
import { categoryTranslationService, CategoryTranslationService } from '~/services/category-translation.service'

export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetCategoryTranslationParamsSchema.parse(req.params)
    const data = await this.categoryTranslationService.findById(params.categoryTranslationId)
    req.data = GetCategoryTranslationDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateCategoryTranslationBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryTranslationService.create({
      data: body,
      createdById: userId
    })
    req.data = GetCategoryTranslationDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateCategoryTranslationBodySchema.parse(req.body)
    const params = GetCategoryTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryTranslationService.update({
      data: body,
      id: params.categoryTranslationId,
      updatedById: userId
    })
    req.data = GetCategoryTranslationDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetCategoryTranslationParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryTranslationService.delete({
      id: params.categoryTranslationId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const categoryTranslationController = new CategoryTranslationController(categoryTranslationService)
