import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { authService, AuthService } from '~/services/auth.service'
import {
  ForgotPasswordBodySchema,
  GetAuthorizationUrlResSchema,
  LoginBodySchema,
  LoginResSchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema,
  TwoFactorSetupResSchema
} from '~/models/auth.model'
import { MessageResSchema } from '~/models/response.model'
import { googleService, GoogleService } from '~/services/google.service'
import envConfig from '~/config/evnConfig'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { EmptyBodySchema } from '~/models/request.model'

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const body = RegisterBodySchema.parse(req.body)
    const data = await this.authService.register(body)
    req.data = RegisterResSchema.parse(data)
    return next()
  }

  async sendOTP(req: Request, res: Response, next: NextFunction) {
    const body = SendOTPBodySchema.parse(req.body)
    const data = await this.authService.sendOTP(body)
    req.data = SendOTPBodySchema.parse(data)
    return next()
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const body = LoginBodySchema.parse(req.body)
    const data = await this.authService.login({
      ...body,
      userAgent: req.headers['user-agent'] as string,
      ip: req.clientIp as string
    })
    req.data = LoginResSchema.parse(data)
    return next()
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const body = RefreshTokenResSchema.parse(req.body)
    const data = await this.authService.refreshToken({
      ...body,
      userAgent: req.headers['user-agent'] as string,
      ip: req.clientIp as string
    })
    req.data = RefreshTokenResSchema.parse(data)
    req.statusCode = StatusCodes.OK
    return next()
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const body = RefreshTokenResSchema.parse(req.body)
    const data = await this.authService.logout(body.refreshToken)
    req.data = MessageResSchema.parse(data)
    return next()
  }

  getAuthorizationUrl(req: Request, res: Response, next: NextFunction) {
    const data = this.googleService.getAuthorizationUrl({
      userAgent: req.headers['user-agent'] as string,
      ip: req.clientIp as string
    })
    req.data = GetAuthorizationUrlResSchema.parse(data)
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
    const body = ForgotPasswordBodySchema.parse(req.body)
    const data = await this.authService.forgotPassword(body)
    req.data = MessageResSchema.parse(data)
    return next()
  }

  async setupTwoFactorAuth(req: Request, res: Response, next: NextFunction) {
    EmptyBodySchema.parse(req.body)
    const data = await this.authService.setupTwoFactorAuth(req[REQUEST_USER_KEY]?.userId as number)
    req.data = TwoFactorSetupResSchema.parse(data)
    return next()
  }
}

export const authController = new AuthController(authService, googleService)
