import { StatusCodes } from 'http-status-codes'
import { REQUEST_USER_KEY } from './constants/auth.constant'
import { AccessTokenPayload } from './types/jwt.type'

declare global {
  namespace Express {
    interface Request {
      data?: any
      statusCode?: StatusCodes
      [REQUEST_USER_KEY]?: AccessTokenPayload
      files?: Express.Multer.File[] // For file uploads
      [key: string]: any // Allow additional properties
    }
  }
}

export {}
