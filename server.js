const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectToDatabase = require('./config/config');
const errorHandler = require('./middleware/ErrorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
};

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' }));
app.use(generalLimiter);
app.use('/api/login', sensitiveLimiter);
app.use('/api/register', sensitiveLimiter);
app.use('/api/forgot-password', sensitiveLimiter);
app.use('/api/contact-form', sensitiveLimiter);
app.use('/api/upload', sensitiveLimiter);

// Connect to MongoDB
async function startServer() {
  try {
    await connectToDatabase();
    //Routes
    app.use('/api/', require('./routes/PageHitsRoute'));
    app.use('/api/', require('./routes/UserRoutes'));
    app.use('/api/', require('./routes/EmailConfirmationLinkRoutes'));
    app.use('/api/', require('./routes/ContactFormInformationRoutes'));
    app.use('/api/', require('./routes/GalleryImagesRoutes'));

    app.use(errorHandler);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
