import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'

export class PaymentAPIKeyGuard {
  canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const paymentApiKey = req.headers['payment-api-key']
    if (paymentApiKey !== envConfig.PAYMENT_API_KEY) {
      throw createHttpError.Unauthorized()
    }
    return Promise.resolve(true)
  }
}

export const paymentApiKeyGuard = new PaymentAPIKeyGuard()
