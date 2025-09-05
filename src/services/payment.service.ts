import { WebhookPaymentBodyType } from '~/models/payment.model'
import { paymentRepo, PaymentRepo } from '~/repositories/payment.repo'

export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  receiver(body: WebhookPaymentBodyType) {
    return this.paymentRepo.receiver(body)
  }
}

export const paymentService = new PaymentService(paymentRepo)
