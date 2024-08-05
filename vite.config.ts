/// <reference types="vitest" />
import { join, resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// @ts-ignore
import { peerDependencies } from './package.json';
import * as path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://mock.alphal.cn:9526/mock/6697261f88d70100625a837d',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    /** 路径别名 */
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
  plugins: [
    react(),
    dts({ rollupTypes: true }), // Output .d.ts files
  ],
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: resolve(__dirname, join('lib', 'index.ts')),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Exclude peer dependencies from the bundle to reduce bundle size
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './lib/test/setup.ts',
    coverage: {
      all: false,
      enabled: true,
      provider: 'v8',
    },
  },
});
