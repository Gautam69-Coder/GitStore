import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import repoRoutes from './routes/repoRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  ...CLIENT_URL.split(',').map(u => u.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, origin || true);
    }
    // Allow any deployment origin while echoing header for credentials support
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GitStore API',
    time: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos/:owner/:repo/contents', contentRoutes);
app.use('/api/repos', repoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GitStore API server running on http://localhost:${PORT}`);
  console.log(`📡 Allowing CORS for ${CLIENT_URL}`);
});
