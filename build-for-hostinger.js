#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building ZH-Love for Hostinger Premium...');

// Step 1: Update next.config.js for static export
console.log('1. Configuring Next.js for static export...');
const nextConfigPath = path.join(__dirname, 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

// Add output: 'export' for static build
nextConfig = nextConfig.replace(
  '// Remove output: \'export\' to allow both development and static export',
  '// Enable static export for Hostinger deployment\n  output: \'export\','
);

fs.writeFileSync(nextConfigPath, nextConfig);

// Step 2: Build the static export
console.log('2. Building static export...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Create public_html structure
console.log('3. Creating public_html structure...');
const publicHtmlDir = path.join(__dirname, 'public_html');
const outDir = path.join(__dirname, 'out');

// Ensure public_html exists
if (!fs.existsSync(publicHtmlDir)) {
  fs.mkdirSync(publicHtmlDir, { recursive: true });
}

// Copy static files from out/ to public_html/
if (fs.existsSync(outDir)) {
  const copyRecursive = (src, dest) => {
    if (fs.statSync(src).isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(outDir, publicHtmlDir);
  console.log('✅ Static files copied to public_html/');
} else {
  console.error('❌ Build output not found');
  process.exit(1);
}

// Step 4: Create .htaccess for SPA routing
console.log('4. Creating .htaccess for frontend routing...');
const htaccessContent = `# Frontend Routing for Next.js Static Export
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

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
</IfModule>

# PHP settings for better performance
<IfModule mod_php.c>
    php_value memory_limit 256M
    php_value upload_max_filesize 10M
    php_value post_max_size 10M
    php_value max_execution_time 300
    php_value max_input_time 300
</IfModule>`;

fs.writeFileSync(path.join(publicHtmlDir, '.htaccess'), htaccessContent);
console.log('✅ .htaccess created');

// Step 5: Create index.html redirect for language fallback
console.log('5. Creating language redirect logic...');
const indexHtmlPath = path.join(publicHtmlDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Add language detection script
  const languageScript = `
<script>
// Language detection and redirect
(function() {
  var userLang = navigator.language || navigator.userLanguage;
  var path = window.location.pathname;
  
  // If not already on a locale path, redirect to appropriate locale
  if (!path.match(/^\/(en|ar)\//)) {
    var locale = 'en'; // default
    if (userLang.startsWith('ar')) {
      locale = 'ar';
    }
    window.location.href = '/' + locale + '/';
  }
})();
</script>`;
  
  // Insert script before closing head tag
  indexHtml = indexHtml.replace('</head>', languageScript + '\n</head>');
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('✅ Language redirect added to index.html');
}

// Step 6: Create deployment package
console.log('6. Creating deployment package...');
const packageName = 'zh-love-hostinger.zip';
try {
  execSync(`cd public_html && zip -r ../${packageName} .`, { stdio: 'inherit' });
  console.log(`✅ Deployment package created: ${packageName}`);
} catch (error) {
  console.log('⚠️  Zip command not available, skipping package creation');
}

// Step 7: Restore next.config.js for development
console.log('7. Restoring next.config.js for development...');
nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
nextConfig = nextConfig.replace(
  '// Enable static export for Hostinger deployment\n  output: \'export\',',
  '// Remove output: \'export\' to allow both development and static export'
);
fs.writeFileSync(nextConfigPath, nextConfig);

console.log('\n🎉 Build completed successfully!');
console.log('\n📁 Files ready for deployment:');
console.log('   - public_html/ (upload to Hostinger)');
console.log('   - zh-love-hostinger.zip (alternative deployment)');
console.log('\n🚀 Deployment instructions:');
console.log('   1. Upload public_html/ contents to your Hostinger domain');
console.log('   2. Ensure PHP APIs are in the /api/ folder');
console.log('   3. Configure database connection in /api/config/database.php');
console.log('   4. Test the application at your domain'); 