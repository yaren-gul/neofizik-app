import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sunucu sadece bu bilgisayarda açılır (Wi-Fi'deki başkaları erişemez).
  // Telefon USB üzerinden bağlanır: npm run telefon (adb reverse -> 127.0.0.1:5173).
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
})
