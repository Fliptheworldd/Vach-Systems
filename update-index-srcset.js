const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Image replacements with srcset
const replacements = [
  {
    from: /<img src="images\/case-before\.webp" alt="Vor der Automatisierung">/,
    to: `<img srcset="images/case-before-400w.webp 400w, 
                     images/case-before-650w.webp 650w, 
                     images/case-before-1024w.webp 1024w, 
                     images/case-before.webp 1536w"
             sizes="(max-width: 640px) 400px, (max-width: 1024px) 650px, 1024px"
             src="images/case-before.webp" 
             alt="Vor der Automatisierung"
             loading="lazy"
             width="1536"
             height="1024">`
  },
  {
    from: /<img src="images\/case-after\.webp" alt="Nach der Automatisierung">/,
    to: `<img srcset="images/case-after-400w.webp 400w, 
                     images/case-after-650w.webp 650w, 
                     images/case-after-1024w.webp 1024w, 
                     images/case-after.webp 1536w"
             sizes="(max-width: 640px) 400px, (max-width: 1024px) 650px, 1024px"
             src="images/case-after.webp" 
             alt="Nach der Automatisierung"
             loading="lazy"
             width="1536"
             height="1024">`
  },
  {
    from: /<img src="images\/problem-section\.webp"\s+width="700"\s+height="467"\s+alt="Manuelle Arbeitsprozesse">/,
    to: `<img srcset="images/problem-section-400w.webp 400w, 
                     images/problem-section-650w.webp 650w, 
                     images/problem-section-1024w.webp 1024w, 
                     images/problem-section.webp 1536w"
             sizes="(max-width: 640px) 400px, (max-width: 1024px) 650px, 700px"
             src="images/problem-section.webp"
             width="1536"
             height="1024"
             alt="Manuelle Arbeitsprozesse"
             loading="lazy">`
  },
  {
    from: /<img src="images\/solution-section\.webp"\s+width="700"\s+height="467"\s+alt="Modernes Software-Dashboard"[^>]*>/,
    to: `<img srcset="images/solution-section-400w.webp 400w, 
                     images/solution-section-650w.webp 650w, 
                     images/solution-section-1024w.webp 1024w, 
                     images/solution-section.webp 1536w"
             sizes="(max-width: 640px) 400px, (max-width: 1024px) 650px, 700px"
             src="images/solution-section.webp"
             width="1536"
             height="1024"
             alt="Modernes Software-Dashboard"
             loading="lazy"
             style="width: 100%; display: block; height: auto;">`
  },
  {
    from: /<img src="images\/tech-bg\.webp"\s+width="700"\s+height="467"\s+alt="Tech-Stack">/,
    to: `<img srcset="images/tech-bg-400w.webp 400w, 
                     images/tech-bg-650w.webp 650w, 
                     images/tech-bg-1024w.webp 1024w, 
                     images/tech-bg.webp 1536w"
             sizes="(max-width: 640px) 400px, (max-width: 1024px) 650px, 700px"
             src="images/tech-bg.webp"
             width="1536"
             height="1024"
             alt="Tech-Stack"
             loading="lazy">`
  },
  {
    from: /<img srcset="images\/hero-tech-mobile\.webp 600w, images\/hero-tech\.webp 1920w"[^>]*>/,
    to: `<img srcset="images/hero-tech-600w.webp 600w, 
                     images/hero-tech-1024w.webp 1024w, 
                     images/hero-tech.webp 1920w"
             sizes="(max-width: 768px) 600px, (max-width: 1024px) 1024px, 1920px"
             src="images/hero-tech.webp" 
             width="1920"
             height="1280"
             fetchpriority="high"
             alt="Tech Hintergrund">`
  }
];

let changes = 0;

for (const replacement of replacements) {
  if (content.match(replacement.from)) {
    content = content.replace(replacement.from, replacement.to);
    changes++;
    console.log(`✅ Updated: ${replacement.to.match(/alt="([^"]+)"/)?.[1] || 'Image'}`);
  } else {
    console.log(`⚠️  Not found: ${replacement.to.match(/alt="([^"]+)"/)?.[1] || 'Image'}`);
  }
}

if (changes > 0) {
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`\n🎉 Updated ${changes} images with responsive srcset!`);
} else {
  console.log('\n⚠️  No changes made');
}
