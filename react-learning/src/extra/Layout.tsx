// ============================================================
// 补课 Layout：补课模块的子导航
// ============================================================
// 📖 名字对照：ExtraLayout 补课布局 / Outlet 出口 / useLocation 当前位置

import { NavLink, Outlet, useLocation } from 'react-router-dom'

const SUB_NAV = [
  { to: '/extra', label: '1. ErrorBoundary + Portal', end: true },
  { to: '/extra/2-reducer', label: '2. useReducer', end: false },
  { to: '/extra/3-react19', label: '3. React 19 新特性', end: false },
  { to: '/extra/4-form-ime', label: '4. 表单与中文输入', end: false },
  { to: '/extra/5-vite-css', label: '5. Vite + CSS 方案', end: false },
]

export default function ExtraLayout() {
  const location = useLocation()
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>补课 · React 12 天里缺的 5 节</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>　|　
        这些不是"新内容"，是<strong>用过但没讲清、或者根本没用过</strong>的东西。
        每节 30~60 分钟，做项目立刻要用。
      </p>

      <nav
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          borderBottom: '1px solid #eaeef2',
          paddingBottom: 8,
          marginBottom: 16,
        }}
      >
        {SUB_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              padding: '4px 10px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              background: isActive ? '#8250df' : '#f6f8fa',
              color: isActive ? '#fff' : '#57606a',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
