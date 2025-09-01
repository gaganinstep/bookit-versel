#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '../env.local');

const localConfig = `ENV_PATH=development
DB_TYPE=postgres
API_VERSION=v1
PORT=5001

# ===== LOCAL DEVELOPMENT CONFIGURATION =====
# Database Configuration (Local PostgreSQL)
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=bookit_dev
DB_HOST=localhost
DB_PORT=5432

# ===== REMOTE DATABASE CONFIGURATION (Neon PostgreSQL) =====
# Uncomment the following lines for remote database
# DB_USERNAME=neondb_owner
# DB_PASSWORD=npg_MrCBaznx6EX1
# DB_NAME=neondb
# DB_HOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
# DB_PORT=5432

# Test OTP
TEST_OTP= 123456

# JWT Configuration
JWT_SECRET=78d0ef0bab3cc84eb907968b316dfba646a71b24728bf6559f8e644b4ace5ab3
REFRESH_TOKEN_SECRET=78d0ef0bab3cc84eb907968b316dfba646a71b24728bf6559f8e644bq23d4s48
JWT_ACCESS_EXPIRATION_TIME=1d
JWT_REFRESH_EXPIRATION_TIME=30d
JWT_RESET_PASSWORD_EXPIRATION_TIME=1h
JWT_VERIFY_EMAIL_EXPIRATION_TIME=1h
JWT_VERIFY_PHONE_EXPIRATION_TIME=1h
JWT_VERIFY_OTP_EXPIRATION_TIME=5m
JWT_VERIFY_OTP_LENGTH=6

# Email Configuration
MAILJET_API_KEY= a4212d5912ba096763ad953118f82962
MAILJET_API_SECRET= 6aaf32bb5de81a4f8cf8da74c9ce53bd
MAILJET_EMAIL= aicha.niazy@gmail.com

BRAVO_SMTP_HOST=smtp-relay.brevo.com
BRAVO_SMTP_PORT=587
BRAVO_SMTP_SECURE=false
BRAVO_SMTP_USER=918ac3001@smtp-brevo.com
BRAVO_SMTP_PASS=NIHAysxVThzG6gWQ
BREVO_API_KEY=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
BREVO_SENDER_EMAIL=bookitgo@bookit-app.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC72700fd00bfbced164abff11357ac9df
TWILIO_AUTH_TOKEN=882a58dda5467404acd2e1a0ce1d9a1e
TWILIO_PHONE_NUMBER=+13194585515
TWILIO_ACCOUNT_AUTHTOKEN=882a58dda5467404acd2e1a0ce1d9a1e

# ===== VERCEL CONFIGURATION =====
# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
PGHOST_UNPOOLED=ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_MrCBaznx6EX1

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
POSTGRES_PASSWORD=npg_MrCBaznx6EX1
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=546f502f-92ae-475d-9d17-68248868bbc1
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_864v5dfytb7zj24gyw90hcf1kv1ws2vakfagtc1c7zthg
STACK_SECRET_SERVER_KEY=ssk_71r16xrtqj3srt9mr4z7nmbwqccan8rhjhd7etjx4z560
`;

const remoteConfig = `ENV_PATH=development
DB_TYPE=postgres
API_VERSION=v1
PORT=5001

# ===== LOCAL DEVELOPMENT CONFIGURATION =====
# Uncomment the following lines for local development with local PostgreSQL
# DB_USERNAME=postgres
# DB_PASSWORD=password
# DB_NAME=bookit_dev
# DB_HOST=localhost
# DB_PORT=5432

# ===== REMOTE DATABASE CONFIGURATION (Neon PostgreSQL) =====
# Database Configuration (Neon PostgreSQL)
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_MrCBaznx6EX1
DB_NAME=neondb
DB_HOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
DB_PORT=5432

# Test OTP
TEST_OTP= 123456

# JWT Configuration
JWT_SECRET=78d0ef0bab3cc84eb907968b316dfba646a71b24728bf6559f8e644b4ace5ab3
REFRESH_TOKEN_SECRET=78d0ef0bab3cc84eb907968b316dfba646a71b24728bf6559f8e644bq23d4s48
JWT_ACCESS_EXPIRATION_TIME=1d
JWT_REFRESH_EXPIRATION_TIME=30d
JWT_RESET_PASSWORD_EXPIRATION_TIME=1h
JWT_VERIFY_EMAIL_EXPIRATION_TIME=1h
JWT_VERIFY_PHONE_EXPIRATION_TIME=1h
JWT_VERIFY_OTP_EXPIRATION_TIME=5m
JWT_VERIFY_OTP_LENGTH=6

# Email Configuration
MAILJET_API_KEY= a4212d5912ba096763ad953118f82962
MAILJET_API_SECRET= 6aaf32bb5de81a4f8cf8da74c9ce53bd
MAILJET_EMAIL= aicha.niazy@gmail.com

BRAVO_SMTP_HOST=smtp-relay.brevo.com
BRAVO_SMTP_PORT=587
BRAVO_SMTP_SECURE=false
BRAVO_SMTP_USER=918ac3001@smtp-brevo.com
BRAVO_SMTP_PASS=NIHAysxVThzG6gWQ
BREVO_API_KEY=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
BREVO_SENDER_EMAIL=bookitgo@bookit-app.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC72700fd00bfbced164abff11357ac9df
TWILIO_AUTH_TOKEN=882a58dda5467404acd2e1a0ce1d9a1e
TWILIO_PHONE_NUMBER=+13194585515
TWILIO_ACCOUNT_AUTHTOKEN=882a58dda5467404acd2e1a0ce1d9a1e

# ===== VERCEL CONFIGURATION =====
# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
PGHOST_UNPOOLED=ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_MrCBaznx6EX1

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0.eu-central-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
POSTGRES_PASSWORD=npg_MrCBaznx6EX1
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_MrCBaznx6EX1@ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=546f502f-92ae-475d-9d17-68248868bbc1
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_864v5dfytb7zj24gyw90hcf1kv1ws2vakfagtc1c7zthg
STACK_SECRET_SERVER_KEY=ssk_71r16xrtqj3srt9mr4z7nmbwqccan8rhjhd7etjx4z560
`;

function switchToLocal() {
  fs.writeFileSync(envLocalPath, localConfig);
  console.log('✅ Switched to LOCAL database configuration');
  console.log('📝 Updated env.local file');
  console.log('🔧 SSL is now DISABLED for localhost connections');
}

function switchToRemote() {
  fs.writeFileSync(envLocalPath, remoteConfig);
  console.log('✅ Switched to REMOTE database configuration');
  console.log('📝 Updated env.local file');
  console.log('🔒 SSL is now ENABLED for remote connections');
}

function showUsage() {
  console.log('🔧 Database Configuration Switcher');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/switch-db-config.js local    # Switch to local database');
  console.log('  node scripts/switch-db-config.js remote  # Switch to remote database');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/switch-db-config.js local   # Use localhost PostgreSQL');
  console.log('  node scripts/switch-db-config.js remote  # Use Neon PostgreSQL');
}

const command = process.argv[2];

switch (command) {
  case 'local':
    switchToLocal();
    break;
  case 'remote':
    switchToRemote();
    break;
  default:
    showUsage();
    process.exit(1);
}
