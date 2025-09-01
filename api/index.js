// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Import the main app
const mainApp = require('../index');

// Create Express app
const app = express();

// Basic middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

// Debug middleware for Vercel
app.use((req, res, next) => {
  console.log(`[Vercel] ${req.method} ${req.url}`);
  next();
});

// Mount the main application at root to access all routes including health endpoints
app.use('/', mainApp);

// Export for Vercel
module.exports = app;
