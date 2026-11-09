// ============================================================
// Day9 Layout：子导航（嵌套路由第 2 层）
// ============================================================
// 📖 名字对照：Day9Layout 布局 / Outlet 出口 / useLocation 当前位置
//    api 是 ../day9/mock/mockApi 里配置好的 axios 实例

import { NavLink, Outlet, useLocation } from 'react-router-dom'

const SUB_NAV = [
  { to: '/day9', label: '1. 为什么封装', end: true },
  { to: '/day9/basics', label: '2. axios 与错误分类', end: false },
  { to: '/day9/interceptor', label: '3. 拦截器与封装', end: false },
  { to: '/day9/race', label: '4. ⭐ 竞态与取消', end: false },
  { to: '/day9/practice', label: '练习', end: false },
]

export default function Day9Layout() {
  const location = useLocation()
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Day9 · axios 与请求封装</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>　|　
        这一天的数据来自本地假后端（<code>mock/mockApi.ts</code>），
        <strong>除了“网络传输”是假的，拦截器、错误、取消全都是真的 axios。</strong>
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
