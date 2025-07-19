import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const PermissionAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.PermissionAlreadyExists',
      path: 'path'
    },
    {
      message: 'Error.PermissionAlreadyExists',
      path: 'method'
    }
  ]
})
