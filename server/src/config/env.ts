import 'dotenv/config'

export const env = {
  DB_CLIENT: process.env.DB_CLIENT || 'pg',
  DB_HOST: process.env.DB_HOST || '192.168.2.6',
  DB_PORT: process.env.DB_PORT || '5435',
  DB_USER: process.env.DB_USER || 'solutions',
  DB_PASS: process.env.DB_PASS || 'sol_fin_2019',
  DB_NAME: process.env.DB_NAME || 'patrimonio',
}