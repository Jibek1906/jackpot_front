import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],

  clearScreen: false,
  server: {
    port: 1420,
    proxy: {
      // Проксируем авторизацию
      '/staff': {
        target: 'https://jackpot.operator.kg',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost', // КРИТИЧЕСКИ ВАЖНО: переписываем домен куки
      },
      // Проксируем само API
      '/api': {
        target: 'https://jackpot.operator.kg',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        dealer: resolve(__dirname, 'dealer.html'),
        tv: resolve(__dirname, 'tv.html'),
      },
    },
  },
}));
