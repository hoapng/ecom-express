import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateLanguageBodySchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguagesResSchema,
  UpdateLanguageBodySchema
} from '~/models/language.model'
import { MessageResSchema } from '~/models/response.model'
import { languageService, LanguageService } from '~/services/language.service'

export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  async findAll(req: Request, res: Response, next: NextFunction) {
    const data = await this.languageService.findAll()
    req.data = GetLanguagesResSchema.parse(data)
    return next()
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const params = GetLanguageParamsSchema.parse(req.params)
    const data = await this.languageService.findById(params.languageId)
    req.data = GetLanguageDetailResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateLanguageBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.languageService.create({
      data: body,
      createdById: userId
    })
    req.data = GetLanguageDetailResSchema.parse(data)
    return next()
  }

  // Không cho phép cập nhật id: Vì id là mã ngôn ngữ do người dùng tạo (ví dụ: 'en', 'vi'), nó nên bất biến (immutable). Nếu cần thay đổi id, bạn nên xóa ngôn ngữ cũ và tạo mới.

  // Kiểm tra soft delete: Theo nguyên tắc chung của soft delete, không nên cho phép cập nhật bản ghi đã bị xóa trừ khi có yêu cầu đặc biệt (ví dụ: khôi phục hoặc chỉnh sửa dữ liệu lịch sử).

  async update(req: Request, res: Response, next: NextFunction) {
    const body = UpdateLanguageBodySchema.parse(req.body)
    const params = GetLanguageParamsSchema.parse(req.params)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.languageService.update({
      data: body,
      id: params.languageId,
      updatedById: userId
    })
    req.data = GetLanguageDetailResSchema.parse(data)
    return next()
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const params = GetLanguageParamsSchema.parse(req.params)
    const data = await this.languageService.delete(params.languageId)
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const languageController = new LanguageController(languageService)
