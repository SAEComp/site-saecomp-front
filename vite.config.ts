import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    base: '/',
    server: {
        https: {},
        host: true,
        port: 5173,
    },
})
