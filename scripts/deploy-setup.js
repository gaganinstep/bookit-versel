#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting deployment setup...');

// Function to run commands safely
const runCommand = (command, description) => {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
};

// Main deployment setup
const main = async () => {
  try {
    // Check if we're in production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('🌐 Production environment detected (Vercel)');
      
      // Wait a bit for the database to be ready
      console.log('⏳ Waiting for database to be ready...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Run database migrations
      runCommand('npm run db:migrate', 'Running database migrations');
      
      // Run database seeds
      runCommand('npm run db:seeds', 'Running database seeds');
      
      console.log('🎉 Deployment setup completed successfully!');
    } else {
      console.log('🖥️  Development environment detected');
      console.log('Skipping production setup steps...');
    }
  } catch (error) {
    console.error('💥 Deployment setup failed:', error);
    process.exit(1);
  }
};

// Run the setup
main();
