#!/bin/bash
set -euo pipefail

PROJECT_DIR="/opt/terimaundangan"
IMAGE_NAME="terimaundangan-app"
CONTAINER_NAME="terimaundangan"
NETWORK="staging_app_net"

cd "$PROJECT_DIR"

echo "Pulling latest code..."
git pull origin main

echo "Building Docker image..."
docker build --no-cache -t "$IMAGE_NAME" "$PROJECT_DIR"

echo "Stopping old container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

echo "Starting new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --network "$NETWORK" \
  -p 3000:3000 \
  -v "$PROJECT_DIR/public/uploads:/app/public/uploads" \
  --env-file "$PROJECT_DIR/.env" \
  "$IMAGE_NAME"

echo "Setting auto-restart..."
docker update --restart unless-stopped "$CONTAINER_NAME"

echo "Deploy complete."
echo "App: https://undangan.deployan.com"
echo "Logs: docker logs -f $CONTAINER_NAME"
