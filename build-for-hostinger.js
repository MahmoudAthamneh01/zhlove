#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building ZH-Love for Hostinger deployment...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  if (fs.existsSync('public_html')) {
    fs.rmSync('public_html', { recursive: true, force: true });
  }
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
} catch (error) {
  console.log('⚠️  Cleanup warning:', error.message);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Export static files
console.log('📤 Exporting static files...');
try {
  execSync('npx next export -o public_html', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Export failed:', error.message);
  process.exit(1);
}

// Copy .htaccess to public_html
console.log('📋 Copying .htaccess...');
try {
  if (fs.existsSync('public/.htaccess')) {
    fs.copyFileSync('public/.htaccess', 'public_html/.htaccess');
  }
} catch (error) {
  console.log('⚠️  Could not copy .htaccess:', error.message);
}

// Copy index.html to root
console.log('📋 Copying root index.html...');
try {
  if (fs.existsSync('public/index.html')) {
    fs.copyFileSync('public/index.html', 'public_html/index.html');
  }
} catch (error) {
  console.log('⚠️  Could not copy index.html:', error.message);
}

// Create deployment info
console.log('📝 Creating deployment info...');
const deploymentInfo = {
  buildTime: new Date().toISOString(),
  version: '1.0.0',
  deployment: 'hostinger-static',
  instructions: [
    '1. Upload all contents of public_html/ to your Hostinger public_html/ directory',
    '2. Ensure .htaccess is in the root of public_html/',
    '3. Make sure your PHP backend is in the /api/ directory',
    '4. Test the site at your domain'
  ]
};

fs.writeFileSync('public_html/DEPLOYMENT_INFO.json', JSON.stringify(deploymentInfo, null, 2));

console.log('✅ Build completed successfully!');
console.log('📁 Output directory: public_html/');
console.log('🚀 Ready for upload to Hostinger!');
console.log('');
console.log('� Deployment Instructions:');
console.log('1. Upload all contents of public_html/ to your Hostinger public_html/ directory');
console.log('2. Ensure .htaccess is in the root of public_html/');
console.log('3. Make sure your PHP backend is in the /api/ directory');
console.log('4. Test the site at your domain'); 