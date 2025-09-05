import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import pluralize from 'pluralize'
import { REQUEST_ROLE_PERMISSIONS, REQUEST_USER_KEY } from '~/constants/auth.constant'
import { HTTPMethodType } from '~/constants/role.constant'
import { prismaService, PrismaService } from '~/services/prisma.service'
import { tokenService, TokenService } from '~/services/token.service'
import { AccessTokenPayload } from '~/types/jwt.type'

export class AccessTokenGuard {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(req: Request, res: Response, next: NextFunction): Promise<boolean> {
    // Extract và validate token
    const decodedAccessToken = this.extractAndValidateToken(req)

    // Check user permission
    await this.validateUserPermission(decodedAccessToken, req)
    return true
  }

  private extractAndValidateToken(request: Request): AccessTokenPayload {
    const accessToken = this.extractAccessTokenFromHeader(request)

    const decodedAccessToken = this.tokenService.verifyAccessToken(accessToken)

    request[REQUEST_USER_KEY] = decodedAccessToken
    return decodedAccessToken
  }

  private extractAccessTokenFromHeader(request: Request): string {
    const accessToken = request.headers.authorization?.split(' ')[1]
    if (!accessToken) {
      throw createHttpError.Unauthorized('Error.MissingAccessToken')
    }
    return accessToken
  }

  private async validateUserPermission(decodedAccessToken: AccessTokenPayload, request: Request): Promise<void> {
    let path = request.originalUrl.split('?')[0]
    const lastSegment = path.split('/').at(-1)

    if (lastSegment && !Number.isNaN(Number(lastSegment))) {
      const module = pluralize.singular(
        request.baseUrl.slice(1).replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
      )

      if (['cart'].includes(module)) {
        path = path.replace(`/${lastSegment}`, `/:${module}ItemId`)
      } else path = path.replace(`/${lastSegment}`, `/:${module}Id`)
    }

    const roleId: number = decodedAccessToken.roleId
    const method = request.method as HTTPMethodType
    const role = await this.prismaService.role
      .findUniqueOrThrow({
        where: {
          id: roleId,
          deletedAt: null,
          isActive: true
        },
        include: {
          permissions: {
            where: {
              deletedAt: null,
              path,
              method
            }
          }
        }
      })
      .catch(() => {
        throw createHttpError.Forbidden()
      })
    const canAccess = role.permissions.length > 0
    if (!canAccess) {
      throw createHttpError.Forbidden()
    }
    request[REQUEST_ROLE_PERMISSIONS] = role
  }
}

export const accessTokenGuard = new AccessTokenGuard(tokenService, prismaService)
