import _ from 'lodash'
import { RegisterRequestDTO, RegisterResponseDTO } from '~/application/dtos/auth/register.dto'
import { PasswordHasher } from '~/application/ports/services/password-hasher.port'
import { UserRepository } from '~/application/ports/user.repository'
import { AppError } from '~/shared/errors/app-errors'
import { ERROR_CODE } from '~/shared/errors/error-catalog'

export class RegisterLocalUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(payload: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const email = _.trim(payload.email).toLowerCase()
    const existed = await this.userRepository.findOne({ email })
    if (existed) throw new AppError(ERROR_CODE.EMAIL_ALREADY_EXISTS)

    const passwordHash = await this.passwordHasher.hash(payload.password)

    const user = await this.userRepository.createLocalUser({
      email,
      password: passwordHash,
      fullName: payload.fullName
    })

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? null
    }
  }
}
