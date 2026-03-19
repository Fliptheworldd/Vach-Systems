const fs = require('fs');
const path = require('path');

const filesToUpdate = [
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

const allFiles = [...filesToUpdate, ...blogFiles];

function getSWScript(file) {
  const isInBlog = file.startsWith('blog/');
  const scriptPath = isInBlog ? '../register-sw.js' : '/register-sw.js';
  return `    <script src="${scriptPath}" defer></script>
</body>`;
}

let updated = 0;

for (const file of allFiles) {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has SW registration
  if (content.includes('register-sw.js')) {
    console.log(`✓ ${file} already has SW`);
    continue;
  }
  
  // Add SW script before </body>
  if (content.includes('</body>')) {
    const swScript = getSWScript(file);
    content = content.replace('</body>', swScript);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} updated`);
    updated++;
  } else {
    console.log(`⚠️  ${file} has no </body> tag`);
  }
}

console.log(`\n🎉 Updated ${updated} files with Service Worker registration!`);
