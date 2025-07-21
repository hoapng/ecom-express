import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { HTTPMethod } from '~/constants/role.constant'
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
      path = path.replace(`/${lastSegment}`, '/:id')
    }

    const roleId: number = decodedAccessToken.roleId
    const method = request.method as keyof typeof HTTPMethod
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
  }
}

export const accessTokenGuard = new AccessTokenGuard(tokenService, prismaService)
