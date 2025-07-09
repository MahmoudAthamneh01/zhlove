#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting ZH-Love build process..."

# Clean up any existing build artifacts
echo "🧹 Cleaning up build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Set Node.js memory options
export NODE_OPTIONS="--max-old-space-size=4096"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!" 