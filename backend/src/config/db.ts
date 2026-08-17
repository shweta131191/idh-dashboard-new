import mysql, { Pool } from 'mysql2/promise';
import { env } from './env';

let pool: Pool | null = null;

/** Lazily creates the MySQL pool. Only called when DATA_MODE=live. */
export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}
