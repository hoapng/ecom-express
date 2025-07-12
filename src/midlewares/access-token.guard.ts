import { NextFunction } from 'express'
import createHttpError from 'http-errors'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { TokenService } from '~/services/token.service'

export const accessTokenGuard = (req: any, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    return next(createHttpError.Unauthorized())
  }
  const decodedAccessToken = TokenService.verifyAccessToken(accessToken)
  req[REQUEST_USER_KEY] = decodedAccessToken
}
