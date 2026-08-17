import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  dataMode: (process.env.DATA_MODE ?? 'mock') as 'mock' | 'live',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'idh_prod_sync_driver',
  },
};
