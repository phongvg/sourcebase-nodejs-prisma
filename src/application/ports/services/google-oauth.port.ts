export type GoogleUserInfo = {
  googleSub: string
  email: string
  fullName?: string
  avatarUrl?: string
}

export interface GoogleOAuth {
  verifyIdToken(idToken: string): Promise<GoogleUserInfo>
}
