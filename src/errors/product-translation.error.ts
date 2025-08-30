import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const ProductTranslationAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      path: 'productId',
      message: 'Error.ProductTranslationAlreadyExists'
    }
  ]
})
