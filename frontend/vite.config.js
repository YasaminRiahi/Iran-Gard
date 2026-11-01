import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Automatically find all .html files in the root to include in the build
const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
const input = {};
htmlFiles.forEach(file => {
  const name = file.replace('.html', '');
  input[name] = resolve(__dirname, file);
});

export default defineConfig({
  build: {
    // Puts hashed JS/CSS into an 'assets' folder automatically
    outDir: 'dist',
    rollupOptions: {
      input: input, // dynamic input for index.html, trip.html, etc.
    },
  },
});