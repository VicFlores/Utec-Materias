import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const pool = new Pool({
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DB,
  port: 5432,
});
