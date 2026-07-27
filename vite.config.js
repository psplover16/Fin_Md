import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

function normalizeBasePath(value) {
  const rawValue = value?.trim() || '/';

  if (rawValue === '/') {
    return '/';
  }

  const withLeadingSlash = rawValue.startsWith('/') ? rawValue : `/${rawValue}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appBasePath = normalizeBasePath(env.VITE_APP_BASE_PATH);

  return {
  base: appBasePath,
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
              src: `${appBasePath}icons/icon-192.png`,
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: `${appBasePath}icons/icon-512.png`,
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: `${appBasePath}icons/icon-maskable-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
        ]
      }
    })
  ]
  }
})