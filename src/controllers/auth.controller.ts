import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authService, AuthService } from '~/services/auth.service'
import { LoginResSchema, RefreshTokenResSchema, RegisterBodySchema, RegisterResSchema } from '~/models/auth.model'
import { MessageResSchema } from '~/models/response.model'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const body = RegisterBodySchema.parse(req.body) // Validate request body
    const data = await this.authService.register(body)
    req.data = RegisterResSchema.parse(data)
    req.statusCode = StatusCodes.CREATED
    return next()
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.sendOTP(req.body)
    req.data = data
    req.statusCode = StatusCodes.CREATED
    return next()
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.login({
      ...req.body,
      userAgent: req.headers['user-agent'],
      ip: req.clientIp
    })
    req.data = LoginResSchema.parse(data)
    req.statusCode = StatusCodes.CREATED
    return next()
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.refreshToken({
      ...req.body,
      userAgent: req.headers['user-agent'],
      ip: req.clientIp
    })
    req.data = RefreshTokenResSchema.parse(data)
    req.statusCode = StatusCodes.OK
    return next()
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.logout(req.body.refreshToken)
    req.data = MessageResSchema.parse(data)
    req.statusCode = StatusCodes.CREATED
    return next()
  }
}

export const authController = new AuthController(authService)
