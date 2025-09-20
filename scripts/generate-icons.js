// Script to generate all icon sizes for PWA
// Run this with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA and Chrome Web Store
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG template for Bitcoin Music logo
const generateSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:white;stop-opacity:0" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="100" cy="100" r="90" fill="url(#bgGrad)" />
  
  <!-- Music note symbol -->
  <g transform="translate(50, 70)">
    <path d="M 10 20 L 10 60 Q 10 70 20 70 Q 30 70 30 60 L 30 20" 
          fill="none" stroke="white" stroke-width="4" />
    <circle cx="10" cy="60" r="8" fill="white" />
    <circle cx="30" cy="60" r="8" fill="white" />
    <path d="M 30 20 L 50 15 L 50 25 L 30 30" fill="white" />
  </g>
  
  <!-- Bitcoin symbol -->
  <text x="130" y="120" font-size="50" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">₿</text>
  
  <!-- Center divider -->
  <rect x="98" y="40" width="4" height="120" fill="white" opacity="0.7" />
  
  <!-- Gloss effect -->
  <ellipse cx="100" cy="60" rx="70" ry="35" fill="url(#glossGrad)" />
</svg>`;

// Note: This is a placeholder - in production, you'd use a proper image processing library
console.log('Icon generation script');
console.log('In a production environment, you would:');
console.log('1. Use Sharp or Canvas to generate PNG files from SVG');
console.log('2. Save them to public/ directory');
console.log('\nRequired icon files:');
sizes.forEach(size => {
  console.log(`- /public/icon-${size}.png (${size}x${size})`);
});

console.log('\nFor Chrome Web Store, you also need:');
console.log('- icon-128.png for store listing');
console.log('- screenshot-1280x800.png for store screenshots');
console.log('- screenshot-640x400.png for small promotional tile');