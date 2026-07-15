#!/bin/bash

# Production deployment script for Acquisition App
# This script starts the application in production mode with Neon Cloud Database

echo "🚀 Starting Acquisition App in Production Mode"
echo "==============================================="

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "   Please create .env.production with your production environment variables."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker and try again."
    exit 1
fi

echo "📦 Building and starting production container..."
echo "   - Using Neon Cloud Database (direct connection, no local proxy)"
echo "   - Running in optimized production mode"
echo ""

# 1. Prvo pokrećemo migracije sa Drizzle-om na cloudu
# Najbolja praksa je da se migracije izvrše PRIJE nego što se podigne nova verzija aplikacije
echo "📜 Applying latest schema to Neon Cloud with Drizzle..."
npm run db:migrate

# 2. Pokrećemo produkcijski kontejner u pozadini (-d)
echo "🚀 Starting application container..."
docker compose -f docker-compose.prod.yml up --build -d

echo ""
echo "🎉 Production environment started!"
echo "   Application: http://localhost:3000"
echo "   Logs: docker compose -f docker-compose.prod.yml logs"
echo ""
echo "Useful commands:"
echo "   View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "   Stop app:  docker compose -f docker-compose.prod.yml down"