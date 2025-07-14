import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { tokenService, TokenService } from '~/services/token.service'

export class AccessTokenGuard {
  constructor(private readonly tokenService: TokenService) {}

  canActivate = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      return next(createHttpError.Unauthorized())
    }
    const decodedAccessToken = this.tokenService.verifyAccessToken(accessToken)
    req[REQUEST_USER_KEY] = decodedAccessToken
  }
}

export const accessTokenGuard = new AccessTokenGuard(tokenService).canActivate
