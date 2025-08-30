import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const CategoryTranslationAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      path: 'languageId',
      message: 'Error.CategoryTranslationAlreadyExists'
    }
  ]
})
