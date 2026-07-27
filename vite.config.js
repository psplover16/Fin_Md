import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.VITE_APP_BASE_PATH || '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // 允許在開發環境測試 PWA
      },
      manifest: {
        name: 'Vue Markdown Reader',
        short_name: 'MD Reader',
        theme_color: '#ffffff',
        display: 'standalone',
        // 注意：實務上需要準備 icon，否則 PWA 安裝會有警告
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})