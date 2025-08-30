import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateCategoryBodySchema,
  GetAllCategoriesQuerySchema,
  GetAllCategoriesResSchema,
  GetCategoryDetailResSchema,
  GetCategoryParamsSchema,
  UpdateCategoryBodySchema
} from '~/models/category.model'
import { MessageResSchema } from '~/models/response.model'
import { categoryService, CategoryService } from '~/services/category.service'

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async findAll(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = GetAllCategoriesQuerySchema.parse(req.query)
    const data = await this.categoryService.findAll(lang, query.parentCategoryId)
    req.data = GetAllCategoriesResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const params = GetCategoryParamsSchema.parse(req.params)
    const data = await this.categoryService.findById(params.categoryId, lang)
    req.data = GetCategoryDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateCategoryBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryService.create({
      data: body,
      createdById: userId
    })
    req.data = GetCategoryDetailResSchema.parse(data)
    return next()
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateCategoryBodySchema.parse(req.body)
    const params = GetCategoryParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryService.update({
      data: body,
      id: params.categoryId,
      updatedById: userId
    })
    req.data = GetCategoryDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetCategoryParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.categoryService.delete({
      id: params.categoryId,
      deletedById: userId
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const categoryController = new CategoryController(categoryService)
