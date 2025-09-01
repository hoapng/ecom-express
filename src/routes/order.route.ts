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

export default orderRouter
