import { NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { AuthService } from '~/services/auth.service'
import { RegisterBodySchema } from '~/models/auth.model'

export class AuthController {
  static async register(req: any, res: Response, next: NextFunction) {
    const body = RegisterBodySchema.parse(req.body) // Validate request body
    const data = await AuthService.register(body)
    req.data = data
    req.statusCode = StatusCodes.CREATED
    return next()
  }

  static async login(req: any, res: Response, next: NextFunction) {
    const data = await AuthService.login(req.body)
    req.data = data
    req.statusCode = StatusCodes.CREATED
    return next()
  }

  static async refreshToken(req: any, res: Response, next: NextFunction) {
    const data = await AuthService.refreshToken(req.body.refreshToken)
    req.data = data
    req.statusCode = StatusCodes.OK
    return next()
  }

  static async logout(req: any, res: Response, next: NextFunction) {
    const data = await AuthService.logout(req.body.refreshToken)
    req.data = data
    req.statusCode = StatusCodes.CREATED
    return next()
  }
}
