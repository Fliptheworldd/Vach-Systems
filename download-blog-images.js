const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Unique Unsplash image IDs from blog
const images = [
  'photo-1450101499163-c8848c66ca85',
  'photo-1460925895917-afdab827c52f',
  'photo-1486312338219-ce68d2c6f44d',
  'photo-1531482615713-2afd69097998',
  'photo-1531746790731-6c087fecd65a',
  'photo-1551288049-bebda4e38f71',
  'photo-1553413077-190dd305871c',
  'photo-1554224154-26032ffc0d07',
  'photo-1554224155-8d04cb21cd6c',
  'photo-1556742502-ec7c0e9f34b1',
  'photo-1556761175-b413da4baf72',
  'photo-1558346490-a72e53ae2d4f',
  'photo-1558494949-ef010cbdcc31',
  'photo-1586528116311-ad8dd3c8310d',
  'photo-1589829545856-d10d557cf95f',
  'photo-1633356122544-f134324a6cee'
];

const outputDir = path.join(__dirname, 'images', 'blog');

// Create blog images directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function processImages() {
  for (const imageId of images) {
    const filename = imageId.replace('photo-', '');
    const jpgPath = path.join(outputDir, `${filename}.jpg`);
    const webpPath = path.join(outputDir, `${filename}.webp`);
    
    try {
      // Download JPG from Unsplash (w=1400 for blog hero images)
      console.log(`📥 Downloading ${filename}...`);
      await downloadImage(
        `https://images.unsplash.com/${imageId}?w=1400&q=80`,
        jpgPath
      );
      
      // Convert to WebP
      const jpgStats = fs.statSync(jpgPath);
      await sharp(jpgPath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      const webpStats = fs.statSync(webpPath);
      const savings = (((jpgStats.size - webpStats.size) / jpgStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${filename}: ${(jpgStats.size/1024).toFixed(0)}KB → ${(webpStats.size/1024).toFixed(0)}KB (${savings}% kleiner)`);
      
      // Delete JPG (we only need WebP)
      fs.unlinkSync(jpgPath);
      
    } catch (err) {
      console.error(`❌ Error processing ${filename}:`, err.message);
    }
  }
  
  console.log('\n🎉 All blog images converted to WebP!');
}

processImages();
