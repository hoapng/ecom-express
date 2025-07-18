import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const LanguageAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.LanguageAlreadyExists',
      path: 'id'
    }
  ]
})
