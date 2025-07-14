import jwt from 'jsonwebtoken'
import envConfig from '~/config/evnConfig'
import {
  AccessTokenPayload,
  AccessTokenPayloadCreate,
  RefreshTokenPayload,
  RefreshTokenPayloadCreate
} from '~/types/jwt.type'
import { v4 as uuidv4 } from 'uuid'

export class TokenService {
  static signAccessToken(payload: AccessTokenPayloadCreate) {
    return jwt.sign({ ...payload, uuid: uuidv4() }, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  static signRefreshToken(payload: RefreshTokenPayloadCreate) {
    return jwt.sign({ ...payload, uuid: uuidv4() }, envConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as AccessTokenPayload
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as RefreshTokenPayload
  }
}
