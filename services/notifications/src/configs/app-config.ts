import { config } from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })
const environment = process.env

export const APP_NAME = environment.APP_NAME || 'hermes'
export const NODE_ENV = environment.NODE_ENV || 'development'
export const SERVER_PORT = Number(environment.SERVER_PORT) || 4000
export const CLIENT_HOST = environment.CLIENT_HOST || 'http://localhost:3000'

export const LOG_LEVEL = environment.LOG_LEVEL || 'INFO'

export const PROMISE_CONCURRENCY = Number(environment.PROMISE_CONCURRENCY) || 10
