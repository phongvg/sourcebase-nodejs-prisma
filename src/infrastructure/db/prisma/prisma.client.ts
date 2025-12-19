import { PrismaClient } from '@prisma/client'
import { env } from '~/infrastructure/config/env'

declare global {
  var __prisma: PrismaClient | undefined
}

//Singleton Prisma Client on development
export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
  })

if (env.NODE_ENV !== 'production') global.__prisma = prisma
