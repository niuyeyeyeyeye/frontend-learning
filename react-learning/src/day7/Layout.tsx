// ============================================================
// Day7 Layout：Day7 自己的子导航（嵌套路由的第 2 层）
// ============================================================
// 📖 本文件名字对照表
//   Day7Layout   Day7 布局（day7 下面所有页面的外壳）
//   Outlet       出口（子路由页面从这里出来）
//   useLocation  当前位置（用来显示"你现在在哪"）
//   end          精确匹配（不加 end 的话 /day7 会一直显示激活）
//
// ⭐ 你现在看到的就是"嵌套路由"：
//     RootLayout(/) → Outlet → Day7Layout(/day7) → Outlet → 具体页面
//   两层 Outlet 套在一起，每层只负责自己的那圈"外壳"。

import { NavLink, Outlet, useLocation } from 'react-router-dom'

const SUB_NAV = [
  { to: '/day7', label: '概览', end: true },
  { to: '/day7/basics', label: '1. 路由基础', end: false },
  { to: '/day7/users', label: '2. 动态路由', end: false },
  { to: '/day7/navigate', label: '3. 编程式导航', end: false },
  { to: '/day7/nested', label: '4. 嵌套路由', end: false },
  { to: '/day7/practice', label: '练习', end: false },
]

export default function Day7Layout() {
  const location = useLocation()

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Day7 · React Router</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>
        {location.search && (
          <>
            {' '}查询参数：<code>{location.search}</code>
          </>
        )}
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
