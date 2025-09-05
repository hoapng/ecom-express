import { NextFunction, Request, Response } from 'express'
import { WebhookPaymentBodySchema } from '~/models/payment.model'
import { MessageResSchema } from '~/models/response.model'
import { paymentService, PaymentService } from '~/services/payment.service'

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  async receiver(req: Request, res: Response, next: NextFunction) {
    const body = WebhookPaymentBodySchema.parse(req.body)
    const data = await this.paymentService.receiver(body)
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const paymentController = new PaymentController(paymentService)
