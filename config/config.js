require('dotenv').config({ path: process.env.ENV_PATH === 'development' ? 'env.local' : (process.env.ENV_PATH || '.env.local') });

// Helper function to determine if SSL should be used
const shouldUseSSL = () => {
  // Use SSL for production or when connecting to remote hosts
  const isProduction = process.env.NODE_ENV === 'production';
  const isRemoteHost = process.env.DB_HOST && 
    !process.env.DB_HOST.includes('localhost') && 
    !process.env.DB_HOST.includes('127.0.0.1');
  
  return isProduction || isRemoteHost;
};

// Get SSL configuration based on environment
const getSSLConfig = () => {
  if (shouldUseSSL()) {
    return {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    };
  }
  return {}; // No SSL for local development
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bookit_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: getSSLConfig(),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'bookit_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: getSSLConfig(),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
