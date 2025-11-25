import path from 'path';
import { defineConfig } from 'vite';
import React from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [React(), UnoCSS()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    proxy: {
      '^/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:5200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
