const fs = require('fs');
const path = require('path');

const files = [
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

const fixes = [
  // URLs: Ü → ?
  [/Üfamily=/g, '?family='],
  [/Üw=/g, '?w='],
  [/Üq=/g, '&q='],
  
  // German umlauts that were broken
  [/fÜr/g, 'für'],
  [/LÖsungen/g, 'Lösungen'],
  [/lÖsungen/g, 'lösungen'],
  [/GesprÄch/g, 'Gespräch'],
  [/gesprÄch/g, 'gespräch'],
  [/MÖglichkeiten/g, 'Möglichkeiten'],
  [/mÖglich/g, 'möglich'],
  [/natÜrlich/g, 'natürlich'],
  [/GrÖße/g, 'Größe'],
  [/grÖßer/g, 'größer'],
  [/AusfÜhrung/g, 'Ausführung'],
  [/PrÜfung/g, 'Prüfung'],
  [/QualitÄt/g, 'Qualität'],
  [/FÄhigkeit/g, 'Fähigkeit'],
  [/TÜr/g, 'Tür'],
  [/SchÖn/g, 'Schön'],
  [/KÜnstlich/g, 'Künstlich'],
  [/natÜrlich/g, 'natürlich'],
  [/erklÄren/g, 'erklären'],
  [/VerfÜgung/g, 'Verfügung'],
  [/UnterstÜtzung/g, 'Unterstützung'],
  [/DurchfÜhrung/g, 'Durchführung'],
  [/EinfÜhrung/g, 'Einführung']
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} not found, skipping`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Apply all fixes
  fixes.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
});

console.log('\n🎉 All files fixed!');
