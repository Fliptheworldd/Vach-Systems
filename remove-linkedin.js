const fs = require('fs');

const files = [
  'index.html',
  'kontakt.html',
  'loesungen.html',
  'impressum.html',
  'datenschutz.html',
  'ueber-uns.html',
  'leistungen.html',
  'technologie.html',
  'projekte.html',
  'philosophie.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Remove LinkedIn link from footer
  content = content.replace(
    /<a href="https:\/\/www\.linkedin\.com\/in\/patrick-vach-833b421a0\/" target="_blank" rel="noopener">LinkedIn<\/a>/g,
    ''
  );
  
  // Remove LinkedIn contact section on kontakt.html
  if (file === 'kontakt.html') {
    content = content.replace(
      /<div style="padding: 2rem; background: white; border-radius: 12px; border: 2px solid var\(--gray-200\);">[\s\S]*?<h3 style="font-size: 1\.25rem; font-weight: 700; margin: 0;">LinkedIn<\/h3>[\s\S]*?<\/div>/,
      ''
    );
  }
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ ${file}`);
});

console.log('\n🎉 LinkedIn removed from all pages!');
