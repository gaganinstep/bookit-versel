// config/dbConnection.js
require('dotenv').config({ path: process.env.ENV_PATH === 'development' ? 'env.local' : (process.env.ENV_PATH || '.env.local') });
const { Sequelize } = require('sequelize');
const { supportedDbTypes } = require('../utils/staticData');

// Singleton to store database connections
let sequelizeInstance = null;
let modelsInstance = null;

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
        require: true, // Always require SSL for Neon
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      statement_timeout: 30000,
      query_timeout: 30000,
    };
  }
  return {
    statement_timeout: 30000,
    query_timeout: 30000,
  };
};

const connectPostgres = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME || process.env.POSTGRES_DB,
    process.env.DB_USERNAME || process.env.POSTGRES_USER,
    process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
    {
      host: process.env.DB_HOST || process.env.POSTGRES_HOST,
      port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: getSSLConfig(),
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL successfully');
    return sequelize;
  } catch (err) {
    console.error('Unable to connect to PostgreSQL:', err.message);
    throw err;
  }
};

const connectMysql = async () => {
  const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      dialect: process.env.MYSQL_DIALECT,
    }
  );

  await sequelize
    .authenticate()
    .then(() => console.log('Connected to MySQL'))
    .catch((err) => console.error('Unable to connect to MySQL:', err));
  return sequelize;
};

const connectMssql = async () => {
  const sequelize = new Sequelize(
    process.env.MSSQL_DB,
    process.env.MSSQL_USER,
    process.env.MSSQL_PASSWORD,
    {
      host: process.env.MSSQL_HOST, // Ensure this is a valid hostname
      port: process.env.MSSQL_PORT,
      dialect: process.env.MSSQL_DIALECT, // or 'postgres', 'sqlite', etc.
      dialectOptions: {
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      },
      logging: true,
    }
  );

  await sequelize
    .authenticate()
    .then(() => console.log('Connected to MsSQL'))
    .catch((err) => console.error('Unable to connect to MsSQL:', err));
  return sequelize;
};

const connectDatabase = async (dbType) => {
  // Return existing connection if available
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  switch (dbType) {
  case supportedDbTypes.postgres:
    sequelizeInstance = await connectPostgres();
    break;
  case supportedDbTypes.mysql:
    sequelizeInstance = await connectMysql();
    break;
  case supportedDbTypes.mssql:
    sequelizeInstance = await connectMssql();
    break;
  default:
    throw new Error('Unsupported database type');
  }

  return sequelizeInstance;
};

// Function to get cached models
const getCachedModels = async (dbType) => {
  if (modelsInstance) {
    return modelsInstance;
  }

  const { getAllModels } = require('../middlewares/loadModels');
  modelsInstance = await getAllModels(dbType);
  return modelsInstance;
};

module.exports = { connectDatabase, getCachedModels };
