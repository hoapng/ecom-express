import { StatusCodes } from 'http-status-codes'
import { REQUEST_USER_KEY } from './constants/auth.constant'
import { AccessTokenPayload } from './types/jwt.type'
import { VariantsType } from './models/product.model'
import { ProductTranslationType } from './models/product-translation.model'

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
  namespace PrismaJson {
    type Variants = VariantsType
    type ProductTranslations = Pick<ProductTranslationType, 'id' | 'name' | 'description' | 'languageId'>[]
    type Receiver = {
      name: string
      phone: string
      address: string
    }
  }
}

export {}
