import { User } from '@prisma/client'
import { LoginLocalRequestDTO } from '~/application/dtos/auth/login.dto'
import { CreateLocalUserParams, UpsertGoogleUserParams, UserFindCriteria } from '~/application/ports/user.types'
import { UserEntity } from '~/domain/entities/user.entity'

export interface UserRepository {
  findOne(criteria: UserFindCriteria): Promise<UserEntity | null>

  createLocalUser(params: CreateLocalUserParams): Promise<UserEntity>

  upsertGoogleUser(params: UpsertGoogleUserParams): Promise<UserEntity>

  updateLastLogin(userId: string, at?: Date): Promise<void>
}
