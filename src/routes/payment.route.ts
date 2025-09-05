import { Router } from 'express'
import { paymentController } from '~/controllers/payment.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const paymentRouter = Router()

paymentRouter.post(
  '/receiver',
  wrapRequestHandler((req, res, next) => paymentController.receiver(req, res, next))
)

export default paymentRouter
