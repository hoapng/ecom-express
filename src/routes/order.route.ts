import { Router } from 'express'
import { orderController } from '~/controllers/order.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const orderRouter = Router()

orderRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => orderController.getCart(req, res, next))
)

orderRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => orderController.create(req, res, next))
)

orderRouter.get(
  '/:orderId',
  wrapRequestHandler((req, res, next) => orderController.detail(req, res, next))
)

orderRouter.put(
  '/:orderId',
  wrapRequestHandler((req, res, next) => orderController.cancel(req, res, next))
)

export default orderRouter
