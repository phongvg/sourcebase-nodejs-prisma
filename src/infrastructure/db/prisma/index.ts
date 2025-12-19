import { prisma } from '~/infrastructure/db/prisma/prisma.client'

export async function connectPrisma() {
  await prisma.$connect()
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
}
