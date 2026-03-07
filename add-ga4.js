const fs = require('fs');

const files = [
  'index.html',
  'kontakt.html',
  'loesungen.html',
  'impressum.html',
  'datenschutz.html',
  'ueber-uns.html',
  'leistungen.html',
  'technologie.html',
  'projekte.html',
  'philosophie.html'
];

const ga4Script = `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6ZZ7BX7SB0"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        
        // Default: Analytics disabled until consent
        gtag('consent', 'default', {
            'analytics_storage': 'denied'
        });
        
        gtag('js', new Date());
        gtag('config', 'G-6ZZ7BX7SB0', {
            'anonymize_ip': true
        });
        
        // Enable analytics if cookie consent given
        if(localStorage.getItem('cookieConsent') === 'accepted') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    </script>
`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Insert GA4 script before closing </head>
  if (!content.includes('googletagmanager.com')) {
    content = content.replace('</head>', ga4Script + '\n</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}`);
  } else {
    console.log(`⏭️  ${file} (already has GA4)`);
  }
});

console.log('\n🎉 Google Analytics 4 added to all pages!');
