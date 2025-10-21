import { Pool } from 'pg'
import { DB } from '@shared/db/src'
import { Kysely, PostgresDialect } from 'kysely'
import { config } from '@/config'

const dialect = new PostgresDialect({
  pool: new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    max: 20,
  }),
})

export const db = new Kysely<DB>({
  dialect,
})
