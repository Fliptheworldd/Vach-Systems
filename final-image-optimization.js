const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎯 Final image optimization...\n');

async function optimizeImages() {
  const imagesDir = path.join(__dirname, 'images');
  
  // 1. Re-compress hero-tech.webp with higher compression (quality 75)
  console.log('📸 Optimizing hero-tech.webp...');
  try {
    const heroPath = path.join(imagesDir, 'hero-tech.webp');
    const heroStats = fs.statSync(heroPath);
    
    await sharp(heroPath)
      .webp({ quality: 75, effort: 6 }) // Lower quality, higher effort
      .toFile(path.join(imagesDir, 'hero-tech-optimized.webp'));
    
    const newStats = fs.statSync(path.join(imagesDir, 'hero-tech-optimized.webp'));
    const savings = (((heroStats.size - newStats.size) / heroStats.size) * 100).toFixed(1);
    
    console.log(`   Before: ${(heroStats.size/1024).toFixed(0)}KB`);
    console.log(`   After: ${(newStats.size/1024).toFixed(0)}KB (${savings}% kleiner)`);
    
    // Replace original
    fs.renameSync(
      path.join(imagesDir, 'hero-tech-optimized.webp'),
      path.join(imagesDir, 'hero-tech.webp')
    );
    console.log(`   ✅ Replaced hero-tech.webp\n`);
  } catch (err) {
    console.error('   ❌ Error:', err.message);
  }
  
  // 2. Re-compress hero-tech responsive versions
  const heroSizes = ['600w', '1024w'];
  for (const size of heroSizes) {
    const fileName = `hero-tech-${size}.webp`;
    const filePath = path.join(imagesDir, fileName);
    
    if (!fs.existsSync(filePath)) continue;
    
    try {
      const beforeStats = fs.statSync(filePath);
      await sharp(filePath)
        .webp({ quality: 75, effort: 6 })
        .toFile(path.join(imagesDir, `${fileName}-optimized`));
      
      const afterStats = fs.statSync(path.join(imagesDir, `${fileName}-optimized`));
      const savings = (((beforeStats.size - afterStats.size) / beforeStats.size) * 100).toFixed(1);
      
      console.log(`📸 ${fileName}: ${(beforeStats.size/1024).toFixed(0)}KB → ${(afterStats.size/1024).toFixed(0)}KB (${savings}% kleiner)`);
      
      fs.renameSync(
        path.join(imagesDir, `${fileName}-optimized`),
        filePath
      );
    } catch (err) {
      console.error(`   ❌ Error ${fileName}:`, err.message);
    }
  }
  
  console.log('\n🎉 Optimization complete!');
  console.log('\n📊 Expected Lighthouse improvements:');
  console.log('   ✅ hero-tech.webp: ~30 KB saved');
  console.log('   ✅ Total savings: ~30-40 KB');
}

optimizeImages();
