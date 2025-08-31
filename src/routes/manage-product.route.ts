import { Router } from 'express'
import { manageProductController } from '~/controllers/manage-product.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const manageProductRouter = Router()

manageProductRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => manageProductController.list(req, res, next))
)

manageProductRouter.get(
  '/:manageProductId',
  wrapRequestHandler((req, res, next) => manageProductController.findById(req, res, next))
)

manageProductRouter.post(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => manageProductController.create(req, res, next))
)

manageProductRouter.put(
  '/:manageProductId',
  auth(),
  wrapRequestHandler((req, res, next) => manageProductController.update(req, res, next))
)

manageProductRouter.delete(
  '/:manageProductId',
  auth(),
  wrapRequestHandler((req, res, next) => manageProductController.delete(req, res, next))
)

export default manageProductRouter
