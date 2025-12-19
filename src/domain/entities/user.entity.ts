export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly provider: 'LOCAL' | 'GOOGLE',
    public readonly role: 'ADMIN' | 'USER',
    public readonly isActive: boolean,
    public readonly password?: string,
    public readonly googleSub?: string,
    public readonly fullName?: string,
    public readonly avatarUrl?: string,
    public readonly lastLoginAt?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
