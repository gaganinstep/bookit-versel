# Database Configuration Setup

This document explains how to configure the database connection for different environments in the BookIT API.

## Issue Resolution

The original issue was that the database configuration was hardcoded to require SSL connections, which caused errors when trying to connect to local PostgreSQL instances that don't support SSL.

## Solution

The configuration system has been updated to automatically detect the environment and apply appropriate SSL settings:

- **Local Development**: SSL is disabled for localhost connections
- **Production/Remote**: SSL is enabled for security

## Quick Start

### 1. Switch to Local Database (for development)

```bash
npm run db:local
```

This will configure the system to use:
- Host: `localhost`
- Port: `5432`
- Database: `bookit_dev`
- Username: `postgres`
- Password: `password`
- SSL: **Disabled**

### 2. Switch to Remote Database (for production)

```bash
npm run db:remote
```

This will configure the system to use:
- Host: `ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech`
- Port: `5432`
- Database: `neondb`
- Username: `neondb_owner`
- Password: `npg_MrCBaznx6EX1`
- SSL: **Enabled**

## Manual Configuration

You can also manually edit the `env.local` file to customize your database settings.

### Local Development Configuration

```bash
# Database Configuration (Local PostgreSQL)
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=bookit_dev
DB_HOST=localhost
DB_PORT=5432
```

### Remote Database Configuration

```bash
# Database Configuration (Neon PostgreSQL)
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_MrCBaznx6EX1
DB_NAME=neondb
DB_HOST=ep-shy-lab-a29jaxd0-pooler.eu-central-1.aws.neon.tech
DB_PORT=5432
```

## Database Operations

### Create Database

```bash
npm run db:create
```

### Run Migrations

```bash
npm run db:migrate
```

### Run Seeds

```bash
npm run db:seeds
```

### Check Database Connection

```bash
npm run db:check
```

## Environment Variables

The system automatically detects the environment and applies appropriate SSL settings based on:

- `NODE_ENV`: Set to `production` for production environments
- `DB_HOST`: Automatically detects localhost vs remote hosts

## SSL Configuration

### Local Development
- SSL is automatically disabled for `localhost` and `127.0.0.1`
- No SSL configuration needed

### Production/Remote
- SSL is automatically enabled for remote hosts
- Uses `require: true` and `rejectUnauthorized: false`

## Troubleshooting

### SSL Connection Errors

If you encounter SSL-related errors:

1. **For local development**: Run `npm run db:local`
2. **For remote databases**: Run `npm run db:remote`
3. **Check your environment**: Ensure `NODE_ENV` is set correctly

### Connection Refused

1. Ensure PostgreSQL is running locally
2. Check if the port `5432` is available
3. Verify database credentials in `env.local`

### Database Not Found

1. Create the database: `npm run db:create`
2. Check if the database name exists
3. Verify database permissions

## File Structure

```
config/
├── config.js          # Sequelize CLI configuration
├── database.js        # Database connection configuration
└── dbConnection.js    # Database connection manager

scripts/
└── switch-db-config.js # Database configuration switcher

env.local              # Environment configuration
```

## Notes

- The `env.local` file contains sensitive information and should not be committed to version control
- SSL is automatically configured based on the host and environment
- Local development uses simplified configuration without SSL
- Production environments maintain security with SSL enabled
