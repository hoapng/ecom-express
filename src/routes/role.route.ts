import { Router } from 'express'
import { roleController } from '~/controllers/role.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const roleRouter = Router()

roleRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => roleController.list(req, res, next))
)

roleRouter.get(
  '/:roleId',
  wrapRequestHandler((req, res, next) => roleController.findById(req, res, next))
)

roleRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => roleController.create(req, res, next))
)

roleRouter.put(
  '/:roleId',
  wrapRequestHandler((req, res, next) => roleController.update(req, res, next))
)

roleRouter.delete(
  '/:roleId',
  wrapRequestHandler((req, res, next) => roleController.delete(req, res, next))
)

export default roleRouter
