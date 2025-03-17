import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@landing': path.resolve(__dirname, './packages/landing/src'),
      '@auth': path.resolve(__dirname, './packages/auth/src'),
      '@home': path.resolve(__dirname, './packages/home/src'),
      '@notesharing': path.resolve(__dirname, './packages/features/notesharing/src'),
      '@qna': path.resolve(__dirname, './packages/features/qna/src'),
      '@groupchat': path.resolve(__dirname, './packages/features/groupchat/src'),
      '@summarizer': path.resolve(__dirname, './packages/features/summarizer/src'),
      '@quiz': path.resolve(__dirname, './packages/features/quiz/src'),
      '@chat_bot': path.resolve(__dirname, './packages/features/chat_bot/src'),
      '@shared': path.resolve(__dirname, './packages/shared/src'),
      '@features': path.resolve(__dirname, './packages/features'),
    },
    extensions: ['.js', '.jsx', '.json']
  }
}); 