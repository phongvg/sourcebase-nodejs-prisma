import _ from 'lodash'
import { randomUUID } from 'crypto'
import { LoginLocalRequestDTO, LoginResponseDTO } from '~/application/dtos/auth/login.dto'
import { PasswordHasher } from '~/application/ports/services/password-hasher.port'
import { TokenService } from '~/application/ports/services/token.port'
import { SessionStore } from '~/application/ports/services/session-store.port'
import { UserRepository } from '~/application/ports/user.repository'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

export class LoginLocalUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly sessionStore: SessionStore
  ) {}

  async execute(payload: LoginLocalRequestDTO): Promise<LoginResponseDTO> {
    const email = _.trim(payload.email).toLowerCase()

    const user = await this.userRepository.findOne({ email, provider: 'LOCAL' })
    if (!user) throw new AppError(ERROR_CODE.INVALID_CREDENTIALS)

    if (!user.isActive) throw new AppError(ERROR_CODE.USER_DISABLED)

    if (!user.password) throw new AppError(ERROR_CODE.INVALID_CREDENTIALS)

    const isPasswordValid = await this.passwordHasher.compare(payload.password, user.password)
    if (!isPasswordValid) throw new AppError(ERROR_CODE.INVALID_CREDENTIALS)

    // Tạo session ID mới 
    const sessionId = randomUUID()

    // Ghi đè session vào Redis 
    await this.sessionStore.set(user.id, sessionId)

    // Cập nhật last login time
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