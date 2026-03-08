const fs = require('fs');
const path = require('path');

// Read SVG content
const svgContent = fs.readFileSync('logo-large.svg', 'utf8');

// Create HTML files for different sizes that can be screenshot
const sizes = [512, 1024, 2048];

sizes.forEach(size => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            background: transparent;
        }
        img { 
            width: ${size}px; 
            height: ${size}px; 
            display: block;
        }
    </style>
</head>
<body>
    <img src="logo-large.svg" width="${size}" height="${size}">
</body>
</html>`;
    
    fs.writeFileSync(`logo-${size}.html`, html);
});

console.log('✅ HTML Export-Dateien erstellt!');
console.log('');
console.log('📸 So erstellst du PNGs:');
console.log('1. Öffne logo-512.html, logo-1024.html oder logo-2048.html');
console.log('2. Drücke F12 → Console → Gib ein:');
console.log('   Rechtsklick auf die Seite → "Seite als PNG speichern"');
console.log('');
console.log('ODER nutze Windows Snipping Tool:');
console.log('1. Öffne logo-1024.html im Browser');
console.log('2. Drücke Windows + Shift + S');
console.log('3. Schneide das Logo aus');
console.log('4. Einfügen in Paint → Als PNG speichern');
