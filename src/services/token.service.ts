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
  signAccessToken(payload: AccessTokenPayloadCreate) {
    return jwt.sign({ ...payload, uuid: uuidv4() }, envConfig.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  signRefreshToken(payload: RefreshTokenPayloadCreate) {
    return jwt.sign({ ...payload, uuid: uuidv4() }, envConfig.REFRESH_TOKEN_SECRET, {
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    })
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET) as AccessTokenPayload
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET) as RefreshTokenPayload
  }
}

export const tokenService = new TokenService()
