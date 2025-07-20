import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import envConfig from '~/config/evnConfig'
import {
  AuthType,
  AuthTypeDecoratorPayload,
  AuthTypeType,
  ConditionGuard,
  ConditionGuardType,
  REQUEST_USER_KEY
} from '~/constants/auth.constant'
import { tokenService, TokenService } from '~/services/token.service'
import { accessTokenGuard, AccessTokenGuard } from './access-token.guard'
import { apiKeyGuard, APIKeyGuard } from './api-key.guard'

export interface CanActivate {
  canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean>
}

export class AuthenticationGuard {
  private readonly authTypeGuardMap: Record<AuthTypeType, CanActivate>
  constructor(
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.APIKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => Promise.resolve(true) }
    }
  }

  async canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    const authTypeValue = this.getAuthTypeValue(req)
    const guards = authTypeValue.authTypes.map((authType: AuthTypeType) => this.authTypeGuardMap[authType])
    return authTypeValue.options.condition === ConditionGuard.And
      ? this.handleAndCondition(guards, req, res, next)
      : this.handleOrCondition(guards, req, res, next)
  }

  private getAuthTypeValue(req: Request): AuthTypeDecoratorPayload {
    return req.authTypes && req.options?.condition
      ? { authTypes: req.authTypes, options: { condition: req.options?.condition } }
      : {
          authTypes: [AuthType.Bearer],
          options: { condition: ConditionGuard.And }
        }
  }

  private async handleOrCondition(guards: CanActivate[], req: Request, res: Response, next: NextFunction) {
    let lastError: any = null

    // Duyệt qua hết các guard, nếu có 1 guard pass thì return true
    for (const guard of guards) {
      try {
        if (await guard.canActivate(req, res, next)) {
          return true
        }
      } catch (error) {
        lastError = error
      }
    }

    if (lastError instanceof createHttpError.HttpError) {
      throw lastError
    }
    throw new createHttpError.Unauthorized()
  }

  private async handleAndCondition(guards: CanActivate[], req: Request, res: Response, next: NextFunction) {
    // Duyệt qua hết các guard, nếu mọi guard đều pass thì return true
    for (const guard of guards) {
      try {
        if (!(await guard.canActivate(req, res, next))) {
          throw new createHttpError.Unauthorized()
        }
      } catch (error) {
        if (error instanceof createHttpError.HttpError) {
          throw error
        }
        throw createHttpError.Unauthorized()
      }
    }
    return true
  }

  auth(
    authTypes: AuthTypeType[] = [AuthType.Bearer],
    options: { condition: ConditionGuardType } = { condition: ConditionGuard.And }
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      req.authTypes = authTypes
      req.options = options
      try {
        await this.canActivate(req, res, next)
      } catch (error) {
        return next(error)
      }
      return next()
    }
  }
}

export const authenticationGuard = new AuthenticationGuard(accessTokenGuard, apiKeyGuard)

export const auth = authenticationGuard.auth.bind(authenticationGuard)
