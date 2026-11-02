import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'
import './index.css'

// ============================================================
// 入口文件（Day7 起变了）
// ============================================================
// 以前：createRoot(...).render(<App />)      ← 一个组件就是一整页
// 现在：createRoot(...).render(<RouterProvider router={router} />)
//       ← 路由接管"该渲染哪个组件"
//
// createBrowserRouter：用浏览器地址栏（History API）做路由，地址长这样 /day7/users/2
//   （另一种是 createHashRouter，地址长这样 /#/day7/users/2，部署到纯静态托管更省事）
//
// StrictMode：开发模式下的额外检查（会让组件渲染两次，这是故意的，别慌）

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
