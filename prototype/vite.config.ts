import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

import { sandboxApiPlugin } from './plugins/sandbox-api-plugin.mjs';

const analyzeBundle = process.env.npm_lifecycle_event === 'bundle:analyze';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sandboxApiPlugin(),
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/@remix-run')
          ) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
          if (id.includes('/src/pages/studio/')) return 'studio-pages';
          if (id.includes('/src/pages/') && !id.includes('/pages/studio/')) {
            return 'public-pages';
          }
        },
      },
    },
  },
});
