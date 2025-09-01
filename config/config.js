const { supportedDbTypes } = require('../utils/staticData');

require('dotenv').config({ path: process.env.ENV_PATH || '.env' });

const getDConfig = () => {
  const obj = {
    username: '',
    password: '',
    database: '',
    host: '',
    port: 0,
    dialect: '',
  };
  switch (process.env.DB_TYPE) {
  case supportedDbTypes.postgres:
    obj.username = process.env.POSTGRES_USER;
    obj.password = process.env.POSTGRES_PASSWORD;
    obj.database = process.env.POSTGRES_DB;
    obj.host = process.env.POSTGRES_HOST;
    obj.port = process.env.POSTGRES_PORT;
    obj.dialect = process.env.POSTGRES_DIALECT;
    obj.dialectOptions = {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
      statement_timeout: 30000,
      query_timeout: 30000,
    };
    obj.pool = {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    };
    obj.logging = process.env.NODE_ENV === 'development' ? console.log : false;

    return obj;
  case supportedDbTypes.mysql:
    obj.username = process.env.MYSQL_USER;
    obj.password = process.env.MYSQL_PASSWORD;
    obj.database = process.env.MYSQL_DB;
    obj.host = process.env.MYSQL_HOST;
    obj.port = process.env.MYSQL_PORT;
    obj.dialect = process.env.MYSQL_DIALECT;
    return obj;
    case supportedDbTypes.mssql:
      obj.username = process.env.MSSQL_USER;
    obj.password = process.env.MSSQL_PASSWORD;
    obj.database = process.env.MSSQL_DB;
    obj.host = process.env.MSSQL_HOST;
    obj.port = process.env.MSSQL_PORT;
    obj.dialect = process.env.MSSQL_DIALECT;
    obj.dialectOptions = {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };
    return obj;
  default:
    throw new Error('Unsupported database type');
  }
};

module.exports = {
  development: getDConfig(),
  production: getDConfig(),
  test: getDConfig(),
};
