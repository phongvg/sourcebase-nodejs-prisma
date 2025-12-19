import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'

import { getRedisClient } from '~/infrastructure/cache/redis/redis-client'
import { prisma } from '~/infrastructure/db/prisma/prisma.client'
import { REDIS_URL } from '~/infrastructure/config/env'
import { Container } from '~/infrastructure/di/container'
import { createAuthRoutes } from '~/presentation/http/routes/auth.routes'
import { errorHandler } from '~/presentation/http/middlewares/error-handler.middleware'
import { swaggerSpec } from '~/infrastructure/config/swagger'

export async function createApp(): Promise<Application> {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const redis = await getRedisClient(REDIS_URL)
  const container = new Container(prisma, redis)

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Routes
  app.use('/api/auth', createAuthRoutes(container.authController, container.tokenService, container.sessionStore))

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Error handler (must be last)
  app.use(errorHandler)

  return app
}