#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Configuration
APP_NAME="enginetemplate"
APP_DIR="/opt/enginetemplate"
BACKUP_DIR="$APP_DIR/backup"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

echo "📦 Creating backup..."
if [ -d "$APP_DIR/.next" ]; then
  tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
    -C $APP_DIR .next node_modules package.json package-lock.json 2>/dev/null || true
  ls -t $BACKUP_DIR/backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
fi

echo "📥 Extracting new version..."
cd $APP_DIR
tar -xzf deploy.tar.gz
rm deploy.tar.gz

echo "🔄 Running database migrations..."
npx prisma migrate deploy || true

echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
  echo "⚠️  .env file not found! Creating from .env.example..."
  cp .env.example .env
  echo "⚠️  Please update .env file with your configuration!"
fi

echo "♻️  Restarting application..."
if command -v pm2 &> /dev/null; then
  pm2 restart $APP_NAME || pm2 start npm --name "$APP_NAME" -- start
  pm2 save
else
  echo "⚠️  PM2 not found. Installing..."
  npm install -g pm2
  pm2 start npm --name "$APP_NAME" -- start
  pm2 save
  pm2 startup
fi

echo "⏳ Waiting for app to start..."
sleep 10

echo "🔍 Checking app status..."
pm2 status || true

echo "🎉 Deployment completed!"
