import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './packages/shared/src'),
      '@auth': path.resolve(__dirname, './packages/auth/src'),
      '@home': path.resolve(__dirname, './packages/home/src'),
      '@landing': path.resolve(__dirname, './packages/landing/src'),
      '@notesharing': path.resolve(__dirname, './packages/features/notesharing/src'),
      '@qna': path.resolve(__dirname, './packages/features/qna/src'),
      '@groupchat': path.resolve(__dirname, './packages/features/groupchat/src'),
      '@summarizer': path.resolve(__dirname, './packages/features/summarizer/src'),
      '@quiz': path.resolve(__dirname, './packages/features/quiz/src'),
      '@chat_bot': path.resolve(__dirname, './packages/features/chat_bot/src'),
      '@userprofile': path.resolve(__dirname, './packages/userprofile/src'),
      'contexts': path.resolve(__dirname, './packages/shared/src/contexts'),
      'config': path.resolve(__dirname, './packages/shared/src/config')
    },
    extensions: ['.js', '.jsx', '.json']
  }
}); 