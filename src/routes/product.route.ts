import { Router } from 'express'
import { productController } from '~/controllers/product.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const productRouter = Router()

productRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => productController.list(req, res, next))
)

productRouter.get(
  '/:productId',
  wrapRequestHandler((req, res, next) => productController.findById(req, res, next))
)

productRouter.post(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => productController.create(req, res, next))
)

productRouter.put(
  '/:productId',
  auth(),
  wrapRequestHandler((req, res, next) => productController.update(req, res, next))
)

productRouter.delete(
  '/:productId',
  auth(),
  wrapRequestHandler((req, res, next) => productController.delete(req, res, next))
)

export default productRouter
