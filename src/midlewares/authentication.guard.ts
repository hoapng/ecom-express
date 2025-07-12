import { NextFunction } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'
import { AuthType, AuthTypeType, ConditionGuard, ConditionGuardType, REQUEST_USER_KEY } from '~/constants/auth.constant'
import { TokenService } from '~/services/token.service'

export const authenticationGuard =
  (
    authTypes: AuthTypeType[] = [AuthType.None],
    options: { condition: ConditionGuardType } = { condition: ConditionGuard.And }
  ) =>
  (req: any, res: Response, next: NextFunction) => {
    const xAPIKey = req.headers['x-api-key']
    const accessToken = req.headers.authorization?.split(' ')[1]

    if (options.condition === ConditionGuard.Or && (xAPIKey === envConfig.SECRET_API_KEY || accessToken)) {
      if (accessToken) {
        const decodedAccessToken = TokenService.verifyAccessToken(accessToken)
        req[REQUEST_USER_KEY] = decodedAccessToken
      }
      return next()
    }

    if (options.condition === ConditionGuard.And && xAPIKey === envConfig.SECRET_API_KEY && accessToken) {
      const decodedAccessToken = TokenService.verifyAccessToken(accessToken)
      req[REQUEST_USER_KEY] = decodedAccessToken
      return next()
    }

    return next(createHttpError.Unauthorized())
  }
