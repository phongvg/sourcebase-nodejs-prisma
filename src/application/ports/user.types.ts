export type UserFindCriteria = {
  id?: string
  email?: string
  googleSub?: string
  provider?: 'LOCAL' | 'GOOGLE'
  isActive?: boolean
  role?: 'ADMIN' | 'USER'
}

export type CreateLocalUserParams = {
  email: string
  password: string
  fullName?: string
}

export type UpsertGoogleUserParams = {
  googleSub: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
}
