// ============================================================
// RootLayout：全站外层布局（顶部导航 + 内容出口）
// ============================================================
// 📖 本文件名字对照表
//   RootLayout   根布局（所有页面都套在这一层里面）
//   Outlet       出口（"子路由的页面从这儿渲染出来"）
//   NavLink      导航链接（会自动知道"我是不是当前激活的那一项"）
//   isActive     是否激活（NavLink 传给 className 函数的布尔值）
//
// 💡 这一层只渲染一次：不管你在 / 还是 /day7/users/2，
//    RootLayout 都不会重建 —— 这就是 SPA 的核心收益。
//    下面那行"本次启动时间"就是证据：用 <Link> 跳转它永远不变，
//    用 <a href> 跳转就会变（整个应用重启了）。

import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'

// 模块级常量：整个应用生命周期里只算一次
const APP_START = new Date().toLocaleTimeString('zh-CN', { hour12: false })

const NAV_ITEMS = [
  { to: '/', label: '首页', end: true },
  { to: '/day7', label: 'Day7 路由', end: false },
  { to: '/day8', label: 'Day8 状态', end: false },
  { to: '/day9', label: 'Day9 请求', end: false },
  { to: '/day10', label: 'Day10 性能', end: false },
  { to: '/day11', label: 'Day11 工程化', end: false },
  { to: '/extra', label: '补课', end: false },
  { to: '/archive', label: 'Day1~6 归档', end: false },
  { to: '/about', label: 'About 关于', end: false },
]

export default function RootLayout() {
  const location = useLocation()
  return (
    <div>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#fff',
          borderBottom: '1px solid #eaeef2',
          padding: '10px 16px',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <NavLink
            to='/'
            end
            style={{ fontWeight: 700, fontSize: 16, color: '#1f2328', textDecoration: 'none' }}
          >
            {import.meta.env.VITE_APP_TITLE ?? 'React 学习'}
          </NavLink>

          <nav style={{ display: 'flex', gap: 12 }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                // ⭐ NavLink 的 className 可以传函数，参数里有 isActive
                style={({ isActive }) => ({
                  color: isActive ? '#0969da' : '#57606a',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <span style={{ marginLeft: 'auto', color: '#8b949e', fontSize: 12 }}>
            本次启动：{APP_START}
          </span>
        </div>
      </header>

      {/* ⭐ 所有子路由的页面都插在这里 */}
      {/*
        ⭐ ErrorBoundary 包在这里：
        · 某一页崩了 → 只有内容区显示兜底 UI，顶部导航还能用（可以切去别的页面）
        · resetKeys 传 pathname：用户一切换页面就自动重试，不用手动点"重试"
        这就是"兜底要包在可能出事的区域外面"，而不是包在整页外面。
      */}
      <div style={{ padding: '0 16px 40px' }}>
        <ErrorBoundary resetKeys={[location.pathname]}>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  )
}
