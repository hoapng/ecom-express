import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authService, AuthService } from '~/services/auth.service'
import {
  GetAuthorizationUrlResSchema,
  LoginResSchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema
} from '~/models/auth.model'
import { MessageResSchema } from '~/models/response.model'
import { googleService, GoogleService } from '~/services/google.service'
import envConfig from '~/config/evnConfig'

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.register(req.body)
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

  getAuthorizationUrl(req: Request, res: Response, next: NextFunction) {
    const data = this.googleService.getAuthorizationUrl({
      userAgent: req.headers['user-agent'] as string,
      ip: req.clientIp as string
    })
    req.data = GetAuthorizationUrlResSchema.parse(data)
    req.statusCode = StatusCodes.CREATED
    next()
    return Promise.resolve()
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.googleService.googleCallback({
        code: req.query.code as string,
        state: req.query.state as string
      })
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const data = await this.authService.forgotPassword(req.body)
    req.data = MessageResSchema.parse(data)
    req.statusCode = StatusCodes.CREATED
    return next()
  }
}

export const authController = new AuthController(authService, googleService)
