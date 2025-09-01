require('dotenv').config({ path: process.env.ENV_PATH || '.env' });

const express = require('express');
const logger = require('./config/logger');
const cors = require('cors');
const { routes, fields } = require('./routes');
const healthRoutes = require('./routes/health');
const { default: helmet } = require('helmet');
const { default: rateLimit } = require('express-rate-limit');
// const { dynamicModuleLoader } = require('./moduleLoader');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const i18n = require('./config/i18nConfig'); 
const { generateSwaggerJSONFromRouter } = require('./config/swagger');

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(helmet());
app.use(i18n.init);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
});

app.use(limiter);

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  throw reason instanceof Error ? reason : new Error(String(reason));
});

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    logger.info(
      `Completed request: ${req.method} ${req.url} - Status: ${res.statusCode}`
    );
  });
  next();
});

app.get('/', (req, res) => {
  logger.info('Hello, Node.js is running');
  res.send('Hello, Node.js is running! - main updated');
});

app.use('/', healthRoutes);

// dynamicModuleLoader(app);

app.use(`/api/${apiVersion}`, routes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(generateSwaggerJSONFromRouter(routes, fields))
);

app.use(errorHandler);

// Listen on all available network interfaces
app.listen(port, '0.0.0.0', () => {
  logger.info(`Server running on port ${port}`);
  console.log(`Server running on port ${port}`);
});

module.exports = app;