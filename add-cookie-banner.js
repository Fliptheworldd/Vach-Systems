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

const cookieBannerScript = `    <script src="js/cookie-banner.js"></script>\n`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Insert cookie banner script before closing </body>
  if (!content.includes('cookie-banner.js')) {
    content = content.replace('</body>', cookieBannerScript + '</body>');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}`);
  } else {
    console.log(`⏭️  ${file} (already has cookie banner)`);
  }
});

console.log('\n🎉 Cookie banner script added to all pages!');
