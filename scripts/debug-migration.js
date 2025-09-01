#!/usr/bin/env node

const path = require('path');

console.log('🔍 Migration Debug');
console.log('==================');
console.log('');

console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('Parent directory:', path.dirname(__dirname));
console.log('');

// Try different ways to load environment variables
console.log('🔧 Trying to load environment variables...');

// Method 1: Try env.local in current directory
try {
  require('dotenv').config({ path: 'env.local' });
  console.log('✅ Method 1: Loaded env.local from current directory');
} catch {
  console.log('❌ Method 1: Failed to load env.local from current directory');
}

// Method 2: Try env.local in parent directory
try {
  require('dotenv').config({ path: path.join(__dirname, '../env.local') });
  console.log('✅ Method 2: Loaded env.local from parent directory');
} catch {
  console.log('❌ Method 2: Failed to load env.local from parent directory');
}

// Method 3: Try .env.local in parent directory
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
  console.log('✅ Method 3: Loaded .env.local from parent directory');
} catch {
  console.log('❌ Method 3: Failed to load .env.local from parent directory');
}

console.log('');

console.log('Environment Variables after loading:');
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

if (process.env.DB_NAME) {
  console.log('🔌 Testing dbConnection.js...');

  const { connectDatabase } = require('../config/dbConnection');

  (async () => {
    try {
      console.log('Calling connectDatabase...');
      const sequelize = await connectDatabase(process.env.DB_TYPE || 'postgres');
      console.log('✅ connectDatabase successful!');
      console.log('Connection config:', {
        database: sequelize.config.database,
        username: sequelize.config.username,
        host: sequelize.config.host,
        port: sequelize.config.port
      });
      await sequelize.close();
    } catch (error) {
      console.error('❌ connectDatabase failed:', error.message);
      console.error('Full error:', error);
    }
  })();
} else {
  console.log('❌ No database configuration found, skipping connection test');
}
