const fs = require('fs');

const files = [
  'index.html',
  'loesungen.html',
  'ueber-uns.html',
  'leistungen.html',
  'technologie.html',
  'projekte.html',
  'philosophie.html'
];

const mailtoLink = 'mailto:contact@vachsystems.de?subject=Kontaktanfrage%20von%20Website&body=Hallo%20Vach%20Systems%20Team%2C%0A%0AIch%20interessiere%20mich%20f%C3%BCr%20Ihre%20Dienstleistungen.%0A%0AMein%20Name%3A%20%0AMein%20Unternehmen%3A%20%0ATelefon%3A%20%0A%0AMeine%20Nachricht%3A%0A';

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace all CTA buttons with mailto links
  // Pattern 1: Gespräch vereinbaren
  content = content.replace(
    /<a href="kontakt\.html" class="btn-cta-large">Gespräch vereinbaren →<\/a>/g,
    `<a href="${mailtoLink}" class="btn-cta-large">Kontakt aufnehmen →</a>`
  );
  
  // Pattern 2: Projekt starten
  content = content.replace(
    /<a href="kontakt\.html" class="btn-hero-primary">Projekt starten<\/a>/g,
    `<a href="${mailtoLink}" class="btn-hero-primary">Kontakt aufnehmen</a>`
  );
  
  // Pattern 3: DON'T change nav CTA - keep it as kontakt.html
  // (users can still use the form on desktop)
  
  // Pattern 4: Kontakt aufnehmen buttons (ueber-uns.html)
  content = content.replace(
    /<a href="kontakt\.html" style="display: inline-block; padding: 1\.25rem 3rem[^>]+>Kontakt aufnehmen →<\/a>/g,
    `<a href="${mailtoLink}" style="display: inline-block; padding: 1.25rem 3rem; background: var(--black); color: white; text-decoration: none; border-radius: 12px; font-size: 1.125rem; font-weight: 700; transition: transform 0.2s;">Kontakt aufnehmen →</a>`
  );
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ ${file}`);
});

console.log('\n🎉 All CTA buttons now open email app!');
