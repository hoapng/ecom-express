import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const RoleAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.RoleAlreadyExists',
      path: 'name'
    }
  ]
})

export const ProhibitedActionOnBaseRoleException = createHttpError.Forbidden('Error.ProhibitedActionOnBaseRole')
