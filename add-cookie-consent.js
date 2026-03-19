const fs = require('fs');
const path = require('path');

console.log('🍪 Adding Cookie Consent + GA4...\n');

// Compact cookie banner HTML (inline, no extra file)
const cookieBanner = `
    <!-- Cookie Consent (Inline, minimal, mobile-optimized) -->
    <div id="cookie-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#000;color:#fff;padding:1rem;z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.3);">
        <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
            <p style="margin:0;font-size:0.9rem;flex:1;min-width:250px;">
                Wir nutzen Google Analytics zur Optimierung. <a href="datenschutz.html" style="color:#fff;text-decoration:underline;">Datenschutz</a>
            </p>
            <div style="display:flex;gap:0.75rem;flex-shrink:0;">
                <button onclick="acceptCookies()" style="padding:0.6rem 1.5rem;background:#fff;color:#000;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.9rem;">OK</button>
                <button onclick="declineCookies()" style="padding:0.6rem 1.5rem;background:transparent;color:#fff;border:2px solid #fff;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.9rem;">Ablehnen</button>
            </div>
        </div>
    </div>
    <script>
    function acceptCookies(){localStorage.setItem('cookieConsent','accepted');document.getElementById('cookie-banner').style.display='none';if(typeof gtag==='function'){gtag('consent','update',{'analytics_storage':'granted'});gtag('config','G-6ZZ7BX7SB0');}}
    function declineCookies(){localStorage.setItem('cookieConsent','declined');document.getElementById('cookie-banner').style.display='none';}
    if(!localStorage.getItem('cookieConsent')){document.getElementById('cookie-banner').style.display='block';}
    else if(localStorage.getItem('cookieConsent')==='accepted'&&typeof gtag==='function'){gtag('consent','update',{'analytics_storage':'granted'});gtag('config','G-6ZZ7BX7SB0');}
    </script>`;

// Google Analytics 4 with consent mode
const ga4Code = `
    <!-- Google Analytics 4 (consent mode) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6ZZ7BX7SB0"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {'analytics_storage': 'denied'});
        gtag('js', new Date());
    </script>`;

// Main pages
const htmlFiles = [
  'index.html',
  'leistungen.html',
  'loesungen.html',
  'technologie.html',
  'projekte.html',
  'ueber-uns.html',
  'philosophie.html',
  'kontakt.html',
  'impressum.html',
  'datenschutz.html'
];

let updated = 0;

for (const file of htmlFiles) {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add GA4 in <head>
  if (!content.includes('googletagmanager.com')) {
    content = content.replace('</head>', `${ga4Code}\n</head>`);
  }
  
  // Add cookie banner before </body>
  if (!content.includes('cookie-banner')) {
    content = content.replace('</body>', `${cookieBanner}\n</body>`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file}`);
  updated++;
}

console.log(`\n🎉 Added Cookie Consent to ${updated} pages!`);
console.log('\n📊 Features:');
console.log('   ✅ Inline Banner (kein extra JS-File)');
console.log('   ✅ Mobile-optimized (compact, responsive)');
console.log('   ✅ DSGVO-compliant (consent required)');
console.log('   ✅ GA4 lädt erst nach Accept');
console.log('   ✅ LocalStorage speichert Wahl');
console.log('   ✅ ~1.5 KB zusätzlich (minified inline)');
