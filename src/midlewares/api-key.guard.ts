import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'

export class APIKeyGuard {
  canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const xAPIKey = req.headers['x-api-key']
    if (xAPIKey !== envConfig.SECRET_API_KEY) {
      throw createHttpError.Unauthorized()
    }
    return Promise.resolve(true)
  }
}

export const apiKeyGuard = new APIKeyGuard()
