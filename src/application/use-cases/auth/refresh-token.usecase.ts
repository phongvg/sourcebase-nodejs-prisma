import { randomUUID } from 'crypto'
import { RefreshTokenRequestDTO, RefreshTokenResponseDTO } from '~/application/dtos/auth/refresh.dto'
import { TokenService } from '~/application/ports/services/token.port'
import { SessionStore } from '~/application/ports/services/session-store.port'
import { UserRepository } from '~/application/ports/user.repository'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly sessionStore: SessionStore
  ) {}

  async execute(payload: RefreshTokenRequestDTO): Promise<RefreshTokenResponseDTO> {
    const decoded = await this.tokenService.verifyRefreshToken(payload.refreshToken)
    const isValidSession = await this.sessionStore.isValid(decoded.userId, decoded.sid)
    if (!isValidSession) {
      throw new AppError(ERROR_CODE.UNAUTHORIZED)
    }
    const user = await this.userRepository.findOne({ id: decoded.userId })
    if (!user) throw new AppError(ERROR_CODE.UNAUTHORIZED)
    if (!user.isActive) throw new AppError(ERROR_CODE.USER_DISABLED)
    const newSessionId = randomUUID()
    await this.sessionStore.set(user.id, newSessionId)
    const accessToken = await this.tokenService.generateAccessToken({
      userId: user.id,
      role: user.role,
      sid: newSessionId
    })

    const refreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
      sid: newSessionId
    })

    return {
      accessToken,
      refreshToken
    }
  }
}