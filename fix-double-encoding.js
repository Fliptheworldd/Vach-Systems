const fs = require('fs');
const path = require('path');

const files = [
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

const fixes = [
  // Double-encoded UTF-8 → correct UTF-8
  [/Ã¤/g, 'ä'],
  [/Ã¶/g, 'ö'],
  [/Ã¼/g, 'ü'],
  [/Ã„/g, 'Ä'],
  [/Ã–/g, 'Ö'],
  [/Ãœ/g, 'Ü'],
  [/ÃŸ/g, 'ß'],
  [/Ã /g, 'à'],
  [/Ã©/g, 'é'],
  [/Ã¨/g, 'è'],
  
  // Common words that might be broken
  [/MaÃ/g, 'Maß'],
  [/groÃ/g, 'groß'],
  [/auÃ/g, 'auß'],
  [/StraÃ/g, 'Straß'],
  [/heiÃ/g, 'heiß'],
  [/weiÃ/g, 'weiß']
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} not found, skipping`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Apply all fixes
  fixes.forEach(([pattern, replacement]) => {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) {
      changeCount++;
    }
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file} (${changeCount} patterns replaced)`);
});

console.log('\n🎉 All double-encoding fixed!');
