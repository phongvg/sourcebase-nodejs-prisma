export type AccessTokenPayload = {
  userId: string
  role: 'USER' | 'ADMIN'
  sid: string
}

export type RefreshTokenPayload = {
  userId: string
  sid: string
}

export interface TokenService {
  generateAccessToken(payload: AccessTokenPayload): Promise<string>
  generateRefreshToken(payload: RefreshTokenPayload): Promise<string>

  verifyAccessToken(token: string): Promise<AccessTokenPayload>
  verifyRefreshToken(token: string): Promise<RefreshTokenPayload>
}
