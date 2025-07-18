import { Router } from 'express'
import { authController } from '~/controllers/auth.controller'
import { auth } from '~/midlewares/authentication.guard'
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
  auth(),
  wrapRequestHandler((req, res, next) => authController.refreshToken(req, res, next))
)

authRouter.post(
  '/logout',
  auth(),
  wrapRequestHandler((req, res, next) => authController.logout(req, res, next))
)

authRouter.get(
  '/google-link',
  wrapRequestHandler((req, res, next) => authController.getAuthorizationUrl(req, res, next))
)

authRouter.get(
  '/google/callback',
  wrapRequestHandler((req, res, next) => authController.googleCallback(req, res, next))
)

authRouter.post(
  '/forgot-password',
  wrapRequestHandler((req, res, next) => authController.forgotPassword(req, res, next))
)

authRouter.post(
  '/2fa/setup',
  auth(),
  wrapRequestHandler((req, res, next) => authController.setupTwoFactorAuth(req, res, next))
)

authRouter.post(
  '/2fa/disable',
  auth(),
  wrapRequestHandler((req, res, next) => authController.disableTwoFactorAuth(req, res, next))
)

export default authRouter
