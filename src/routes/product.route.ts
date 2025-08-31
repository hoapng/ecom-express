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

export default productRouter
