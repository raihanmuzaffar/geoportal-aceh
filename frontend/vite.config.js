import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg?react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // PASTIKAN BAGIAN INI ADA DAN BENAR
    proxy: {
      '/api': {
        target: 'http://web', // Atau 'http://localhost:8080' jika 'http://web' gagal
        changeOrigin: true,
        secure: false,
      }
    }
  }
})