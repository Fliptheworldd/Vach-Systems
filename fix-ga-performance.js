const fs = require('fs');
const path = require('path');

console.log('⚡ Fixing GA4 Performance Impact...\n');

// NEW: GA4 lädt erst NACH Accept (nicht vorher!)
const newCookieBanner = `
    <!-- Cookie Consent (Performance-optimized) -->
    <div id="cookie-banner" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#000;color:#fff;padding:1rem;z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.3);">
        <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
            <p style="margin:0;font-size:0.9rem;flex:1;min-width:250px;">
                Wir nutzen Google Analytics zur Optimierung. <a href="datenschutz" style="color:#fff;text-decoration:underline;">Datenschutz</a>
            </p>
            <div style="display:flex;gap:0.75rem;flex-shrink:0;">
                <button onclick="acceptCookies()" style="padding:0.6rem 1.5rem;background:#fff;color:#000;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.9rem;">OK</button>
                <button onclick="declineCookies()" style="padding:0.6rem 1.5rem;background:transparent;color:#fff;border:2px solid #fff;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.9rem;">Ablehnen</button>
            </div>
        </div>
    </div>
    <script>
    function loadGA(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=G-6ZZ7BX7SB0';document.head.appendChild(s);s.onload=function(){window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-6ZZ7BX7SB0',{'anonymize_ip':true});}}
    function acceptCookies(){localStorage.setItem('cookieConsent','accepted');document.getElementById('cookie-banner').style.display='none';loadGA();}
    function declineCookies(){localStorage.setItem('cookieConsent','declined');document.getElementById('cookie-banner').style.display='none';}
    if(!localStorage.getItem('cookieConsent')){document.getElementById('cookie-banner').style.display='block';}
    else if(localStorage.getItem('cookieConsent')==='accepted'){loadGA();}
    </script>`;

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
  
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove old GA4 from <head>
  content = content.replace(/<!-- Google Analytics 4[^]*?<\/script>\s*<script>[^]*?<\/script>/g, '');
  
  // Remove old cookie banner
  content = content.replace(/<!-- Cookie Consent[^]*?<\/script>/g, '');
  
  // Add new optimized banner before </body>
  if (!content.includes('cookie-banner')) {
    content = content.replace('</body>', `${newCookieBanner}\n</body>`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${file}`);
  updated++;
}

console.log(`\n🎉 Fixed ${updated} pages!`);
console.log('\n⚡ Performance Improvements:');
console.log('   ✅ GA4 lädt ERST nach User-Accept (nicht vorher!)');
console.log('   ✅ Kein render-blocking mehr');
console.log('   ✅ Async loading (document.createElement)');
console.log('   ✅ Score sollte wieder bei 95+ sein!');
