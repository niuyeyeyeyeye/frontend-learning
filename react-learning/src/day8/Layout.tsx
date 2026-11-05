// ============================================================
// Day8 Layout：Day8 的子导航（和 Day7 一样，是嵌套路由的第 2 层）
// ============================================================
// 📖 本文件名字对照表
//   Day8Layout   Day8 布局   Outlet 出口   useLocation 当前位置
//   useTodoStore 顶部那个"待办 N 条"就是跨页面共享的证据

import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTodoStore, todoStats } from './store/todoStore'

const SUB_NAV = [
  { to: '/day8', label: '为什么要它', end: true },
  { to: '/day8/basics', label: '1. 基础用法', end: false },
  { to: '/day8/selector', label: '2. 选择性订阅', end: false },
  { to: '/day8/todo', label: '3. 实战：重写待办', end: false },
  { to: '/day8/practice', label: '练习', end: false },
]

export default function Day8Layout() {
  const location = useLocation()
  // ⭐ 注意：这里没有 Provider 包着，任何组件都能直接读 store
  const todos = useTodoStore((s) => s.todos)
  const stats = todoStats(todos)

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Day8 · Zustand 状态管理</h1>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>　|　
        {/* 这个数字和「3. 实战」页里的待办是同一份数据 —— 就在证明"跨页面共享" */}
        全局待办：<strong>{stats.total}</strong> 条（其中已完成 {stats.done}）
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
