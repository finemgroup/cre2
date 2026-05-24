import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

const analyzeBundle = process.env.npm_lifecycle_event === 'bundle:analyze';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    analyzeBundle
      ? visualizer({
          filename: 'dist/bundle-analysis.html',
          gzipSize: true,
          brotliSize: true,
        })
      : undefined,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
