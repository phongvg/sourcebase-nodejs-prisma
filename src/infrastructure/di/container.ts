import { RedisClientType } from 'redis'
import { PrismaClient } from '@prisma/client'

// Infrastructure
import { UserRepositoryImpl } from '~/infrastructure/repositories/user/user.repository.impl'
import { PasswordHasherImpl } from '~/infrastructure/services/auth/password-hasher.impl'
import { TokenServiceImpl } from '~/infrastructure/services/auth/token.impl'
import { GoogleOAuthImpl } from '~/infrastructure/services/auth/google-oauth.impl'
import { RedisSessionStoreImpl } from '~/infrastructure/cache/redis/redis-session-store.impl'
import { env } from '~/infrastructure/config/env'

// Application
import { RegisterLocalUseCase } from '~/application/use-cases/auth/register-local.usecase'
import { LoginLocalUseCase } from '~/application/use-cases/auth/login-local.usecase'
import { LoginGoogleUseCase } from '~/application/use-cases/auth/login-google.usecase'
import { RefreshTokenUseCase } from '~/application/use-cases/auth/refresh-token.usecase'
import { LogoutUseCase } from '~/application/use-cases/auth/logout.usecase'
import { GetInfoUseCase } from '~/application/use-cases/auth/get-me.usecase'

// Presentation
import { AuthController } from '~/presentation/http/controllers/auth.controller'

export class Container {
  // Infrastructure
  public readonly userRepository: UserRepositoryImpl
  public readonly passwordHasher: PasswordHasherImpl
  public readonly tokenService: TokenServiceImpl
  public readonly googleOAuth: GoogleOAuthImpl
  public readonly sessionStore: RedisSessionStoreImpl

  // Use Cases
  public readonly registerLocalUseCase: RegisterLocalUseCase
  public readonly loginLocalUseCase: LoginLocalUseCase
  public readonly loginGoogleUseCase: LoginGoogleUseCase
  public readonly refreshTokenUseCase: RefreshTokenUseCase
  public readonly logoutUseCase: LogoutUseCase
  public readonly getInfoUseCase: GetInfoUseCase

  // Controllers
  public readonly authController: AuthController

  constructor(prisma: PrismaClient, redis: RedisClientType) {
    // Infrastructure layer
    this.userRepository = new UserRepositoryImpl(prisma)
    this.passwordHasher = new PasswordHasherImpl(env.BCRYPT_SALT_ROUNDS)
    this.tokenService = new TokenServiceImpl(env.JWT_SECRET, env.ACCESS_TOKEN_TTL, env.REFRESH_TOKEN_TTL)
    this.googleOAuth = new GoogleOAuthImpl(env.GOOGLE_CLIENT_ID)
    this.sessionStore = new RedisSessionStoreImpl(redis, env.REFRESH_TOKEN_TTL)

    // Application layer
    this.registerLocalUseCase = new RegisterLocalUseCase(this.userRepository, this.passwordHasher)
    this.loginLocalUseCase = new LoginLocalUseCase(
      this.userRepository,
      this.passwordHasher,
      this.tokenService,
      this.sessionStore
    )
    this.loginGoogleUseCase = new LoginGoogleUseCase(
      this.userRepository,
      this.googleOAuth,
      this.tokenService,
      this.sessionStore
    )
    this.refreshTokenUseCase = new RefreshTokenUseCase(
      this.userRepository,
      this.tokenService,
      this.sessionStore
    )
    this.logoutUseCase = new LogoutUseCase(this.sessionStore)
    this.getInfoUseCase = new GetInfoUseCase(this.userRepository)

    // Presentation layer
    this.authController = new AuthController(
      this.registerLocalUseCase,
      this.loginLocalUseCase,
      this.loginGoogleUseCase,
      this.refreshTokenUseCase,
      this.logoutUseCase,
      this.getInfoUseCase
    )
  }
}
