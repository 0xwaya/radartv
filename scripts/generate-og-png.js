const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgFile = path.join(__dirname, '../public/og-radar.svg');
const pngFile = path.join(__dirname, '../public/og-radar.png');

console.log('🖼️  Converting OG radar SVG to PNG...');

sharp(svgFile)
    .png()
    .toFile(pngFile)
    .then(() => {
        const stats = fs.statSync(pngFile);
        console.log(`✅ PNG generated: ${pngFile} (${(stats.size / 1024).toFixed(1)}KB)`);
    })
    .catch((err) => {
        console.error('❌ Error converting SVG to PNG:', err.message);
        process.exit(1);
    });
