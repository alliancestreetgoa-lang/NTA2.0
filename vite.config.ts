import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project is served from https://<user>.github.io/NTA2.0/ in production,
// but from / during local dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/NTA2.0/' : '/',
  plugins: [react()],
}))
