// src/middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error('Express error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}
