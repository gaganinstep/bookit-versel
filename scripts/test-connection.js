#!/usr/bin/env node

require('dotenv').config({ path: process.env.ENV_PATH || 'env.local' });

console.log('🔍 Database Connection Debug');
console.log('============================');
console.log('');

console.log('Environment Variables:');
console.log('ENV_PATH:', process.env.ENV_PATH);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_TYPE:', process.env.DB_TYPE);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('');

console.log('PostgreSQL Environment Variables:');
console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
console.log('POSTGRES_PASSWORD:', process.env.POSTGRES_PASSWORD);
console.log('POSTGRES_DB:', process.env.POSTGRES_DB);
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT);
console.log('');

// Test direct Sequelize connection
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bookit_dev',
  process.env.DB_USERNAME || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {}
  }
);

console.log('🔌 Testing direct connection...');
console.log('Connection config:', {
  database: sequelize.config.database,
  username: sequelize.config.username,
  host: sequelize.config.host,
  port: sequelize.config.port
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Direct connection successful!');
    return sequelize.close();
  })
  .catch(err => {
    console.error('❌ Direct connection failed:', err.message);
  });
