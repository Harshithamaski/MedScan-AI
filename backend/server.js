const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  override: true
});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { getAllowedOrigins } = require('./config/cors');

const authRoutes = require('./routes/auth.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.set('trust proxy', 1);

connectDB();

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  res.json({
    status: 'ok',
    message: 'MedScan AI Backend is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    cors: allowedOrigins.length,
    gemini: {
      configured: key.startsWith('AIza') && key.length > 30,
      model: (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim()
    },
    google: {
      configured: Boolean(process.env.GOOGLE_CLIENT_ID)
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err.message?.includes('not allowed by CORS')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`MedScan AI Backend on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
});
