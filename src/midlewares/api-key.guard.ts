import { NextFunction } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'

export const apiKeyGuard = (req: any, res: Response, next: NextFunction) => {
  const xAPIKey = req.headers['x-api-key']
  if (xAPIKey !== envConfig.SECRET_API_KEY) {
    return next(createHttpError.Unauthorized())
  }
  next()
}
