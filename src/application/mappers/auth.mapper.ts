import _ from 'lodash'
import type { UserEntity } from '~/domain/entities/user.entity'
import type { MeResponseDTO } from '~/application/dtos/auth/me.dto'

export function toMeResponseMapper(user: UserEntity): MeResponseDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: _.isNil(user.fullName) ? null : user.fullName,
    role: user.role,
    provider: user.provider,
    avatarUrl: _.isNil(user.avatarUrl) ? null : user.avatarUrl,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null
  }
}
