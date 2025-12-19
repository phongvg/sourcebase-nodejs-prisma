import type { UserRepository } from '~/application/ports/user.repository'
import type { MeResponseDTO } from '~/application/dtos/auth/me.dto'
import { toMeResponseMapper } from '~/application/mappers/auth.mapper'
import { ERROR_CODE } from '~/shared/errors/error-catalog'
import { AppError } from '~/shared/errors/app-errors'

export class GetInfoUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<MeResponseDTO> {
    const user = await this.userRepo.findOne({ id: userId, isActive: true })
    if (!user) throw new AppError(ERROR_CODE.UNAUTHORIZED)

    return toMeResponseMapper(user)
  }
}
