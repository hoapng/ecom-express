import { Router } from 'express'
import { AuthController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const authRouter = Router()

authRouter.post('/register', wrapRequestHandler(AuthController.register))

authRouter.post('/login', wrapRequestHandler(AuthController.login))

authRouter.post('/refresh-token', wrapRequestHandler(AuthController.refreshToken))

authRouter.post('/logout', wrapRequestHandler(AuthController.logout))

export default authRouter
