import _ from 'lodash'
import bcrypt from 'bcrypt'
import { PasswordHasher } from '~/application/ports/services/password-hasher.port'

export class PasswordHasherImpl implements PasswordHasher {
  constructor(private readonly saltRounds: number) {}

  async hash(plainPassword: string): Promise<string> {
    const trimPassword = _.trim(plainPassword)
    return bcrypt.hash(trimPassword, this.saltRounds)
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
