import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/piston': {
        target: 'https://emkc.org/api/v2/piston',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/piston/, ''),
      },
    },
  },
})
