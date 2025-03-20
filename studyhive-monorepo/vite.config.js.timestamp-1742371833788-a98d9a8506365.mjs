// vite.config.js
import { defineConfig } from "file:///C:/Users/fdora/OneDrive/Documents/IIT%20Documents/SDGP%20GIT/StudyHive_Frontend/studyhive-monorepo/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/fdora/OneDrive/Documents/IIT%20Documents/SDGP%20GIT/StudyHive_Frontend/studyhive-monorepo/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "file:///C:/Users/fdora/OneDrive/Documents/IIT%20Documents/SDGP%20GIT/StudyHive_Frontend/studyhive-monorepo/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///C:/Users/fdora/OneDrive/Documents/IIT%20Documents/SDGP%20GIT/StudyHive_Frontend/studyhive-monorepo/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/fdora/OneDrive/Documents/IIT%20Documents/SDGP%20GIT/StudyHive_Frontend/studyhive-monorepo/vite.config.js";
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  server: {
    port: 3e3
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./packages/shared/src"),
      "@auth": path.resolve(__dirname, "./packages/auth/src"),
      "@home": path.resolve(__dirname, "./packages/home/src"),
      "@landing": path.resolve(__dirname, "./packages/landing/src"),
      "@notesharing": path.resolve(__dirname, "./packages/features/notesharing/src"),
      "@qna": path.resolve(__dirname, "./packages/features/qna/src"),
      "@groupchat": path.resolve(__dirname, "./packages/features/groupchat/src"),
      "@summarizer": path.resolve(__dirname, "./packages/features/summarizer/src"),
      "@quiz": path.resolve(__dirname, "./packages/features/quiz/src"),
      "@chat_bot": path.resolve(__dirname, "./packages/features/chat_bot/src")
    },
    extensions: [".js", ".jsx", ".json"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmZG9yYVxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcSUlUIERvY3VtZW50c1xcXFxTREdQIEdJVFxcXFxTdHVkeUhpdmVfRnJvbnRlbmRcXFxcc3R1ZHloaXZlLW1vbm9yZXBvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxmZG9yYVxcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcSUlUIERvY3VtZW50c1xcXFxTREdQIEdJVFxcXFxTdHVkeUhpdmVfRnJvbnRlbmRcXFxcc3R1ZHloaXZlLW1vbm9yZXBvXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9mZG9yYS9PbmVEcml2ZS9Eb2N1bWVudHMvSUlUJTIwRG9jdW1lbnRzL1NER1AlMjBHSVQvU3R1ZHlIaXZlX0Zyb250ZW5kL3N0dWR5aGl2ZS1tb25vcmVwby92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcclxuXHJcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB0YWlsd2luZGNzcyxcclxuICAgICAgICBhdXRvcHJlZml4ZXIsXHJcbiAgICAgIF0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG4gICAgICAnQHNoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL3NoYXJlZC9zcmMnKSxcclxuICAgICAgJ0BhdXRoJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcGFja2FnZXMvYXV0aC9zcmMnKSxcclxuICAgICAgJ0Bob21lJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcGFja2FnZXMvaG9tZS9zcmMnKSxcclxuICAgICAgJ0BsYW5kaW5nJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcGFja2FnZXMvbGFuZGluZy9zcmMnKSxcclxuICAgICAgJ0Bub3Rlc2hhcmluZyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL2ZlYXR1cmVzL25vdGVzaGFyaW5nL3NyYycpLFxyXG4gICAgICAnQHFuYSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL2ZlYXR1cmVzL3FuYS9zcmMnKSxcclxuICAgICAgJ0Bncm91cGNoYXQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9wYWNrYWdlcy9mZWF0dXJlcy9ncm91cGNoYXQvc3JjJyksXHJcbiAgICAgICdAc3VtbWFyaXplcic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL2ZlYXR1cmVzL3N1bW1hcml6ZXIvc3JjJyksXHJcbiAgICAgICdAcXVpeic6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3BhY2thZ2VzL2ZlYXR1cmVzL3F1aXovc3JjJyksXHJcbiAgICAgICdAY2hhdF9ib3QnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9wYWNrYWdlcy9mZWF0dXJlcy9jaGF0X2JvdC9zcmMnKSxcclxuICAgIH0sXHJcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICcuanN4JywgJy5qc29uJ11cclxuICB9XHJcbn0pOyAiXSwKICAibWFwcGluZ3MiOiAiO0FBQWtlLFNBQVMsb0JBQW9CO0FBQy9mLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFMNFIsSUFBTSwyQ0FBMkM7QUFPdFcsSUFBTSxZQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFFN0QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLE1BQ3BDLFdBQVcsS0FBSyxRQUFRLFdBQVcsdUJBQXVCO0FBQUEsTUFDMUQsU0FBUyxLQUFLLFFBQVEsV0FBVyxxQkFBcUI7QUFBQSxNQUN0RCxTQUFTLEtBQUssUUFBUSxXQUFXLHFCQUFxQjtBQUFBLE1BQ3RELFlBQVksS0FBSyxRQUFRLFdBQVcsd0JBQXdCO0FBQUEsTUFDNUQsZ0JBQWdCLEtBQUssUUFBUSxXQUFXLHFDQUFxQztBQUFBLE1BQzdFLFFBQVEsS0FBSyxRQUFRLFdBQVcsNkJBQTZCO0FBQUEsTUFDN0QsY0FBYyxLQUFLLFFBQVEsV0FBVyxtQ0FBbUM7QUFBQSxNQUN6RSxlQUFlLEtBQUssUUFBUSxXQUFXLG9DQUFvQztBQUFBLE1BQzNFLFNBQVMsS0FBSyxRQUFRLFdBQVcsOEJBQThCO0FBQUEsTUFDL0QsYUFBYSxLQUFLLFFBQVEsV0FBVyxrQ0FBa0M7QUFBQSxJQUN6RTtBQUFBLElBQ0EsWUFBWSxDQUFDLE9BQU8sUUFBUSxPQUFPO0FBQUEsRUFDckM7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
