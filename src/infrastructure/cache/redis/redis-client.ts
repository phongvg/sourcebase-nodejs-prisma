import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null

export async function getRedisClient(url: string): Promise<RedisClientType> {
  if (redisClient && redisClient.isOpen) {
    return redisClient
  }

  redisClient = createClient({ url })

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err)
  })

  redisClient.on('connect', () => {
    console.log('Redis Client Connected')
  })

  await redisClient.connect()

  return redisClient
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit()
    redisClient = null
  }
}
