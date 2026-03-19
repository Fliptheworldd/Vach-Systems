const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const htmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

console.log(`📝 Optimizing ${htmlFiles.length} blog articles...\n`);

let totalChanges = 0;

for (const file of htmlFiles) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // 1. Add font preload (before existing fonts.googleapis link)
  if (!content.includes('rel="preconnect"')) {
    content = content.replace(
      '<link rel="stylesheet" href="../css/style.css">',
      `<link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
    );
    changes++;
  }
  
  // 2. Replace single img src with srcset + lazy loading
  // Pattern: <img src="../images/blog/XXXXX.webp" alt="..." class="article-image">
  const imgPattern = /<img src="\.\.\/images\/blog\/([^"]+)\.webp" alt="([^"]*)" class="article-image">/g;
  
  content = content.replace(imgPattern, (match, filename, alt) => {
    changes++;
    return `<img srcset="../images/blog/${filename}-mobile.webp 600w, ../images/blog/${filename}.webp 1400w" 
                 sizes="(max-width: 768px) 600px, 1400px"
                 src="../images/blog/${filename}.webp" 
                 alt="${alt}" 
                 class="article-image"
                 loading="lazy"
                 width="1400"
                 height="933">`;
  });
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} (${changes} optimizations)`);
    totalChanges += changes;
  }
}

console.log(`\n🎉 Optimized ${totalChanges} elements in ${htmlFiles.length} articles!`);
console.log('\n📊 Performance improvements:');
console.log('   ✅ Responsive images (600px mobile, 1400px desktop)');
console.log('   ✅ Lazy loading enabled');
console.log('   ✅ Font preconnect added');
console.log('   ✅ Width/height attributes (prevent layout shift)');
