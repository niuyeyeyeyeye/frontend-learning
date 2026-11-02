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
  { path: '/day7/practice', file: 'day7/05-练习.tsx', note: '今天的练习' },
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
