const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dirs = ['images', 'assets', 'img'];

async function convertToWebP() {
  for (const dir of dirs) {
    const dirPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  ${dir}/ not found, skipping...`);
      continue;
    }

    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg)$/i)) {
        const inputPath = path.join(dirPath, file);
        const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        
        try {
          const stats = fs.statSync(inputPath);
          const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
          
          await sharp(inputPath)
            .webp({ quality: 85 }) // 85% quality = good balance
            .toFile(outputPath);
          
          const newStats = fs.statSync(outputPath);
          const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
          const savings = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);
          
          console.log(`✅ ${file} → ${path.basename(outputPath)}`);
          console.log(`   ${sizeMB} MB → ${newSizeMB} MB (${savings}% kleiner)`);
        } catch (err) {
          console.error(`❌ Error converting ${file}:`, err.message);
        }
      }
    }
  }
  
  console.log('\n🎉 Conversion complete! Now update your HTML files to use .webp');
}

convertToWebP();
