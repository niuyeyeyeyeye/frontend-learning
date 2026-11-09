// ============================================================
// Home：首页（路由表 / 从这里出发）
// ============================================================
// 📖 本文件名字对照表
//   Home       首页
//   Link       路由链接（点了不刷新页面）
//   ROUTE_MAP  路由表（把 router.tsx 里的结构抄一份展示出来）

import { Link } from 'react-router-dom'

type RouteRow = {
  path: string
  file: string
  note: string
}

const ROUTE_MAP: RouteRow[] = [
  { path: '/', file: 'pages/Home.tsx', note: '首页（index 路由）' },
  { path: '/day7', file: 'day7/00-概览.tsx', note: 'Day7 概览（嵌套路由的父层）' },
  { path: '/day7/basics', file: 'day7/01-路由基础与Link.tsx', note: '03 秒懂：<Link> vs <a>' },
  { path: '/day7/users', file: 'day7/02-动态路由与useParams.tsx', note: '用户列表' },
  { path: '/day7/users/:id', file: 'day7/02-动态路由与useParams.tsx', note: '动态路由（:id 是变量）' },
  { path: '/day7/navigate', file: 'day7/03-编程式导航与URL状态.tsx', note: 'useNavigate + ?q= 查询参数' },
  { path: '/day7/nested', file: 'day7/04-嵌套路由与Outlet.tsx', note: '嵌套路由（再嵌一层）' },
  { path: '/day7/practice', file: 'day7/05-练习.tsx', note: 'Day7 练习' },
  { path: '/day7/articles/:id', file: 'day7/05-练习.tsx', note: '动态路由实战（练习 2）' },
  { path: '/day8', file: 'day8/00-为什么需要Zustand.tsx', note: 'Day8：为什么要 Zustand（对比实验）' },
  { path: '/day8/basics', file: 'day8/01-zustand基础.tsx', note: 'create / set / getState' },
  { path: '/day8/selector', file: 'day8/02-选择性订阅.tsx', note: '选择性订阅（少渲染的关键）' },
  { path: '/day8/todo', file: 'day8/03-实战-用Zustand重写待办.tsx', note: '重写待办 + persist 持久化' },
  { path: '/day8/practice', file: 'day8/04-练习.tsx', note: 'Day8 练习' },
  { path: '/day9', file: 'day9/00-为什么要封装请求.tsx', note: 'Day9：三态 + axios vs fetch' },
  { path: '/day9/basics', file: 'day9/01-axios基础.tsx', note: 'axios 错误分类（4 种错误都能撞）' },
  { path: '/day9/interceptor', file: 'day9/02-拦截器与封装.tsx', note: '拦截器 + request<T> 封装' },
  { path: '/day9/race', file: 'day9/03-竞态与取消.tsx', note: '⭐ 竞态与 AbortController' },
  { path: '/day9/practice', file: 'day9/04-练习.tsx', note: 'Day9 练习' },
  { path: '/archive', file: 'pages/Archive.tsx', note: 'Day1~6 全部内容归档' },
  { path: '*', file: 'pages/NotFound.tsx', note: '404（任何没配过的地址）' },
]

export default function Home() {
  return (
    <div>
      <h1>React 学习 · 首页</h1>
      <p className="hint">
        从今天（Day7）开始，这个项目是一个真正的 SPA：地址栏变了，页面不刷新。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>当前路由表</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>地址</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>文件</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>说明</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_MAP.map((row) => (
              <tr key={row.path}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{row.path}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{row.file}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>开始今天的学习</h3>
        <p>
          <Link className="btn" to="/day7">
            进入 Day7：React Router →
          </Link>
        </p>
        <p className="hint">
          想复习前面的：<Link to="/archive">Day1~6 归档</Link>
        </p>
      </div>
    </div>
  )
}
