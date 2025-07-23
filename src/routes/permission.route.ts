import { Router } from 'express'
import { permissionController } from '~/controllers/permission.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const permissionRouter = Router()

permissionRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => permissionController.list(req, res, next))
)

permissionRouter.get(
  '/:id',
  wrapRequestHandler((req, res, next) => permissionController.findById(req, res, next))
)

permissionRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => permissionController.create(req, res, next))
)

permissionRouter.put(
  '/:id',
  wrapRequestHandler((req, res, next) => permissionController.update(req, res, next))
)

permissionRouter.delete(
  '/:id',
  wrapRequestHandler((req, res, next) => permissionController.delete(req, res, next))
)

export default permissionRouter
