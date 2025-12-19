import { z } from 'zod'

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1)
})

export type RefreshTokenRequestDTO = z.infer<typeof RefreshTokenRequestSchema>

export type RefreshTokenResponseDTO = {
  accessToken: string
  refreshToken: string
}
