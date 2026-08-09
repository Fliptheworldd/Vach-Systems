#!/usr/bin/env node
/**
 * Fix article layout - move image inside header
 */

const fs = require('fs').promises;
const path = require('path');

async function fixArticle(articlePath) {
    let html = await fs.readFile(articlePath, 'utf-8');
    
    // Find image tag after </header>
    const pattern = /(<\/header>)\s*(<img[^>]*class="article-image"[^>]*>)/;
    
    if (pattern.test(html)) {
        // Move image BEFORE </header>
        html = html.replace(pattern, '$2\n        $1');
        await fs.writeFile(articlePath, html, 'utf-8');
        return true;
    }
    
    return false;
}

async function main() {
    console.log('🔧 Fix Article Layout\n');
    
    const blogDir = path.join(__dirname, 'blog');
    const files = await fs.readdir(blogDir);
    const htmlFiles = files.filter(f => f.endsWith('.html') && f !== 'index.html');
    
    let fixed = 0;
    
    for (const file of htmlFiles) {
        const articlePath = path.join(blogDir, file);
        const wasFixed = await fixArticle(articlePath);
        if (wasFixed) {
            console.log(`✓ ${file}`);
            fixed++;
        }
    }
    
    console.log(`\n✅ ${fixed} Artikel gefixt!\n`);
}

main().catch(console.error);
