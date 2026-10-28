import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // 1. Importar VitePWA

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Mantener Tailwind
    VitePWA({ // 3. Agregar la configuración de PWA
      registerType: 'autoUpdate',
      manifest: {
        name: "Mita'i Learn - Mundo Semilla",
        short_name: 'Mundo Semilla',
        description: 'Educación y juego para niños en Guaraní y Español',
        theme_color: '#f9a8d4', // Rosa pastel
        background_color: '#ffffff',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})