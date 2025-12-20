import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: process.env.PORT || 5173,
    strictPort: true,
    allowedHosts: [
      '.railway.app',
      '.up.railway.app',
      'localhost',
      '127.0.0.1'
    ],
  },
})
