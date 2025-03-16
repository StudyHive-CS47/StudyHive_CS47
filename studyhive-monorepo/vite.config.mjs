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
      '@landing': path.resolve(__dirname, './packages/landing'),
      '@auth': path.resolve(__dirname, './packages/auth'),
      '@home': path.resolve(__dirname, './packages/home'),
      '@features': path.resolve(__dirname, './packages/features'),
      '@shared': path.resolve(__dirname, './packages/shared/src'),
      '@chat_bot': path.resolve(__dirname, './packages/features/chat_bot'),
      '@qna': path.resolve(__dirname, './packages/features/qna'),
      '@quiz': path.resolve(__dirname, './packages/features/quiz'),
      '@groupchat': path.resolve(__dirname, './packages/features/groupchat'),
      '@summarizer': path.resolve(__dirname, './packages/features/summarizer'),
      '@notesharing': path.resolve(__dirname, './packages/features/notesharing')
    }
  }
}); 