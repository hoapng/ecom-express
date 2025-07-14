import { StatusCodes } from 'http-status-codes'
import { TokenPayload } from './types/jwt.type'
import { REQUEST_USER_KEY } from './constants/auth.constant'

declare global {
  namespace Express {
    interface Request {
      data?: any
      statusCode?: StatusCodes
      [REQUEST_USER_KEY]?: TokenPayload
      [key: string]: any // Allow additional properties
    }
  }
}

export {}
