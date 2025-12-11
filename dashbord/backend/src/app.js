// src/app.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'

import pool from './config/db.js';
import contactsRoutes from './routes/contacts.routes.js';
import callLogsRoutes from './routes/callLogs.routes.js';
import errorHandler from './middleware/errorHandler.js';
import adminRoutes from "./routes/admin/adminRoutes.js";


const app = express();
app.use(express.json());

app.use(cors());

// simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} — ${req.method} ${req.originalUrl}`);
  next();
});

//admin
app.use("/admin", adminRoutes);

// mount routes
app.use('/contacts', contactsRoutes);
app.use('/call_logs', callLogsRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// global error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);

  // test DB connection (non-blocking)
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT NOW() AS server_time');
    console.log('✅ Database connected successfully!');
    console.log('🕒 MySQL time:', rows[0].server_time);
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed on startup:', err && err.message ? err.message : err);
  }
});

/* Graceful shutdown */
const shutdown = async (signal) => {
  console.log(`Received ${signal} — closing server...`);
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end().then(() => {
      console.log('DB pool closed.');
      process.exit(0);
    }).catch(() => process.exit(0));
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
