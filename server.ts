import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool, initDb } from './src/server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Neon PostgreSQL database schema
initDb().catch((err) => {
  console.error('Failed to initialize Neon DB:', err);
});

// API Routes
// 1. Health / Connection check
app.get('/api/health-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now, version() as version;');
    res.json({
      status: 'connected',
      database: 'Neon PostgreSQL',
      serverTime: result.rows[0].now,
      version: result.rows[0].version,
    });
  } catch (error: any) {
    console.error('Database health check failed:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 2. Create Order (Comprar producto / Comprar carrito)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      paymentMethod,
      items,
      subtotal,
      discount = 0,
      shipping = 0,
      total,
      status = 'Completado',
    } = req.body;

    if (!customerName || !customerEmail || !items || items.length === 0) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para guardar la orden.' });
    }

    const orderNum = orderNumber || `ELN-${Math.floor(100000 + Math.random() * 900000)}`;

    const insertQuery = `
      INSERT INTO orders (
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        city,
        payment_method,
        items,
        subtotal,
        discount,
        shipping,
        total,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;

    const values = [
      orderNum,
      customerName,
      customerEmail,
      customerPhone || '',
      shippingAddress || 'Dirección de prueba',
      city || '',
      paymentMethod || 'Tarjeta',
      JSON.stringify(items),
      subtotal,
      discount,
      shipping,
      total,
      status,
    ];

    const result = await pool.query(insertQuery, values);
    const savedOrder = result.rows[0];

    console.log(`[Neon DB] Compra guardada con éxito: Orden #${savedOrder.order_number}`);

    res.status(201).json({
      success: true,
      message: 'Compra guardada exitosamente en la base de datos Neon PostgreSQL',
      order: savedOrder,
    });
  } catch (error: any) {
    console.error('Error saving order to Neon PostgreSQL:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar la compra en la base de datos',
      details: error.message,
    });
  }
});

// 3. Get all saved orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 50;
    `);
    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching orders from Neon PostgreSQL:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar las compras en la base de datos',
      details: error.message,
    });
  }
});

// 4. Delete an order (for testing / cleanup)
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM orders WHERE id = $1;', [id]);
    res.json({ success: true, message: 'Orden eliminada de la base de datos' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
    console.log(`🔌 Conectado a Neon PostgreSQL`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
