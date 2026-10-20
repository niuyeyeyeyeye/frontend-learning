import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 配置：告诉 Vite "这是一个 React 项目"
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
