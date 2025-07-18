import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'
import { AuthType, AuthTypeType, ConditionGuard, ConditionGuardType, REQUEST_USER_KEY } from '~/constants/auth.constant'
import { tokenService, TokenService } from '~/services/token.service'
import { accessTokenGuard, AccessTokenGuard } from './access-token.guard'
import { apiKeyGuard, APIKeyGuard } from './api-key.guard'

export class AuthenticationGuard {
  private readonly authTypeGuardMap: Record<
    AuthTypeType,
    { canActivate: (req: Request, res: Response, next: NextFunction) => boolean }
  >
  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.APIKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true }
    }
  }

  async canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const authTypeValue = req ?? { authTypes: [AuthType.None], options: { condition: ConditionGuard.And } }
    const guards = authTypeValue.authTypes.map((authType: AuthTypeType) => this.authTypeGuardMap[authType])
    let error = createHttpError.Unauthorized()
    if (authTypeValue.options.condition === ConditionGuard.Or) {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(req, res, next)).catch((err) => {
          error = err
          return false
        })
        if (canActivate) {
          return true
        }
      }
      throw error
    } else {
      for (const instance of guards) {
        const canActivate = await Promise.resolve(instance.canActivate(req, res, next)).catch((err) => {
          error = err
          return false
        })
        if (!canActivate) {
          throw createHttpError.Unauthorized()
        }
      }
      return true
    }
  }

  auth(
    authTypes: AuthTypeType[] = [AuthType.Bearer],
    options: { condition: ConditionGuardType } = { condition: ConditionGuard.And }
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      req.authTypes = authTypes
      req.options = options
      const isPublic = await this.canActivate(req, res, next)
      if (!isPublic) {
        return next(createHttpError.Unauthorized())
      }
      return next()
    }
  }
}

export const authenticationGuard = new AuthenticationGuard(accessTokenGuard, apiKeyGuard)

export const auth = authenticationGuard.auth.bind(authenticationGuard)
