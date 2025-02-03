import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import fs from 'fs';

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the path to the backend's webui directory
const serverWebuiPath = path.resolve(__dirname, '../NostromoServer/Nostromo.Server/webui');

// Ensure the output directory exists
if (!fs.existsSync(serverWebuiPath)) {
  fs.mkdirSync(serverWebuiPath, { recursive: true });
}

// Vite configuration
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  base: '/webui/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Resolve the '@' alias
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8112',
        changeOrigin: true,
      },
      '/swagger': {
        target: 'http://localhost:8112',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: serverWebuiPath, // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    assetsDir: 'assets', // Directory for static assets
  },
});