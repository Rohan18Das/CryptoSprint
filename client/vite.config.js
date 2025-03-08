import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import dotenv from 'dotenv';
// import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true, // Whether to polyfill `Buffer`
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer/', // Alias for using the Buffer module
    },
  },
  define: {
    global: 'globalThis', // Polyfill for globalThis
  },
  // envDir: path.resolve(__dirname, '../'), // Point Vite to look for .env in the parent directory
  server: {
    host: true, // Enable hosting on the local network
    proxy: {
      '/api': {
         target:process.env.VITE_API_URL|| 'http://localhost:3001',
        changeOrigin: true,
        secure: true,
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        },
      },
    },
  },
});
