#!/usr/bin/env node
/**
 * generate_photos_list.js
 *
 * Node.js version of generate_photos_list.sh
 * Used by Vercel Build Command to generate static/image/photos.json at build time.
 * Docker deployments continue to use generate_photos_list.sh at container startup.
 *
 * Usage: node scripts/generate_photos_list.js
 */

const fs = require('fs');
const path = require('path');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

// Resolve paths relative to the project root (where package.json lives)
const projectRoot = path.resolve(__dirname, '..');
const targetDir = path.join(projectRoot, 'static', 'image');
const outputFile = path.join(targetDir, 'photos.json');

console.log(`Scanning directory: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
    console.error(`Error: Directory ${targetDir} does not exist.`);
    process.exit(1);
}

// Read directory, filter image files only (exclude subdirectories and photos.json)
const entries = fs.readdirSync(targetDir, { withFileTypes: true });

const imageFiles = entries
    .filter(entry => {
        if (!entry.isFile()) return false;
        const ext = path.extname(entry.name).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
    })
    .map(entry => entry.name)
    .sort(); // Sort for consistent output

// Write JSON
const json = JSON.stringify(imageFiles, null, 2);
fs.writeFileSync(outputFile, json, 'utf-8');

console.log(`Done. Generated photos.json with ${imageFiles.length} images.`);
console.log(`Location: ${outputFile}`);
