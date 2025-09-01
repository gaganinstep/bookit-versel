const express = require('express');
const router = express.Router();

// Debug middleware for health routes
router.use((req, res, next) => {
  console.log(`[Health Routes] ${req.method} ${req.url}`);
  next();
});

// Basic health check endpoint - completely isolated
router.get('/', (req, res) => {
  console.log('[Health] Basic health check accessed');
  try {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      message: 'Basic health check successful'
    });
  } catch (error) {
    console.error('[Health] Basic health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// Database health check endpoint - isolated with minimal dependencies
router.get('/db', async (req, res) => {
  console.log('[Health] Database health check accessed');
  try {
    // Check environment variables only
    const dbType = process.env.DB_TYPE || 'unknown';
    const hasHost = process.env.POSTGRES_HOST || process.env.MYSQL_HOST || process.env.MSSQL_HOST;
    
    const dbStatus = {
      configured: !!dbType && !!hasHost,
      type: dbType,
      host: hasHost ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'ok',
      database: dbStatus,
      message: 'Database configuration check completed'
    });
  } catch (error) {
    console.error('[Health] Database health check error:', error);
    res.status(200).json({
      status: 'error',
      database: {
        configured: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Full health check endpoint - completely isolated
router.get('/full', async (req, res) => {
  console.log('[Health] Full health check accessed');
  try {
    const startTime = Date.now();
    
    // Basic system info
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {}
    };

    // Memory check - isolated
    try {
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

      const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      if (heapUsagePercent > 80) {
        healthStatus.checks.memory.status = 'warning';
        healthStatus.checks.memory.details.heapUsagePercent = Math.round(heapUsagePercent);
      }
    } catch (memError) {
      healthStatus.checks.memory = {
        status: 'error',
        details: { error: 'Memory check failed' }
      };
    }

    // Environment check
    try {
      healthStatus.checks.environment = {
        status: 'ok',
        details: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          dbType: process.env.DB_TYPE || 'not set'
        }
      };
    } catch (envError) {
      healthStatus.checks.environment = {
        status: 'error',
        details: { error: 'Environment check failed' }
      };
    }

    // Process check
    try {
      healthStatus.checks.process = {
        status: 'ok',
        details: {
          pid: process.pid,
          memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          uptime: Math.round(process.uptime()) + 's'
        }
      };
    } catch (procError) {
      healthStatus.checks.process = {
        status: 'error',
        details: { error: 'Process check failed' }
      };
    }

    const totalResponseTime = Date.now() - startTime;
    healthStatus.responseTime = `${totalResponseTime}ms`;

    // Determine overall status
    const hasErrors = Object.values(healthStatus.checks).some(check => check.status === 'error');
    const hasWarnings = Object.values(healthStatus.checks).some(check => check.status === 'warning');
    
    if (hasErrors) {
      healthStatus.status = 'degraded';
    } else if (hasWarnings) {
      healthStatus.status = 'warning';
    }

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('[Health] Full health check error:', error);
    // Even if everything fails, return a basic response
    res.status(200).json({
      status: 'error',
      message: 'Health check encountered an error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;