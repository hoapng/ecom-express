import { Router } from 'express'
import { permissionController } from '~/controllers/permission.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const permissionRouter = Router()

permissionRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => permissionController.list(req, res, next))
)

permissionRouter.get(
  '/:permissionId',
  wrapRequestHandler((req, res, next) => permissionController.findById(req, res, next))
)

permissionRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => permissionController.create(req, res, next))
)

permissionRouter.put(
  '/:permissionId',
  wrapRequestHandler((req, res, next) => permissionController.update(req, res, next))
)

permissionRouter.delete(
  '/:permissionId',
  wrapRequestHandler((req, res, next) => permissionController.delete(req, res, next))
)

export default permissionRouter
