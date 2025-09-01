const express = require('express');
const router = express.Router();
const { connectDatabase } = require('../config/dbConnection');
const { supportedDbTypes } = require('../utils/staticData');

// Debug middleware for health routes
router.use((req, res, next) => {
  console.log(`[Health Routes] ${req.method} ${req.url}`);
  next();
});

// Basic health check endpoint
router.get('/', (req, res) => {
  console.log('[Health] Basic health check accessed');
  try {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Database health check endpoint
router.get('/db', async (req, res) => {
  console.log('[Health] Database health check accessed');
  try {
    const startTime = Date.now();
    const dbType = process.env.DB_TYPE || supportedDbTypes.postgres;
    
    // Test database connection
    const sequelize = await connectDatabase(dbType);
    
    // Test a simple query to ensure database is responsive
    const [results] = await sequelize.query('SELECT 1 as test');
    
    const responseTime = Date.now() - startTime;
    
    res.status(200).json({
      status: 'ok',
      database: {
        type: dbType,
        connected: true,
        responseTime: `${responseTime}ms`,
        host: process.env.POSTGRES_HOST || process.env.MYSQL_HOST || process.env.MSSQL_HOST,
        port: process.env.POSTGRES_PORT || process.env.MYSQL_PORT || process.env.MSSQL_PORT,
        database: process.env.POSTGRES_DB || process.env.MYSQL_DB || process.env.MSSQL_DB,
        testQuery: results[0]
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.log('[Health] Database health check failed:', error.message);
    res.status(503).json({
      status: 'error',
      database: {
        connected: false,
        error: error.message,
        type: process.env.DB_TYPE || 'unknown'
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
});

// Comprehensive health check endpoint
router.get('/full', async (req, res) => {
  console.log('[Health] Full health check accessed');
  try {
    const startTime = Date.now();
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: { status: 'unknown', details: {} },
        memory: { status: 'ok', details: {} },
        disk: { status: 'ok', details: {} }
      }
    };

    // Database check
    try {
      const dbStartTime = Date.now();
      const dbType = process.env.DB_TYPE || supportedDbTypes.postgres;
      const sequelize = await connectDatabase(dbType);
      const [results] = await sequelize.query('SELECT 1 as test');
      const dbResponseTime = Date.now() - dbStartTime;
      
      healthStatus.checks.database = {
        status: 'ok',
        details: {
          type: dbType,
          connected: true,
          responseTime: `${dbResponseTime}ms`,
          host: process.env.POSTGRES_HOST || process.env.MYSQL_HOST || process.env.MSSQL_HOST,
          port: process.env.POSTGRES_PORT || process.env.MYSQL_PORT || process.env.MSSQL_PORT,
          database: process.env.POSTGRES_DB || process.env.MYSQL_DB || process.env.MSSQL_DB,
          testQuery: results[0]
        }
      };
    } catch (dbError) {
      healthStatus.checks.database = {
        status: 'error',
        details: {
          error: dbError.message,
          type: process.env.DB_TYPE || 'unknown'
        }
      };
      healthStatus.status = 'degraded';
    }

    // Memory check
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };
    
    healthStatus.checks.memory = {
      status: 'ok',
      details: memUsageMB
    };

    // Check if memory usage is high (warning threshold: 80% of heap)
    const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    if (heapUsagePercent > 80) {
      healthStatus.checks.memory.status = 'warning';
      healthStatus.checks.memory.details.heapUsagePercent = Math.round(heapUsagePercent);
    }

    const totalResponseTime = Date.now() - startTime;
    healthStatus.responseTime = `${totalResponseTime}ms`;

    // Determine overall status
    const hasErrors = Object.values(healthStatus.checks).some(check => check.status === 'error');
    const hasWarnings = Object.values(healthStatus.checks).some(check => check.status === 'warning');
    
    if (hasErrors) {
      healthStatus.status = 'error';
      res.status(503);
    } else if (hasWarnings) {
      healthStatus.status = 'warning';
      res.status(200);
    } else {
      res.status(200);
    }

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;