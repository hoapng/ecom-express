import { Router } from 'express'
import { paymentController } from '~/controllers/payment.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const paymentRouter = Router()

paymentRouter.post(
  '/receiver',
  auth(['PaymentAPIKey']),
  wrapRequestHandler((req, res, next) => paymentController.receiver(req, res, next))
)

export default paymentRouter
