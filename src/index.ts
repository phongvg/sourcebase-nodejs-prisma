import { connectPrisma, disconnectPrisma } from '~/infrastructure/db/prisma'
import { disconnectRedis } from '~/infrastructure/cache/redis/redis-client'
import { createApp } from '~/app'
import { env } from '~/infrastructure/config/env'

async function bootstrap() {
  try {
    await connectPrisma()
    console.log('Prisma connected')

    const app = await createApp()
    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`)
      console.log(`Health check: http://localhost:${env.PORT}/health`)
      console.log(`API Documentation: http://localhost:${env.PORT}/api-docs`)
    })

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        await disconnectPrisma()
        await disconnectRedis()
        console.log('Connections closed')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    console.error('Error during bootstrap:', error)
    await disconnectPrisma()
    await disconnectRedis()
    process.exit(1)
  }
}

bootstrap()
