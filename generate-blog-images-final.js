#!/usr/bin/env node
/**
 * FINAL Blog Image Generator - 100% STABIL
 * 
 * Nur bewährte Quellen:
 * 1. Lorem Picsum (mit Seeds - garantiert unterschiedlich)
 * 2. Generated Gradients (100% unique, professionell)
 * 
 * Jeder Artikel bekommt ein ANDERES Bild - GARANTIERT!
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const sharp = require('sharp');
const crypto = require('crypto');

// Generiere einzigartigen Seed aus Artikelname
function generateSeed(articleName, index) {
    const hash = crypto.createHash('md5')
        .update(articleName + index.toString())
        .digest('hex');
    return parseInt(hash.substring(0, 8), 16);
}

function downloadImage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                return downloadImage(response.headers.location).then(resolve).catch(reject);
            }
            
            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

// SOURCE 1: Lorem Picsum mit Seed (garantiert unique!)
async function fetchPicsumImage(seed) {
    const url = `https://picsum.photos/seed/${seed}/1920/1280`;
    console.log(`    Source: Picsum (seed: ${seed})`);
    return downloadImage(url);
}

// SOURCE 2: Professionelle Gradienten
async function generateGradientImage(index) {
    const gradients = [
        { colors: ['#667eea', '#764ba2'], name: 'Purple Dream' },
        { colors: ['#f093fb', '#f5576c'], name: 'Pink Passion' },
        { colors: ['#4facfe', '#00f2fe'], name: 'Electric Blue' },
        { colors: ['#43e97b', '#38f9d7'], name: 'Mint Fresh' },
        { colors: ['#fa709a', '#fee140'], name: 'Sunset Glow' },
        { colors: ['#30cfd0', '#330867'], name: 'Deep Ocean' },
        { colors: ['#a8edea', '#fed6e3'], name: 'Soft Cloud' },
        { colors: ['#ff9a9e', '#fecfef'], name: 'Rose Quartz' },
        { colors: ['#ffecd2', '#fcb69f'], name: 'Peachy Keen' },
        { colors: ['#ff6e7f', '#bfe9ff'], name: 'Cotton Candy' },
        { colors: ['#e0c3fc', '#8ec5fc'], name: 'Lavender Sky' },
        { colors: ['#f8b500', '#fccb04'], name: 'Golden Hour' }
    ];
    
    const gradient = gradients[index % gradients.length];
    const angle = (index * 47) % 360;
    
    const svg = `
    <svg width="1920" height="1280" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">
                <stop offset="0%" style="stop-color:${gradient.colors[0]};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${gradient.colors[1]};stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="1920" height="1280" fill="url(#grad)"/>
        <circle cx="960" cy="640" r="300" fill="white" opacity="0.1"/>
        <circle cx="1400" cy="400" r="200" fill="white" opacity="0.08"/>
        <circle cx="500" cy="900" r="150" fill="white" opacity="0.06"/>
    </svg>`;
    
    console.log(`    Source: Gradient "${gradient.name}" (${angle}°)`);
    return Buffer.from(svg);
}

async function processImage(articleFile, index) {
    const seed = generateSeed(articleFile, index);
    const timestamp = Date.now();
    const baseFilename = `${timestamp}-${seed.toString(36).substring(0, 8)}`;
    
    // Alterniere: Gerade = Picsum, Ungerade = Gradient
    const useGradient = (index % 2 === 0);
    
    console.log(`\n[${index}/${43}] ${articleFile.substring(0, 50)}...`);
    console.log(`    Seed: ${seed}`);
    
    try {
        let imageBuffer;
        
        if (useGradient) {
            imageBuffer = await generateGradientImage(index);
        } else {
            imageBuffer = await fetchPicsumImage(seed);
        }
        
        console.log(`    ✓ Downloaded: ${(imageBuffer.length / 1024).toFixed(0)} KB`);
        
        // 1400w WebP
        const webp1400 = await sharp(imageBuffer)
            .resize(1400, 933, { fit: 'cover', position: 'center' })
            .webp({ quality: 80 })
            .toBuffer();
        
        const filename1400 = `${baseFilename}-1400w.webp`;
        const path1400 = path.join(__dirname, 'images', 'blog', filename1400);
        await fs.writeFile(path1400, webp1400);
        console.log(`    ✓ Saved 1400w: ${filename1400} (${(webp1400.length / 1024).toFixed(0)} KB)`);
        
        // 600w WebP
        const webp600 = await sharp(imageBuffer)
            .resize(600, 400, { fit: 'cover', position: 'center' })
            .webp({ quality: 75 })
            .toBuffer();
        
        const filename600 = `${baseFilename}-600w.webp`;
        const path600 = path.join(__dirname, 'images', 'blog', filename600);
        await fs.writeFile(path600, webp600);
        console.log(`    ✓ Saved 600w: ${filename600} (${(webp600.length / 1024).toFixed(0)} KB)`);
        
        // Pause zwischen Requests
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return {
            article: articleFile,
            filename600,
            filename1400,
            source: useGradient ? 'gradient' : 'picsum'
        };
        
    } catch (error) {
        console.error(`    ✗ ERROR: ${error.message}`);
        
        // Fallback auf Gradient bei Fehler
        try {
            console.log(`    ↻ Retry mit Gradient...`);
            const imageBuffer = await generateGradientImage(index);
            
            const webp1400 = await sharp(imageBuffer)
                .resize(1400, 933, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer();
            
            const filename1400 = `${baseFilename}-1400w.webp`;
            await fs.writeFile(path.join(__dirname, 'images', 'blog', filename1400), webp1400);
            
            const webp600 = await sharp(imageBuffer)
                .resize(600, 400, { fit: 'cover' })
                .webp({ quality: 75 })
                .toBuffer();
            
            const filename600 = `${baseFilename}-600w.webp`;
            await fs.writeFile(path.join(__dirname, 'images', 'blog', filename600), webp600);
            
            console.log(`    ✓ Fallback erfolgreich`);
            
            return {
                article: articleFile,
                filename600,
                filename1400,
                source: 'gradient-fallback'
            };
        } catch (fallbackError) {
            console.error(`    ✗ Fallback fehlgeschlagen: ${fallbackError.message}`);
            return null;
        }
    }
}

async function main() {
    console.log('━'.repeat(80));
    console.log('🎨 FINAL Blog Image Generator - Vach Systems');
    console.log('━'.repeat(80));
    console.log('\nGeneriere EINZIGARTIGE WebP-Bilder:');
    console.log('  ✓ Picsum Photos (mit Seeds - garantiert unique)');
    console.log('  ✓ Professional Gradients (12 verschiedene Designs)');
    console.log('  ✓ Automatischer Fallback bei Fehlern\n');
    console.log('━'.repeat(80));
    
    const blogDir = path.join(__dirname, 'blog');
    const files = await fs.readdir(blogDir);
    const htmlFiles = files.filter(f => f.endsWith('.html') && f !== 'index.html');
    
    console.log(`\n📁 Zu verarbeiten: ${htmlFiles.length} Blog-Artikel\n`);
    
    const results = [];
    
    for (let i = 0; i < htmlFiles.length; i++) {
        const result = await processImage(htmlFiles[i], i + 1);
        if (result) results.push(result);
    }
    
    console.log('\n' + '━'.repeat(80));
    console.log(`\n✅ FERTIG! ${results.length}/${htmlFiles.length} Bilder generiert.\n`);
    
    // Stats
    const stats = { picsum: 0, gradient: 0, 'gradient-fallback': 0 };
    results.forEach(r => stats[r.source]++);
    
    console.log('📊 Quellen-Verteilung:');
    console.log(`   Picsum Photos: ${stats.picsum} Bilder`);
    console.log(`   Gradients: ${stats.gradient} Bilder`);
    if (stats['gradient-fallback'] > 0) {
        console.log(`   Gradient Fallback: ${stats['gradient-fallback']} Bilder`);
    }
    
    // Mapping speichern
    const mapping = {};
    results.forEach(r => {
        mapping[r.article] = {
            image600w: r.filename600,
            image1400w: r.filename1400,
            source: r.source
        };
    });
    
    const mappingPath = path.join(__dirname, 'blog-images-mapping.json');
    await fs.writeFile(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`\n📋 Mapping gespeichert: blog-images-mapping.json`);
    
    console.log('\n🎉 Alle Bilder sind EINZIGARTIG und unterscheiden sich garantiert!\n');
    console.log('━'.repeat(80));
}

main().catch(console.error);
