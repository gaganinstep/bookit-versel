require('dotenv').config({ path: process.env.ENV_PATH === 'development' ? 'env.local' : (process.env.ENV_PATH || '.env.local') });

const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION ? process.env.API_VERSION : 'v1';

const path = require('path');

// CORS configuration - must be before other middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

// Try to load optional modules with error handling
let logger, helmet, rateLimit, routes, fields, healthRoutes, errorHandler, swaggerUi, i18n, generateSwaggerJSONFromRouter;

try {
  logger = require('./config/logger');
  console.log('[Main App] Logger loaded successfully');
} catch {
  console.log('[Main App] Logger not available, using console.log');
  logger = { info: console.log, error: console.error };
}

try {
  helmet = require('helmet').default;
  app.use(helmet());
  console.log('[Main App] Helmet loaded successfully');
} catch {
  console.log('[Main App] Helmet not available, skipping security headers');
}

try {
  rateLimit = require('express-rate-limit').default;
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
  });
  app.use(limiter);
  console.log('[Main App] Rate limiting loaded successfully');
} catch {
  console.log('[Main App] Rate limiting not available, skipping');
}

try {
  i18n = require('./config/i18nConfig');
  app.use(i18n.init);
  console.log('[Main App] i18n loaded successfully');
} catch {
  console.log('[Main App] i18n not available, skipping internationalization');
}

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  if (logger) {
    logger.error("Uncaught Exception:", err);
  } else {
    console.error("Uncaught Exception:", err);
  }
  // Don't exit in Vercel environment
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    process.exit(1);
  }
});

process.on("unhandledRejection", (reason, promise) => {
  if (logger) {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  } else {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
  // Don't throw in Vercel environment
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    throw reason instanceof Error ? reason : new Error(String(reason));
  }
});

// Request logging middleware
app.use((req, res, next) => {
  if (logger) {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
  }
  console.log(`[Main App] ${req.method} ${req.url}`);
  res.on('finish', () => {
    if (logger) {
      logger.info(`Completed request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });
  next();
});

// Root route
app.get('/', (req, res) => {
  if (logger) {
    logger.info('Hello, Node.js is running');
  }
  res.send('Hello, Node.js is running! - main updated');
});

// Try to load health routes
try {
  healthRoutes = require('./routes/health');
  app.use('/health', healthRoutes);
  console.log('[Main App] Health routes loaded successfully');
} catch {
  console.log('[Main App] Health routes not available, creating fallback');
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok',
      message: 'Health check from main app fallback',
      timestamp: new Date().toISOString()
    });
  });
}

// Try to load main routes
try {
  const routesModule = require('./routes');
  routes = routesModule.routes;
  fields = routesModule.fields;
  
  console.log('[Main App] Routes module loaded:', !!routes);
  console.log('[Main App] Fields loaded:', fields ? fields.length : 0);
  
  if (routes) {
    app.use(`/api/${apiVersion}`, routes);
    console.log(`[Main App] Main routes mounted at /api/${apiVersion} successfully`);
    
    // Add a test route to verify mounting
    app.get(`/api/${apiVersion}/test`, (req, res) => {
      res.json({
        status: 'ok',
        message: 'Main app routes are working',
        timestamp: new Date().toISOString(),
        apiVersion: apiVersion
      });
    });
  } else {
    throw new Error('Routes object is undefined');
  }
} catch (error) {
  console.log('[Main App] Main routes not available, creating fallback');
  console.error('[Main App] Routes error:', error.message);
  
  app.get(`/api/${apiVersion}`, (req, res) => {
    res.json({
      status: 'warning',
      message: 'Main routes not available',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Add fallback for categories
  app.get(`/api/${apiVersion}/categories`, (req, res) => {
    res.json({
      status: 'warning',
      message: 'Categories endpoint from main app fallback',
      timestamp: new Date().toISOString(),
      note: 'Main routes failed to load'
    });
  });
}

// Try to load Swagger documentation
try {
  swaggerUi = require('swagger-ui-express');
  generateSwaggerJSONFromRouter = require('./config/swagger').generateSwaggerJSONFromRouter;
  
  if (routes && fields) {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(generateSwaggerJSONFromRouter(routes, fields))
    );
    console.log('[Main App] Swagger docs loaded successfully');
  }
} catch {
  console.log('[Main App] Swagger docs not available, skipping');
}

// Try to load error handler
try {
  errorHandler = require('./middlewares/errorHandler');
  app.use(errorHandler);
  console.log('[Main App] Error handler loaded successfully');
} catch {
  console.log('[Main App] Error handler not available, using basic error handling');
  app.use((err, req, res) => {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  });
}

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, '0.0.0.0', () => {
    if (logger) {
      logger.info(`Server running on port ${port}`);
    }
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;