#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Starting Neon Local database..."
# Pokrećemo samo bazu u pozadini (-d) kako bismo mogli izvršiti migracije na njoj
docker compose -f docker-compose.dev.yml up -d neon-local

echo "⏳ Waiting for the database port 5432 to be ready..."
# Provjeravamo da li je port 5432 otvoren na localhostu
# Ovo radi pouzdano na svim Windows terminalima (Git Bash, WSL)
until (echo > /dev/tcp/127.0.0.1/5432) >/dev/null 2>&1; do
    echo "   Database port is not open yet... waiting..."
    sleep 2
done

# Čim se port otvori, dajemo bazi još 3 sekunde da potpuno podigne internu tabelu/granu
echo "✅ Database port is open! Waiting 3 more seconds for safe initialization..."
sleep 3
echo "✅ Database is ready!"

# Primijeni migracije sa Drizzle
echo "📜 Applying latest schema with Drizzle..."
npm run db:migrate

echo "🚀 Starting application container..."
# Sada pokrećemo i app kontejner koji zavisi od neon-local
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment started!"
echo "   Application API: http://localhost:8080"
echo "   Database: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"