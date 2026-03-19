const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const htmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

// Mapping of Unsplash URLs to local WebP files
const imageMap = {
  'photo-1450101499163-c8848c66ca85': '1450101499163-c8848c66ca85.webp',
  'photo-1460925895917-afdab827c52f': '1460925895917-afdab827c52f.webp',
  'photo-1486312338219-ce68d2c6f44d': '1486312338219-ce68d2c6f44d.webp',
  'photo-1531482615713-2afd69097998': '1531482615713-2afd69097998.webp',
  'photo-1531746790731-6c087fecd65a': '1531746790731-6c087fecd65a.webp',
  'photo-1551288049-bebda4e38f71': '1551288049-bebda4e38f71.webp',
  'photo-1553413077-190dd305871c': '1553413077-190dd305871c.webp',
  'photo-1554224154-26032ffc0d07': '1554224154-26032ffc0d07.webp',
  'photo-1554224155-8d04cb21cd6c': '1554224155-8d04cb21cd6c.webp',
  'photo-1556742502-ec7c0e9f34b1': '1556742502-ec7c0e9f34b1.webp',
  'photo-1556761175-b413da4baf72': '1556761175-b413da4baf72.webp',
  'photo-1558346490-a72e53ae2d4f': '1558346490-a72e53ae2d4f.webp',
  'photo-1558494949-ef010cbdcc31': '1558494949-ef010cbdcc31.webp',
  'photo-1586528116311-ad8dd3c8310d': '1586528116311-ad8dd3c8310d.webp',
  'photo-1589829545856-d10d557cf95f': '1589829545856-d10d557cf95f.webp',
  'photo-1633356122544-f134324a6cee': '1633356122544-f134324a6cee.webp'
};

let totalChanges = 0;

for (const file of htmlFiles) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  // Replace all Unsplash URLs with local WebP paths
  for (const [unsplashId, webpFile] of Object.entries(imageMap)) {
    const regex = new RegExp(
      `https://images\\.unsplash\\.com/${unsplashId}\\?w=\\d+&q=\\d+`,
      'g'
    );
    
    const before = content;
    content = content.replace(regex, `../images/blog/${webpFile}`);
    if (content !== before) {
      changes++;
    }
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} (${changes} replacements)`);
    totalChanges += changes;
  }
}

console.log(`\n🎉 Updated ${totalChanges} image references in ${htmlFiles.length} blog articles!`);
