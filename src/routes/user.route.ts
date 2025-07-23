import { Router } from 'express'
import { userController } from '~/controllers/user.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const userRouter = Router()

userRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => userController.list(req, res, next))
)

userRouter.get(
  '/:userId',
  wrapRequestHandler((req, res, next) => userController.findById(req, res, next))
)

userRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => userController.create(req, res, next))
)

userRouter.put(
  '/:userId',
  wrapRequestHandler((req, res, next) => userController.update(req, res, next))
)

userRouter.delete(
  '/:userId',
  wrapRequestHandler((req, res, next) => userController.delete(req, res, next))
)

export default userRouter
