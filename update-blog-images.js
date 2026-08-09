#!/usr/bin/env node
/**
 * Blog Image Updater für Vach Systems
 * 
 * Fügt die generierten WebP-Bilder automatisch in die Blog-Artikel ein
 */

const fs = require('fs').promises;
const path = require('path');

async function updateArticleImage(articlePath, image600w, image1400w, articleTitle) {
    let html = await fs.readFile(articlePath, 'utf-8');
    
    // Generiere alt-text aus Artikel-Titel
    const altText = articleTitle || path.basename(articlePath, '.html')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    
    // Bild-Tag Template
    const imgTag = `        <img srcset="../images/blog/${image600w} 600w, ../images/blog/${image1400w} 1400w" 
             sizes="(max-width: 768px) 600px, 1400px"
             src="../images/blog/${image1400w}" 
             alt="${altText}" 
             class="article-image"
             loading="lazy"
             width="1400"
             height="933">`;
    
    // Suche nach existierendem Bild-Tag
    const imgRegex = /<img[^>]*class="article-image"[^>]*>/;
    
    if (imgRegex.test(html)) {
        // Ersetze existierendes Bild
        html = html.replace(imgRegex, imgTag);
        console.log(`    ✓ Bild ersetzt`);
    } else {
        // Füge Bild nach </header> ein
        const headerEndRegex = /<\/header>/;
        if (headerEndRegex.test(html)) {
            html = html.replace(headerEndRegex, `</header>\n\n${imgTag}`);
            console.log(`    ✓ Bild eingefügt`);
        } else {
            console.log(`    ✗ Konnte Einfügepunkt nicht finden`);
            return false;
        }
    }
    
    // Speichere aktualisierte Datei
    await fs.writeFile(articlePath, html, 'utf-8');
    return true;
}

async function main() {
    console.log('🔧 Blog Image Updater - Vach Systems\n');
    
    // Lade Mapping
    const mappingPath = path.join(__dirname, 'blog-images-mapping.json');
    const mapping = JSON.parse(await fs.readFile(mappingPath, 'utf-8'));
    
    console.log(`📋 Mapping geladen: ${Object.keys(mapping).length} Artikel\n`);
    console.log('━'.repeat(80));
    
    let updated = 0;
    
    for (const [articleFile, data] of Object.entries(mapping)) {
        const articlePath = path.join(__dirname, 'blog', articleFile);
        console.log(`\n${articleFile}`);
        console.log(`    600w: ${data.image600w}`);
        console.log(`    1400w: ${data.image1400w}`);
        
        const success = await updateArticleImage(
            articlePath,
            data.image600w,
            data.image1400w,
            null // Alt-text wird aus Dateinamen generiert
        );
        
        if (success) updated++;
    }
    
    console.log('\n' + '━'.repeat(80));
    console.log(`\n✅ Fertig! ${updated} Artikel aktualisiert.\n`);
}

main().catch(console.error);
