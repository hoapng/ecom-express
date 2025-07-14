import { Router } from 'express'
import { authController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const authRouter = Router()

authRouter.post(
  '/register',
  wrapRequestHandler((req, res, next) => authController.register(req, res, next))
)

authRouter.post(
  '/otp',
  wrapRequestHandler((req, res, next) => authController.sendOTP(req, res, next))
)

authRouter.post(
  '/login',
  wrapRequestHandler((req, res, next) => authController.login(req, res, next))
)

authRouter.post(
  '/refresh-token',
  wrapRequestHandler((req, res, next) => authController.refreshToken(req, res, next))
)

authRouter.post(
  '/logout',
  wrapRequestHandler((req, res, next) => authController.logout(req, res, next))
)

export default authRouter
