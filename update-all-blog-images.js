#!/usr/bin/env node
/**
 * Update ALL blog images (articles + index)
 */

const fs = require('fs').promises;
const path = require('path');

async function updateArticleImage(articlePath, image600w, image1400w) {
    let html = await fs.readFile(articlePath, 'utf-8');
    
    const imgTag = `        <img srcset="../images/blog/${image600w} 600w, ../images/blog/${image1400w} 1400w" 
             sizes="(max-width: 768px) 600px, 1400px"
             src="../images/blog/${image1400w}" 
             alt="Blog Header" 
             class="article-image"
             loading="lazy"
             width="1400"
             height="933">`;
    
    const imgRegex = /<img[^>]*class="article-image"[^>]*>/;
    
    if (imgRegex.test(html)) {
        html = html.replace(imgRegex, imgTag);
    } else {
        const headerEndRegex = /<\/header>/;
        if (headerEndRegex.test(html)) {
            html = html.replace(headerEndRegex, `</header>\n\n${imgTag}`);
        }
    }
    
    await fs.writeFile(articlePath, html, 'utf-8');
    return true;
}

async function updateBlogIndex(mapping) {
    const indexPath = path.join(__dirname, 'blog', 'index.html');
    let html = await fs.readFile(indexPath, 'utf-8');
    
    const urlToFilename = {};
    for (const filename of Object.keys(mapping)) {
        const url = filename.replace('.html', '');
        urlToFilename[url] = filename;
    }
    
    const articleCardRegex = /<a href="([^"]+)" class="article-card"><img src="([^"]+)"/g;
    
    html = html.replace(articleCardRegex, (match, url, oldImagePath) => {
        const cleanUrl = url.replace('../', '').replace('.html', '');
        const filename = urlToFilename[cleanUrl];
        
        if (filename && mapping[filename]) {
            const newImage = mapping[filename].image600w;
            const newPath = `../images/blog/${newImage}`;
            return `<a href="${url}" class="article-card"><img src="${newPath}"`;
        }
        return match;
    });
    
    await fs.writeFile(indexPath, html, 'utf-8');
}

async function main() {
    console.log('🔧 Update ALL Blog Images\n');
    console.log('━'.repeat(80) + '\n');
    
    const mappingPath = path.join(__dirname, 'blog-images-mapping-final.json');
    const mapping = JSON.parse(await fs.readFile(mappingPath, 'utf-8'));
    
    console.log(`📋 Mapping geladen: ${Object.keys(mapping).length} Artikel\n`);
    
    let articlesUpdated = 0;
    
    // Update einzelne Artikel
    console.log('📝 Aktualisiere einzelne Blog-Artikel...\n');
    for (const [articleFile, data] of Object.entries(mapping)) {
        const articlePath = path.join(__dirname, 'blog', articleFile);
        await updateArticleImage(articlePath, data.image600w, data.image1400w);
        console.log(`  ✓ ${articleFile.substring(0, 50)}...`);
        articlesUpdated++;
    }
    
    // Update Blog-Index
    console.log('\n📋 Aktualisiere Blog-Übersicht...\n');
    await updateBlogIndex(mapping);
    console.log('  ✓ blog/index.html');
    
    console.log('\n' + '━'.repeat(80));
    console.log(`\n✅ FERTIG! ${articlesUpdated} Artikel + Übersicht aktualisiert.\n`);
}

main().catch(console.error);
