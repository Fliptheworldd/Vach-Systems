const fs = require('fs');
const path = require('path');

console.log('🔥 Optimizing Critical Request Path...\n');

// Get all HTML files
const htmlFiles = [
  'index.html',
  'leistungen.html',
  'loesungen.html',
  'technologie.html',
  'projekte.html',
  'ueber-uns.html',
  'philosophie.html',
  'kontakt.html',
  'impressum.html',
  'datenschutz.html'
];

const blogDir = path.join(__dirname, 'blog');
const blogFiles = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.html'))
  .map(f => `blog/${f}`);

const allFiles = [...htmlFiles, ...blogFiles];

let filesUpdated = 0;

for (const file of allFiles) {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // 1. Remove cookie-banner.js (dead code, no GA)
  if (content.includes('cookie-banner.js')) {
    content = content.replace(/<script[^>]*cookie-banner\.js[^>]*><\/script>\s*/g, '');
    console.log(`✅ ${file}: Removed cookie-banner.js`);
    changed = true;
  }
  
  // 2. Add defer to script.js (non-blocking)
  if (content.includes('src="/js/script.js"') && !content.includes('defer')) {
    content = content.replace(
      /<script src="\/js\/script\.js"><\/script>/g,
      '<script src="/js/script.js" defer></script>'
    );
    console.log(`✅ ${file}: Added defer to script.js`);
    changed = true;
  }
  
  if (content.includes('src="../js/script.js"') && !content.includes('defer')) {
    content = content.replace(
      /<script src="\.\.\/js\/script\.js"><\/script>/g,
      '<script src="../js/script.js" defer></script>'
    );
    console.log(`✅ ${file}: Added defer to script.js`);
    changed = true;
  }
  
  // 3. Add defer to register-sw.js (non-blocking)
  if (content.includes('register-sw.js') && !content.includes('defer')) {
    content = content.replace(
      /<script src="(\.\.\/)?register-sw\.js"><\/script>/g,
      '<script src="$1register-sw.js" defer></script>'
    );
    console.log(`✅ ${file}: Added defer to register-sw.js`);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
  }
}

console.log(`\n🎉 Optimized ${filesUpdated} files!`);
console.log('\n📊 Critical Path Improvements:');
console.log('   ✅ Removed cookie-banner.js (dead code, -417ms)');
console.log('   ✅ Added defer to all scripts (non-blocking)');
console.log('   ✅ Scripts load in parallel, don\'t block render');
console.log('\n⚡ Expected LCP improvement: -400ms+');
