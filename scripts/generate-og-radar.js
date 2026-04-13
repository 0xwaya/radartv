const { createCanvas } = require('canvas');
const GifEncoder = require('gif-encoder');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;
const FRAMES = 40;
const DELAY = 50; // ms per frame

const gif = new GifEncoder(WIDTH, HEIGHT);
const publicDir = path.join(__dirname, '../public');

console.log('🎬 Generating animated radar OG image...');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const file = fs.createWriteStream(path.join(publicDir, 'og-radar.gif'));
gif.pipe(file);

gif.writeHeader();

for (let frame = 0; frame < FRAMES; frame++) {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Dark background
    ctx.fillStyle = '#07111f';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Radial gradient background
    const gradient = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 100, WIDTH / 2, HEIGHT / 2, 400);
    gradient.addColorStop(0, 'rgba(114, 212, 232, 0.12)');
    gradient.addColorStop(1, 'rgba(7, 17, 31, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grid overlay
    ctx.strokeStyle = 'rgba(180, 205, 242, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    for (let x = 0; x < WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }

    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    const maxRadius = 180;

    // Concentric circles
    ctx.strokeStyle = 'rgba(114, 212, 232, 0.4)';
    ctx.lineWidth = 1.5;
    for (let r = 60; r <= maxRadius; r += 60) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(114, 212, 232, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadius * 1.2, centerY);
    ctx.lineTo(centerX + maxRadius * 1.2, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - maxRadius * 1.2);
    ctx.lineTo(centerX, centerY + maxRadius * 1.2);
    ctx.stroke();

    // Sweep line (rotating)
    const angle = (frame / FRAMES) * Math.PI * 2;
    ctx.strokeStyle = 'rgba(114, 212, 232, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + Math.cos(angle - Math.PI / 2) * maxRadius,
        centerY + Math.sin(angle - Math.PI / 2) * maxRadius
    );
    ctx.stroke();

    // Sweep glow/trail effect
    const trailGradient = ctx.createLinearGradient(
        centerX,
        centerY,
        centerX + Math.cos(angle - Math.PI / 2) * maxRadius,
        centerY + Math.sin(angle - Math.PI / 2) * maxRadius
    );
    trailGradient.addColorStop(0, 'rgba(114, 212, 232, 0.06)');
    trailGradient.addColorStop(1, 'rgba(114, 212, 232, 0.2)');
    ctx.fillStyle = trailGradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const sweepRadius = maxRadius;
    for (let a = angle - Math.PI / 8; a <= angle; a += 0.05) {
        const x = centerX + Math.cos(a - Math.PI / 2) * sweepRadius;
        const y = centerY + Math.sin(a - Math.PI / 2) * sweepRadius;
        if (a === angle - Math.PI / 8) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Center blip
    ctx.fillStyle = '#e3b36a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Distant blip
    const blipAngle = angle + Math.PI / 6;
    const blipDist = maxRadius * 0.6;
    ctx.fillStyle = 'rgba(227, 179, 106, 0.7)';
    ctx.beginPath();
    ctx.arc(
        centerX + Math.cos(blipAngle - Math.PI / 2) * blipDist,
        centerY + Math.sin(blipAngle - Math.PI / 2) * blipDist,
        3,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Text overlay
    ctx.fillStyle = 'rgba(245, 241, 232, 0.9)';
    ctx.font = 'bold 72px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('El Radar TV', WIDTH / 2, HEIGHT / 2 - 120);

    ctx.fillStyle = 'rgba(114, 212, 232, 0.8)';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('Portal Oficial · Chile', WIDTH / 2, HEIGHT / 2 + 80);

    gif.addFrame(canvas);
    process.stdout.write(`\r  Frame ${frame + 1}/${FRAMES}`);
}

console.log('\n✅ OG radar GIF generated: public/og-radar.gif');

gif.writeFooter();
file.on('finish', () => {
    console.log('📸 Animation complete and saved!');
});
