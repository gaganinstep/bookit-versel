// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Basic middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Debug middleware for Vercel
app.use((req, res, next) => {
  console.log(`[Vercel] ${req.method} ${req.url}`);
  next();
});

// Test endpoint to verify basic functionality
app.get('/test', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Vercel function is working',
    timestamp: new Date().toISOString()
  });
});

// Basic health endpoint directly in Vercel function
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Health check from Vercel function',
    timestamp: new Date().toISOString()
  });
});

// Try to mount the main application, but with error handling
try {
  const mainApp = require('../index');
  console.log('[Vercel] Main app loaded successfully');
  app.use('/', mainApp);
} catch (error) {
  console.error('[Vercel] Failed to load main app:', error.message);
  
  // Fallback routes if main app fails
  app.get('/', (req, res) => {
    res.json({
      status: 'warning',
      message: 'Main app failed to load, but Vercel function is working',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  });
  
  app.get('/health/full', (req, res) => {
    res.json({
      status: 'degraded',
      message: 'Health check from fallback route',
      timestamp: new Date().toISOString(),
      note: 'Main app is not available'
    });
  });
}

// Export for Vercel
module.exports = app;
