import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Base path: '/' works for Netlify, Vercel and any root deploy.
// For a GitHub Pages *project* site, set base to '/<repo-name>/' (see README).
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Static files that must be cached for offline use but aren't part of the JS graph.
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Eurêka',
        short_name: 'Eurêka',
        description:
          "L'Atelier de Minuit — découvre que les maths sont un ciel immense à explorer.",
        lang: 'fr',
        dir: 'ltr',
        theme_color: '#0E1430',
        background_color: '#080B1F',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache the app shell + self-hosted fonts so it works fully offline.
        // woff2 only — every PWA-capable browser supports it; skipping woff
        // keeps the offline cache lean.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
