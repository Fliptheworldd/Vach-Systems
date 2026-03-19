const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

// Images to optimize with different sizes
const images = [
  { name: 'case-before.webp', sizes: [400, 650, 1024, 1536] },
  { name: 'case-after.webp', sizes: [400, 650, 1024, 1536] },
  { name: 'problem-section.webp', sizes: [400, 650, 1024, 1536] },
  { name: 'solution-section.webp', sizes: [400, 650, 1024, 1536] },
  { name: 'tech-bg.webp', sizes: [400, 650, 1024, 1536] },
  { name: 'hero-tech.webp', sizes: [600, 1024, 1920] } // Hero needs larger sizes
];

async function optimizeImages() {
  console.log('🖼️  Creating responsive versions...\n');
  
  for (const img of images) {
    const inputPath = path.join(imagesDir, img.name);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`⏭️  ${img.name} not found, skipping`);
      continue;
    }
    
    const originalStats = fs.statSync(inputPath);
    const baseName = img.name.replace('.webp', '');
    
    console.log(`📷 ${img.name} (${(originalStats.size / 1024).toFixed(0)}KB)`);
    
    for (const width of img.sizes) {
      const outputName = width === Math.max(...img.sizes) ? img.name : `${baseName}-${width}w.webp`;
      const outputPath = path.join(imagesDir, outputName);
      
      try {
        await sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ 
            quality: width === Math.max(...img.sizes) ? 85 : 80, // Original size: 85%, smaller: 80%
            effort: 6 // Higher compression effort
          })
          .toFile(outputPath);
        
        const newStats = fs.statSync(outputPath);
        const newSize = (newStats.size / 1024).toFixed(0);
        const savings = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1);
        
        console.log(`   → ${width}w: ${newSize}KB ${savings < 0 ? '' : '(' + savings + '% kleiner)'}`);
      } catch (err) {
        console.error(`   ❌ Error creating ${width}w:`, err.message);
      }
    }
    
    console.log('');
  }
  
  console.log('🎉 Responsive images created!');
}

optimizeImages();
