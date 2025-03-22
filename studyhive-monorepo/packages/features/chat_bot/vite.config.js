import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_AZURE_ENDPOINT': JSON.stringify(env.VITE_AZURE_ENDPOINT),
      'process.env.VITE_AZURE_API_KEY': JSON.stringify(env.VITE_AZURE_API_KEY)
    }
  }
})
