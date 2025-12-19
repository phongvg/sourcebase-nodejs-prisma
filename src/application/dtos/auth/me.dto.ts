export type MeResponseDTO = {
  id: string
  email: string
  fullName: string | null
  role: 'USER' | 'ADMIN'
  provider: 'LOCAL' | 'GOOGLE'
  avatarUrl: string | null
  lastLoginAt: string | null
}
