import { resolve } from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig, defaultExclude } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...defaultExclude, '**/dist/**'],
    globals: true,
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
