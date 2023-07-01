import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

export const client = new Client({
  password: process.env.DATABASE_PASSWORD,
  host: 'localhost',
  user: 'postgres',
});


await client.connect();
