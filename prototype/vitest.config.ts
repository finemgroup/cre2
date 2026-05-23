import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        thresholds: {
          branches: 45,
          functions: 55,
          lines: 60,
          statements: 60,
        },
      },
    },
  })
);
