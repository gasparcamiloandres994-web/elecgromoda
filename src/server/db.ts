import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IYp1Ei8fJnVk@ep-billowing-sun-b4gu92cc-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Initialize connection pool to Neon PostgreSQL
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon PostgreSQL client:', err);
});

// Helper to auto-create orders table on startup
export async function initDb() {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number VARCHAR(64) NOT NULL UNIQUE,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(64),
          shipping_address TEXT NOT NULL,
          city VARCHAR(128),
          payment_method VARCHAR(64) NOT NULL,
          items JSONB NOT NULL,
          subtotal NUMERIC(10, 2) NOT NULL,
          discount NUMERIC(10, 2) DEFAULT 0,
          shipping NUMERIC(10, 2) DEFAULT 0,
          total NUMERIC(10, 2) NOT NULL,
          status VARCHAR(64) DEFAULT 'Completado',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Neon PostgreSQL: Table "orders" verified/created successfully.');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error initializing Neon PostgreSQL database:', error);
  }
}
