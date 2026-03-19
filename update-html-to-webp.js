const fs = require('fs');
const path = require('path');

const htmlDir = __dirname;
const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

let totalChanges = 0;

for (const file of htmlFiles) {
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Replace image references
  const patterns = [
    // src="images/hero-bg-1.png" → src="images/hero-bg-1.webp"
    { from: /src="(images|assets|img)\/([^"]+)\.(png|jpg|jpeg)"/gi, to: 'src="$1/$2.webp"' },
    // background-image: url('images/hero-bg-1.png') → url('images/hero-bg-1.webp')
    { from: /url\(['"]?(images|assets|img)\/([^'"]+)\.(png|jpg|jpeg)['"]?\)/gi, to: "url('$1/$2.webp')" },
    // <link rel="icon" href="assets/logo.png"> → <link rel="icon" href="assets/logo.webp">
    { from: /href="(images|assets|img)\/([^"]+)\.(png|jpg|jpeg)"/gi, to: 'href="$1/$2.webp"' },
  ];
  
  for (const pattern of patterns) {
    const before = content;
    content = content.replace(pattern.from, pattern.to);
    if (content !== before) changes++;
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} (${changes} changes)`);
    totalChanges += changes;
  }
}

console.log(`\n🎉 Updated ${totalChanges} image references in ${htmlFiles.length} HTML files!`);
