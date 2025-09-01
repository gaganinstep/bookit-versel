# Vercel Deployment Guide for BookIT Backend

This guide will help you deploy your BookIT backend to Vercel with Neon PostgreSQL database.

## 🚀 Prerequisites

1. **Vercel Account**: Make sure you have a Vercel account and CLI installed
2. **Neon Database**: Your PostgreSQL database should be set up on Neon
3. **Code Repository**: Your code should be pushed to a Git repository (GitHub, GitLab, etc.)

## 📋 Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

### Database Configuration (Neon)
```
DB_USERNAME=your_neon_username
DB_PASSWORD=your_neon_password
DB_NAME=your_neon_database_name
DB_HOST=your_neon_host
DB_PORT=5432
NODE_ENV=production
```

### Other Required Variables
```
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=your_redis_host (if using Redis)
REDIS_PORT=your_redis_port (if using Redis)
API_VERSION=v1
```

## 🔧 Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Select the repository containing your BookIT backend

### 2. Configure Build Settings

- **Framework Preset**: Other
- **Build Command**: Leave empty (not needed for Node.js)
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### 3. Set Environment Variables

Add all the environment variables listed above in the Vercel dashboard.

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## 🗄️ Database Setup

After deployment, your database will be automatically set up using the deployment script:

1. **Migrations**: Run automatically via `npm run db:migrate`
2. **Seeds**: Run automatically via `npm run db:seeds`

## 📁 Project Structure for Vercel

```
bookit-versel/
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to exclude from deployment
├── index.js                 # Main entry point
├── package.json             # Dependencies and scripts
├── config/
│   ├── database.js          # Database configuration
│   └── ...                  # Other config files
├── scripts/
│   └── deploy-setup.js      # Deployment setup script
└── ...                      # Other project files
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your Neon database credentials
   - Ensure the database is accessible from Vercel's servers
   - Verify SSL settings in your database configuration

2. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility
   - Review build logs in Vercel dashboard

3. **Runtime Errors**
   - Check Vercel function logs
   - Verify environment variables are set correctly
   - Ensure database migrations run successfully

### Debugging Commands

```bash
# Check database connection
npm run db:check

# Run deployment setup manually
npm run deploy:setup

# View logs in Vercel
vercel logs
```

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments, builds, and function executions
- **Function Logs**: View runtime logs and errors
- **Performance**: Monitor response times and function duration

## 🔄 Continuous Deployment

Once set up, Vercel will automatically deploy your backend whenever you push changes to your main branch.

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Review the deployment setup script

## 🎯 Next Steps

After successful deployment:
1. Test your API endpoints
2. Set up custom domains if needed
3. Configure monitoring and alerts
4. Set up staging environments

---

**Note**: Make sure your Neon database allows connections from Vercel's IP ranges and has SSL enabled for production use.
