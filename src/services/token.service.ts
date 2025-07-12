import jwt from 'jsonwebtoken'
import envConfig from '~/config/evnConfig'
import { TokenPayload } from '~/types/jwt.type'

export class TokenService {
  static signAccessToken(payload: { userId: number }) {
    return jwt.sign(payload, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  static signRefreshToken(payload: { userId: number }) {
    return jwt.sign(payload, envConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as TokenPayload
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as TokenPayload
  }
}
