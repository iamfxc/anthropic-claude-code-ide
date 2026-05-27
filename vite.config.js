import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is set so the bundle works under
// https://<user>.github.io/anthropic-claude-code-ide/
// Override with VITE_BASE=/ for root-domain deploys.
const base = process.env.VITE_BASE ?? '/anthropic-claude-code-ide/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
})
