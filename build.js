// BUILD SCRIPT - Optimize for production
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building production assets...\n');

// 1. Minify JavaScript
console.log('📦 Minifying JavaScript...');
try {
  execSync('npx terser js/script.js -c -m -o js/script.min.js --source-map "url=script.min.js.map"', { stdio: 'inherit' });
  const originalSize = fs.statSync('js/script.js').size;
  const minifiedSize = fs.statSync('js/script.min.js').size;
  const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
  console.log(`✅ JS: ${(originalSize/1024).toFixed(1)}KB → ${(minifiedSize/1024).toFixed(1)}KB (${savings}% kleiner)\n`);
} catch (err) {
  console.error('❌ JS minification failed:', err.message);
}

// 2. Minify CSS
console.log('🎨 Minifying CSS...');
try {
  execSync('npx cleancss -o css/style.min.css css/style.css', { stdio: 'inherit' });
  const originalSize = fs.statSync('css/style.css').size;
  const minifiedSize = fs.statSync('css/style.min.css').size;
  const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
  console.log(`✅ CSS: ${(originalSize/1024).toFixed(1)}KB → ${(minifiedSize/1024).toFixed(1)}KB (${savings}% kleiner)\n`);
} catch (err) {
  console.error('❌ CSS minification failed:', err.message);
}

// 3. Update Service Worker version
console.log('🔄 Updating Service Worker version...');
const swPath = path.join(__dirname, 'sw.js');
let swContent = fs.readFileSync(swPath, 'utf8');
const newVersion = `v${new Date().toISOString().split('T')[0]}-${Date.now().toString().slice(-4)}`;
swContent = swContent.replace(/const CACHE_VERSION = '[^']+';/, `const CACHE_VERSION = '${newVersion}';`);
fs.writeFileSync(swPath, swContent, 'utf8');
console.log(`✅ SW version: ${newVersion}\n`);

console.log('🎉 Build complete!');
console.log('\n💡 Note: HTML files still reference non-minified versions for easier debugging.');
console.log('   For production, manually update <script src="/js/script.js"> to <script src="/js/script.min.js">');
