require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/db');
const { autoTrack } = require('./middleware/analyticsMiddleware');

// Routes
const authRoutes      = require('./routes/authRoutes');
const directiveRoutes = require('./routes/directiveRoutes');
const documentRoutes  = require('./routes/documentRoutes');
const feedbackRoutes  = require('./routes/feedbackRoutes');
const adminRoutes     = require('./routes/adminRoutes');

connectDB();

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200,
  message: { message: 'Too many requests' } });
const authLimiter   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,
  message: { message: 'Too many auth attempts' } });

app.use(globalLimiter);
app.use('/api/auth', authLimiter);

// ── Parsing & Logging ────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Analytics auto-tracking ───────────────────────────────────────────────────
app.use(autoTrack);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/directive', directiveRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/admin',     adminRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', version: '2.0.0', env: process.env.NODE_ENV }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  WillTrail v2 API running on http://localhost:${PORT}`));
