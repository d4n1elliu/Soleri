import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Use `vercel dev` for local development — it serves both this app and api/ functions together
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
