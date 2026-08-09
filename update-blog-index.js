#!/usr/bin/env node
/**
 * Update Blog Index with correct image paths
 */

const fs = require('fs').promises;
const path = require('path');

async function main() {
    console.log('🔧 Blog Index Updater\n');
    
    // Lade Mapping
    const mappingPath = path.join(__dirname, 'blog-images-mapping.json');
    const mapping = JSON.parse(await fs.readFile(mappingPath, 'utf-8'));
    
    // Lade index.html
    const indexPath = path.join(__dirname, 'blog', 'index.html');
    let html = await fs.readFile(indexPath, 'utf-8');
    
    console.log('📋 Mapping geladen: ' + Object.keys(mapping).length + ' Artikel');
    console.log('📄 Blog Index geladen\n');
    console.log('━'.repeat(80) + '\n');
    
    let updated = 0;
    
    // Erstelle URL → Filename Mapping
    const urlToFilename = {};
    for (const filename of Object.keys(mapping)) {
        const url = filename.replace('.html', '');
        urlToFilename[url] = filename;
    }
    
    // Finde alle Bild-Tags in article-cards
    const articleCardRegex = /<a href="([^"]+)" class="article-card"><img src="([^"]+)"/g;
    
    html = html.replace(articleCardRegex, (match, url, oldImagePath) => {
        const cleanUrl = url.replace('../', '').replace('.html', '');
        const filename = urlToFilename[cleanUrl];
        
        if (filename && mapping[filename]) {
            const newImage = mapping[filename].image600w;
            const newPath = `../images/blog/${newImage}`;
            
            console.log(`✓ ${cleanUrl}`);
            console.log(`  ${oldImagePath} → ${newPath}\n`);
            
            updated++;
            return `<a href="${url}" class="article-card"><img src="${newPath}"`;
        } else {
            console.log(`⚠ Kein Mapping für: ${cleanUrl}\n`);
            return match;
        }
    });
    
    // Speichere aktualisierte index.html
    await fs.writeFile(indexPath, html, 'utf-8');
    
    console.log('━'.repeat(80));
    console.log(`\n✅ Fertig! ${updated} Bilder in Blog-Übersicht aktualisiert.\n`);
}

main().catch(console.error);
