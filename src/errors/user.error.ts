import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const UserAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.UserAlreadyExists',
      path: 'email'
    }
  ]
})

export const CannotUpdateAdminUserException = createHttpError.Forbidden('Error.CannotUpdateAdminUser')

export const CannotDeleteAdminUserException = createHttpError.Forbidden('Error.CannotDeleteAdminUser')

// Chỉ Admin mới có thể đặt role là ADMIN
export const CannotSetAdminRoleToUserException = createHttpError.Forbidden('Error.CannotSetAdminRoleToUser')

export const RoleNotFoundException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.RoleNotFound',
      path: 'roleId'
    }
  ]
})

// Không thể xóa hoặc cập nhật chính bản thân mình
export const CannotUpdateOrDeleteYourselfException = createHttpError.Forbidden('Error.CannotUpdateOrDeleteYourself')
