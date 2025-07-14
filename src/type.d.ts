import { StatusCodes } from 'http-status-codes'
import { TokenPayload } from './types/jwt.type'

declare global {
  namespace Express {
    interface Request {
      data?: any
      statusCode?: StatusCodes
      user?: TokenPayload
      [key: string]: any // Allow additional properties
    }
  }
}

export {}
