#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building ZH-Love for Hostinger...\n');

// Step 1: Clean previous builds
console.log('1. Cleaning previous builds...');
try {
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
} catch (error) {
  console.log('   Could not clean "out" directory, continuing...');
}

try {
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
} catch (error) {
  console.log('   Could not clean ".next" directory, continuing...');
}

// Step 2: Set production environment
console.log('2. Setting production environment...');
process.env.NODE_ENV = 'production';

// Step 3: Build Next.js static export
console.log('3. Building Next.js static export...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Create .htaccess for frontend routing
console.log('4. Creating .htaccess for frontend routing...');
const htaccessContent = `# Frontend Routing for Next.js Static Export
RewriteEngine On

# API routes - redirect to api folder
RewriteRule ^api/(.*)$ /api/$1 [L]

# Handle Next.js static files
RewriteRule ^_next/(.*)$ /_next/$1 [L]

# Handle locale routing
RewriteRule ^(en|ar)/(.*)$ /$2 [E=LOCALE:$1,L]

# Default locale redirect
RewriteRule ^$ /en/ [R=302,L]

# Fallback for client-side routing (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE image/x-icon
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-truetype
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-woff
    AddOutputFilterByType DEFLATE application/font-woff
    AddOutputFilterByType DEFLATE application/font-woff2
</IfModule>`;

fs.writeFileSync(path.join('out', '.htaccess'), htaccessContent);

// Step 5: Copy PHP APIs to output
console.log('5. Copying PHP APIs...');
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

// Copy PHP API files
copyRecursiveSync('public_html/api', 'out/api');
copyRecursiveSync('public_html/database', 'out/database');

// Copy existing .htaccess from public_html if exists
if (fs.existsSync('public_html/.htaccess')) {
  const phpHtaccess = fs.readFileSync('public_html/.htaccess', 'utf8');
  const combinedHtaccess = phpHtaccess + '\n\n' + htaccessContent;
  fs.writeFileSync(path.join('out', '.htaccess'), combinedHtaccess);
}

// Step 6: Create deployment info
console.log('6. Creating deployment info...');
const deploymentInfo = {
  buildDate: new Date().toISOString(),
  buildType: 'static-export',
  target: 'hostinger',
  apis: 'php',
  frontend: 'next.js-static'
};
fs.writeFileSync(path.join('out', 'deployment-info.json'), JSON.stringify(deploymentInfo, null, 2));

console.log('\n✅ Build completed successfully!');
console.log('\n📁 Files ready for upload in ./out directory');
console.log('\n🚀 Next steps:');
console.log('   1. Upload contents of ./out directory to your Hostinger public_html/');
console.log('   2. Update database credentials in /api/config/database.php');
console.log('   3. Update domain in /api/config/cors.php');
console.log('   4. Test your website!');
console.log('\n🌐 Your site will be available at: https://yourdomain.com'); 