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
        target: 'http://localhost:5200',
        changeOrigin: true,
        // 如果後端本身路由就是 /api/Auth/login，就不要 rewrite
        // 如果後端是 /Auth/login，就打開下面這行
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
