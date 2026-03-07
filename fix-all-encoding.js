const fs = require('fs');
const path = require('path');

const files = [
    'leistungen.html',
    'loesungen.html',
    'technologie.html',
    'projekte.html',
    'ueber-uns.html',
    'philosophie.html',
    'impressum.html',
    'datenschutz.html'
];

// Comprehensive character fixes
const fixes = [
    // Double-encoded UTF-8
    [/Ã¤/g, 'ä'],
    [/Ã¶/g, 'ö'],
    [/Ã¼/g, 'ü'],
    [/Ã„/g, 'Ä'],
    [/Ã–/g, 'Ö'],
    [/Ãœ/g, 'Ü'],
    [/ÃŸ/g, 'ß'],
    [/Â©/g, '©'],
    [/â/g, '–'],
    
    // Remove BOM and garbage
    [/ï¿½/g, ''],
    [/ï¿/g, ''],
    [/`n/g, '\n'],
    
    // Context-specific fixes (words we know are wrong)
    [/kÖnnte/g, 'könnte'],
    [/könnte/g, 'könnte'],  // in case it's already partially fixed
    [/Überall/g, 'überall'],
    [/überall/g, 'überall'],
    [/spÄt/g, 'spät'],
    [/FrÜhindikatoren/g, 'Frühindikatoren'],
    [/Frühindikatoren/g, 'Frühindikatoren'],
    [/LÖsung/g, 'Lösung'],
    [/Lösung/g, 'Lösung'],
    [/ErstGespräch/g, 'Erstgespräch'],
    [/Erstgespräch/g, 'Erstgespräch'],
    [/GesprÄch/g, 'Gespräch'],
    [/Gespräch/g, 'Gespräch'],
    [/MÖglich/g, 'Möglich'],
    [/Möglich/g, 'Möglich'],
    [/mÖglich/g, 'möglich'],
    [/möglich/g, 'möglich'],
    [/fÜr/g, 'für'],
    [/für/g, 'für'],
    [/natÜrlich/g, 'natürlich'],
    [/natürlich/g, 'natürlich'],
    [/MaÃ/g, 'Maß'],
    [/Maß/g, 'Maß'],
    
    // Character entity fixes
    [/ð§/g, '📧'],
    [/ð/g, '👍'],
    
    // Common pattern: "Ü" before "w=" or "family=" is a "?"
    [/Üw=/g, '?w='],
    [/Üfamily=/g, '?family='],
    [/Üq=/g, '&q='],
    
    // Context-aware "Ü" replacements
    // If "Ü" is at end of question, it's "?"
    [/([a-zA-ZäöüÄÖÜß])Ü$/gm, '$1?'],
    [/([a-zA-ZäöüÄÖÜß])Ü\s/g, '$1? '],
    
    // If "Ü" is between words in a CTA, it's likely "→" or "✓"
    [/Projekt starten Ü/g, 'Projekt starten →'],
    [/Gespräch vereinbaren Ü/g, 'Gespräch vereinbaren →'],
    [/Gespräch starten Ü/g, 'Gespräch starten →'],
    [/Ü Keine /g, '✓ Keine '],
    [/Ü Fixe /g, '✓ Fixe '],
    [/Ü ROI/g, '✓ ROI'],
    [/Ü Unverbindlich/g, '✓ Unverbindlich'],
    [/Ü Direkt/g, '✓ Direkt'],
    [/Ü Konkret/g, '✓ Konkret'],
    
    // Arrow indicators
    [/<div class="scroll-indicator">Ü<\/div>/g, '<div class="scroll-indicator">↓</div>'],
    [/<div class="case-arrow">Ü<\/div>/g, '<div class="case-arrow">→</div>'],
    
    // Title fixes
    [/ â /g, ' – '],
    [/title>([^<]+) â /g, 'title>$1 – '],
    
    // Remaining standalone "Ü" at word boundaries (likely broken umlaut)
    [/([A-ZÄÖÜ])Ü([a-zäöüß])/g, function(match, p1, p2) {
        // Capital letter followed by Ü followed by lowercase - likely Ü should be ü
        return p1 + 'ü' + p2;
    }]
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    
    // Apply all fixes
    fixes.forEach(([pattern, replacement]) => {
        content = content.replace(pattern, replacement);
    });
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    
    const changePercent = ((originalLength - content.length) / originalLength * 100).toFixed(1);
    console.log(`✅ Fixed ${file} (${content.length} bytes, ${changePercent}% change)`);
});

console.log('\n🎉 All files fixed!');
