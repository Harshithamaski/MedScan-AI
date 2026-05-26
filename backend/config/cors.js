/**
 * Build allowed CORS origins from env + local dev defaults.
 * Set FRONTEND_URL and/or ALLOWED_ORIGINS (comma-separated) on Render.
 */
const getAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ]);

  if (process.env.FRONTEND_URL) {
    origins.add(process.env.FRONTEND_URL.trim().replace(/\/$/, ''));
  }

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',')
      .map((o) => o.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach((o) => origins.add(o));
  }

  return [...origins];
};

module.exports = { getAllowedOrigins };
