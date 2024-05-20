import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/', // Adjust base path if necessary
  build: {
    outDir: 'dist',
  },
});
