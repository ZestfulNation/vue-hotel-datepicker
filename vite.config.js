import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'vueHotelDatepicker',
      formats: ['cjs', 'es', 'umd'],
      fileName: (format) => {
        if (format === 'cjs') return 'vueHotelDatepicker.common.js'
        return `vueHotelDatepicker.${format}.js`
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'vueHotelDatepicker[extname]',
      },
    },
    cssCodeSplit: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
