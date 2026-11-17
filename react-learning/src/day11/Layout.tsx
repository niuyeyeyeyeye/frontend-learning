// ============================================================
// Day11 Layout：子导航
// ============================================================
// 📖 名字对照：Day11Layout 布局 / Outlet 出口 / useLocation 当前位置
//    import.meta.env.MODE 是环境变量演示（这一行就来自 Vite）

import { NavLink, Outlet, useLocation } from 'react-router-dom'

const SUB_NAV = [
  { to: '/day11', label: '1. 解决什么问题', end: true },
  { to: '/day11/prettier', label: '2. Prettier 与依赖冲突', end: false },
  { to: '/day11/env', label: '3. 环境变量', end: false },
  { to: '/day11/deploy', label: '4. 构建与部署', end: false },
  { to: '/day11/practice', label: '练习', end: false },
]

export default function Day11Layout() {
  const location = useLocation()
  const mode = import.meta.env?.MODE ?? 'node'

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Day11 · 工程化 + 部署</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>　|　 当前模式：<code>MODE={mode}</code>
        {mode === 'development' && '（npm run dev）'}
        {mode === 'production' && '（npm run build + preview）'}
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
              background: isActive ? '#0969da' : '#f6f8fa',
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
