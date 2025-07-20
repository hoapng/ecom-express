import { Router } from 'express'
import { roleController } from '~/controllers/role.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const roleRouter = Router()

roleRouter.get(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => roleController.list(req, res, next))
)

roleRouter.get(
  '/:roleId',
  auth(),
  wrapRequestHandler((req, res, next) => roleController.findById(req, res, next))
)

roleRouter.post(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => roleController.create(req, res, next))
)

roleRouter.put(
  '/:roleId',
  auth(),
  wrapRequestHandler((req, res, next) => roleController.update(req, res, next))
)

roleRouter.delete(
  '/:roleId',
  auth(),
  wrapRequestHandler((req, res, next) => roleController.delete(req, res, next))
)

export default roleRouter
