import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// createRoot：把 React 应用挂载到 index.html 里那个 <div id="root"> 上
// StrictMode：开发模式下的额外检查（会让组件渲染两次，这是故意的，别慌）
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
