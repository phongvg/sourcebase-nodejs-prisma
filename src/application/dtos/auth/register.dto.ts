import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string().trim().min(3).max(100).optional()
})

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>

export type RegisterResponseDTO = {
  id: string
  email: string
  fullName: string | null
}
