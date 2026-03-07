const fs = require('fs');

const files = [
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

const newMenu = `    <div class="mobile-menu" id="mobileMenu">
        <a href="index.html">Home</a>
        <a href="leistungen.html">Leistungen</a>
        <a href="loesungen.html">Lösungen</a>
        <a href="ueber-uns.html">Über uns</a>
        <a href="kontakt.html" class="nav-cta">Beratungsgespräch</a>
    </div>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace mobile menu (match any content between the div tags)
  content = content.replace(
    /<div class="mobile-menu" id="mobileMenu">[\s\S]*?<\/div>/,
    newMenu
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ ${file}`);
});

console.log('\n🎉 Mobile menu cleaned on all pages!');
