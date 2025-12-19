import { z } from 'zod'

export const LoginLocalRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export type LoginLocalRequestDTO = z.infer<typeof LoginLocalRequestSchema>

export const LoginGoogleRequestSchema = z.object({
  idToken: z.string().min(1)
})

export type LoginGoogleRequestDTO = z.infer<typeof LoginGoogleRequestSchema>

export type LoginResponseDTO = {
  accessToken: string
  refreshToken: string
}
