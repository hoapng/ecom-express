import { Router } from 'express'
import { cartController } from '~/controllers/cart.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const cartRouter = Router()

cartRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => cartController.getCart(req, res, next))
)

cartRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => cartController.addToCart(req, res, next))
)

cartRouter.put(
  '/:cartItemId',
  wrapRequestHandler((req, res, next) => cartController.updateCart(req, res, next))
)

cartRouter.delete(
  '/delete',
  wrapRequestHandler((req, res, next) => cartController.deleteCart(req, res, next))
)

export default cartRouter
