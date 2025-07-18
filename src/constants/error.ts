import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

// OTP related errors
export const InvalidOTPException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.InvalidOTP',
      path: 'code'
    }
  ]
})

export const OTPExpiredException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.OTPExpired',
      path: 'code'
    }
  ]
})

export const FailedToSendOTPException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.FailedToSendOTP',
      path: 'code'
    }
  ]
})

// Email related errors
export const EmailAlreadyExistsException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.EmailAlreadyExists',
      path: 'ema}il'
    }
  ]
})

export const EmailNotFoundException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.EmailNotFound',
      path: 'email'
    }
  ]
})

// Password related errors
export const InvalidPasswordException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.InvalidPassword',
      path: 'passwo}rd'
    }
  ]
})

// Auth token related errors
export const RefreshTokenAlreadyUsedException = createHttpError.Unauthorized('Error.RefreshTokenAlreadyUsed')
export const UnauthorizedAccessException = createHttpError.Unauthorized('Error.UnauthorizedAccess')

// Google auth related errors
export const GoogleUserInfoError = new Error('Error.FailedToGetGoogleUserInfo')

export const TOTPAlreadyEnabledException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.TOTPAlreadyEnabled',
      path: 'totpCode'
    }
  ]
})

export const TOTPNotEnabledException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.TOTPNotEnabled',
      path: 'totpCode'
    }
  ]
})

export const InvalidTOTPAndCodeException = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, {
  message: [
    {
      message: 'Error.InvalidTOTPAndCode',
      path: 'totpCode'
    },
    {
      message: 'Error.InvalidTOTPAndCode',
      path: 'code'
    }
  ]
})
