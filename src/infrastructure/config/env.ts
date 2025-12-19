import dotenv from 'dotenv'
import _ from 'lodash'

dotenv.config()

// Validate env
function requireEnv(key: string): string {
  const value = _.trim(process.env[key])
  if (_.isEmpty(value)) {
    throw new Error(`Missing enviroment variable: ${key}`)
  }
  return value
}

//Get env
export const env = {
  NODE_ENV: requireEnv('NODE_ENV'),
  PORT: _.toNumber(requireEnv('PORT')),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_HOST: requireEnv('REDIS_HOST'),
  REDIS_PORT: _.toNumber(requireEnv('REDIS_PORT')),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  ACCESS_TOKEN_TTL: _.toNumber(requireEnv('ACCESS_TOKEN_TTL')),
  REFRESH_TOKEN_TTL: _.toNumber(requireEnv('REFRESH_TOKEN_TTL')),
  BCRYPT_SALT_ROUNDS: _.toNumber(requireEnv('BCRYPT_SALT_ROUNDS')),
  GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID')
}

// Build Redis URL
export const REDIS_URL = `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
