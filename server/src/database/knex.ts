import knex from 'knex'
import { env } from '../config/env'

// Exemplo para PostgreSQL
export const db = knex({
  client: 'pg',
  connection: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
  },
  useNullAsDefault: true,
})