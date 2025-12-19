import _ from 'lodash'
import type { PrismaClient, User as PrismaUser } from '@prisma/client'

import type { CreateLocalUserParams, UpsertGoogleUserParams, UserFindCriteria } from '~/application/ports/user.types'
import { UserEntity } from '~/domain/entities/user.entity'
import { UserRepository } from '~/application/ports/user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findOne(criteria: UserFindCriteria): Promise<UserEntity | null> {
    const where = this.buildWhere(criteria)
    if (_.isEmpty(where)) return null

    const user = await this.prisma.user.findFirst({ where })
    return user ? this.toEntity(user) : null
  }

  async createLocalUser(params: CreateLocalUserParams): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        email: _.trim(params.email).toLowerCase(),
        password: params.password, // hash
        fullName: params.fullName ? _.trim(params.fullName) : null,
        provider: 'LOCAL',
        role: 'USER',
        isActive: true
      }
    })

    return this.toEntity(user)
  }

  async upsertGoogleUser(params: UpsertGoogleUserParams): Promise<UserEntity> {
    const email = _.trim(params.email).toLowerCase()

    const user = await this.prisma.user.upsert({
      where: { googleSub: params.googleSub },
      create: {
        googleSub: params.googleSub,
        email,
        fullName: params.fullName ? _.trim(params.fullName) : null,
        avatarUrl: params.avatarUrl ?? null,
        provider: 'GOOGLE',
        role: 'USER',
        isActive: true
      },
      update: {
        email,
        fullName: params.fullName ? _.trim(params.fullName) : undefined,
        avatarUrl: params.avatarUrl ?? undefined
      }
    })

    return this.toEntity(user)
  }

  async updateLastLogin(userId: string, at: Date = new Date()): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: at }
    })
  }

  private buildWhere(criteria: UserFindCriteria) {
    return _.pickBy(
      {
        id: criteria.id,
        email: criteria.email ? _.trim(criteria.email).toLowerCase() : undefined,
        googleSub: criteria.googleSub,
        role: criteria.role,
        isActive: criteria.isActive
      },
      (v) => !_.isNil(v)
    )
  }

  private toEntity(user: PrismaUser): UserEntity {
    return new UserEntity(
      user.id,
      user.email,
      user.provider,
      user.role,
      user.isActive,
      user.password ?? undefined,
      user.googleSub ?? undefined,
      user.fullName ?? undefined,
      user.avatarUrl ?? undefined,
      user.lastLoginAt ?? undefined,
      user.createdAt,
      user.updatedAt
    )
  }
}
