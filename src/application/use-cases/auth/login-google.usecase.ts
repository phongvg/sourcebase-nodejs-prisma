import { randomUUID } from 'crypto'
import { LoginGoogleRequestDTO, LoginResponseDTO } from '~/application/dtos/auth/login.dto'
import { GoogleOAuth } from '~/application/ports/services/google-oauth.port'
import { TokenService } from '~/application/ports/services/token.port'
import { SessionStore } from '~/application/ports/services/session-store.port'
import { UserRepository } from '~/application/ports/user.repository'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

export class LoginGoogleUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly googleOAuth: GoogleOAuth,
    private readonly tokenService: TokenService,
    private readonly sessionStore: SessionStore
  ) {}

  async execute(payload: LoginGoogleRequestDTO): Promise<LoginResponseDTO> {
    // Verify Google ID token
    const googleUser = await this.googleOAuth.verifyIdToken(payload.idToken)

    // Upsert user (create if not exists, update if exists)
    const user = await this.userRepository.upsertGoogleUser({
      googleSub: googleUser.googleSub,
      email: googleUser.email,
      fullName: googleUser.fullName,
      avatarUrl: googleUser.avatarUrl
    })

    if (!user.isActive) {
      throw new AppError(ERROR_CODE.USER_DISABLED)
    }

    // Create session ID (ghi đè session cũ nếu có)
    const sessionId = randomUUID()

    // Save session to Redis
    await this.sessionStore.set(user.id, sessionId)

    // Update last login time
    await this.userRepository.updateLastLogin(user.id)

    // Generate tokens
    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
      sid: sessionId
    })

    const refreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
      sid: sessionId
    })

    return {
      accessToken,
      refreshToken
    }
  }
}
