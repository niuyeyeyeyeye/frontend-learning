// ============================================================
// Day10 Layout：子导航（嵌套路由第 2 层）
// ============================================================
// 📖 名字对照：Day10Layout 布局 / Outlet 出口 / useLocation 当前位置

import { NavLink, Outlet, useLocation } from 'react-router-dom'

const SUB_NAV = [
  { to: '/day10', label: '1. 重渲染怎么发生', end: true },
  { to: '/day10/memo', label: '2. useMemo/useCallback', end: false },
  { to: '/day10/placement', label: '3. 把 state 往下挪', end: false },
  { to: '/day10/lazy', label: '4. 懒加载', end: false },
  { to: '/day10/practice', label: '练习', end: false },
]

export default function Day10Layout() {
  const location = useLocation()
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Day10 · 性能优化（React 最后一座高峰）</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>　|　
        每页都有<strong>渲染次数计数器</strong>：数字不再涨，就说明优化生效了。
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
