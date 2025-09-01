#!/usr/bin/env node

require('dotenv').config({ path: process.env.ENV_PATH || '.env' });
const { connectDatabase } = require('../config/dbConnection');
const { supportedDbTypes } = require('../utils/staticData');

async function checkDatabaseConnection() {
  console.log('🔍 Checking database connection...\n');
  
  try {
    const startTime = Date.now();
    const dbType = process.env.DB_TYPE || supportedDbTypes.postgres;
    
    console.log(`📊 Database Type: ${dbType}`);
    console.log(`🏠 Host: ${process.env.POSTGRES_HOST || process.env.MYSQL_HOST || process.env.MSSQL_HOST || 'Not set'}`);
    console.log(`🚪 Port: ${process.env.POSTGRES_PORT || process.env.MYSQL_PORT || process.env.MSSQL_PORT || 'Default'}`);
    console.log(`🗄️  Database: ${process.env.POSTGRES_DB || process.env.MYSQL_DB || process.env.MSSQL_DB || 'Not set'}`);
    console.log(`👤 User: ${process.env.POSTGRES_USER || process.env.MYSQL_USER || process.env.MSSQL_USER || 'Not set'}`);
    console.log('');
    
    // Test connection
    const sequelize = await connectDatabase(dbType);
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT 1 as test, NOW() as current_time');
    
    const responseTime = Date.now() - startTime;
    
    console.log('✅ Database connection successful!');
    console.log(`⏱️  Response time: ${responseTime}ms`);
    console.log(`🔢 Test query result: ${JSON.stringify(results[0])}`);
    console.log('');
    
    // Test a more complex query to check if tables exist
    try {
      const [tableResults] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        LIMIT 5
      `);
      
      console.log('📋 Available tables (first 5):');
      if (tableResults.length > 0) {
        tableResults.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.table_name}`);
        });
      } else {
        console.log('   No tables found in public schema');
      }
    } catch (tableError) {
      console.log('⚠️  Could not fetch table list (this is normal for some database types)');
    }
    
    await sequelize.close();
    console.log('\n🎉 Database check completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error(`Error: ${error.message}`);
    console.error('');
    console.error('🔧 Troubleshooting tips:');
    console.error('1. Check if your database server is running');
    console.error('2. Verify your environment variables are set correctly');
    console.error('3. Ensure your database credentials are correct');
    console.error('4. Check if your database is accessible from your current network');
    console.error('5. For production, verify SSL settings if required');
    console.error('');
    
    process.exit(1);
  }
}

// Run the check
checkDatabaseConnection();
