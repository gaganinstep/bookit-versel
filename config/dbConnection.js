// config/dbConnection.js
require('dotenv').config({ path: process.env.ENV_PATH || '.env' });
const { Sequelize } = require('sequelize');
const { supportedDbTypes } = require('../utils/staticData');

// Singleton to store database connections
let sequelizeInstance = null;
let modelsInstance = null;

const connectPostgres = async () => {
  const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true, // This will enforce using SSL
          rejectUnauthorized: false, // This might be needed if self-signed certificates
        } : false,
        statement_timeout: 30000,
        query_timeout: 30000,
      },
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
