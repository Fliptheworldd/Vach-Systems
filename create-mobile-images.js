const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const blogImagesDir = path.join(__dirname, 'images', 'blog');
const files = fs.readdirSync(blogImagesDir).filter(f => f.endsWith('.webp'));

console.log(`📱 Creating mobile versions for ${files.length} images...\n`);

async function createMobileVersions() {
  for (const file of files) {
    const inputPath = path.join(blogImagesDir, file);
    const baseName = file.replace('.webp', '');
    const mobileFileName = `${baseName}-mobile.webp`;
    const mobilePath = path.join(blogImagesDir, mobileFileName);
    
    // Skip if mobile version already exists
    if (fs.existsSync(mobilePath)) {
      console.log(`⏭️  ${mobileFileName} already exists`);
      continue;
    }
    
    try {
      const originalStats = fs.statSync(inputPath);
      
      await sharp(inputPath)
        .resize(600, null, { // 600px width, height auto
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 80 }) // 80% quality for mobile (smaller file)
        .toFile(mobilePath);
      
      const mobileStats = fs.statSync(mobilePath);
      const originalKB = (originalStats.size / 1024).toFixed(0);
      const mobileKB = (mobileStats.size / 1024).toFixed(0);
      const savings = (((originalStats.size - mobileStats.size) / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${baseName}: ${originalKB}KB → ${mobileKB}KB (${savings}% kleiner)`);
    } catch (err) {
      console.error(`❌ Error creating mobile version for ${file}:`, err.message);
    }
  }
  
  console.log('\n🎉 Mobile images created!');
}

createMobileVersions();
