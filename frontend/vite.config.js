import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          pdf: ['jspdf', 'html2canvas'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
