#!/bin/bash

# Deploy script for Euxton Methodist Church
set -e

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your environment variables."
    echo "   Required variables:"
    echo "   - SITE_MANAGER_API_KEY, SITE_MANAGER_URL"
    echo "   - MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Check health endpoints
echo "🏥 Checking health endpoints..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is healthy and accessible at http://localhost"
else
    echo "❌ Health check failed. Check logs with: docker-compose logs"
fi

# Check database connection
echo "🗄️  Checking database connection..."
if curl -f http://localhost/api/database-test > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection test failed. This is normal during initial startup."
    echo "   The database may still be initializing. Check logs with: docker-compose logs mysql"
fi

echo "🎉 Deployment complete!"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Access app: http://localhost"
echo "   Test database: http://localhost/api/database-test"
echo "   Connect to MySQL: docker-compose exec mysql mysql -u captiveuser -p CaptivePortal" 