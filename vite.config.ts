import { fileURLToPath, URL } from 'node:url'
import path from 'path'


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
const serverWebuiPath = path.resolve(__dirname, '../NostromoServer/Nostromo.Server/webui')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  base: '/webui/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // Add this line to resolve the '@' alias
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8112',
        changeOrigin: true
      },
      '/swagger': {
        target: 'http://localhost:8112',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: serverWebuiPath,
    emptyOutDir: true,
    assetsDir: 'assets'
  }
})
