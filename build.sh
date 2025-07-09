#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting frontend build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next out

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build and export static site
echo "🏗️ Building static site..."
npm run build:static

echo "✅ Build completed! The static site is in the 'out' directory"
echo "📂 Contents of the out directory:"
ls -la out/

echo "
🎉 Frontend build successful! 
Next steps:
1. Deploy the 'out' directory to Vercel
2. Set the following environment variables in Vercel:
   - NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
" 