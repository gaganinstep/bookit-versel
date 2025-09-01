# =============================================================================
# Bookit API Dockerfile
# =============================================================================

# Use Node.js 18 as the base image
FROM node:18

# Set working directory
WORKDIR /app

# =============================================================================
# Install Dependencies
# =============================================================================

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# =============================================================================
# Copy Application Code
# =============================================================================

# Copy the rest of the application
COPY . .

# =============================================================================
# Create Startup Script
# =============================================================================

# Create a startup script to handle database initialization
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting Bookit API..."\n\
\n\
# =============================================================================\n\
# Database Setup\n\
# =============================================================================\n\
\n\
echo "📊 Starting database setup..."\n\
\n\
# Wait for database to be ready\n\
echo "⏳ Waiting for database connection..."\n\
until npm run db:check 2>/dev/null; do\n\
    echo "   Database not ready, waiting 5 seconds..."\n\
    sleep 5\n\
done\n\
\n\
echo "✅ Database is ready!"\n\
\n\
# Run migrations (safe to run multiple times)\n\
echo "🔄 Running database migrations..."\n\
npm run db:migrate\n\
\n\
# Run seeds (should be idempotent)\n\
echo "🌱 Running database seeds..."\n\
npm run db:seeds\n\
\n\
echo "✅ Database setup complete!"\n\
\n\
# =============================================================================\n\
# Start Application\n\
# =============================================================================\n\
\n\
echo "🚀 Starting application..."\n\
exec npm start' > /app/startup.sh

# Make startup script executable
RUN chmod +x /app/startup.sh

# =============================================================================
# Environment Configuration
# =============================================================================

# Set environment variables
ENV NODE_ENV=production
ENV ENV_PATH=.env.production

# =============================================================================
# Expose Port
# =============================================================================

# Expose the application port
EXPOSE 3000

# =============================================================================
# Start Application
# =============================================================================

# Use the startup script as the entrypoint
CMD ["/app/startup.sh"]
