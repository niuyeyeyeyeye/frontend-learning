// ============================================================
// Day7-0：概览 —— 今天到底在学什么
// ============================================================
// 📖 本文件名字对照表
//   Day7Overview    Day7 概览（这是 /day7 的 index 路由）
//   index route     索引路由（父路径本身就显示这个页面，不用多写一层地址）
//   useLocation     当前位置
//
// 一句话：**路由 = URL 和组件的对照表。**
//   URL 变了 → React 去表里查该渲染哪个组件 → 换掉 <Outlet> 那块。
//   整页不刷新，所以叫 SPA（Single Page Application）。

import { Link, useLocation } from 'react-router-dom'

const API_TABLE = [
  { name: '<Link to>', use: '跳转链接（不刷新）', where: 'JSX' },
  { name: '<NavLink>', use: '跳转链接 + 自动知道是否激活', where: 'JSX（做导航栏必备）' },
  { name: '<Outlet>', use: '子路由渲染的出口', where: '布局组件里' },
  { name: 'useParams()', use: '取动态参数 :id', where: '详情页' },
  { name: 'useNavigate()', use: '用代码跳转（提交后跳、返回上一页）', where: '事件处理函数里' },
  { name: 'useSearchParams()', use: '读写 ?q=xx&page=2 这种查询参数', where: '搜索/筛选/分页' },
  { name: 'useLocation()', use: '读当前地址（跟踪埋点、判断来源）', where: '任意' },
]

export default function Day7Overview() {
  const location = useLocation()

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>你现在的位置</h3>
        <p>
          <code>{location.pathname}</code> —— 这是 <code>/day7</code> 的 <strong>index 路由</strong>：
          父路径本身就是它，所以配置里写 <code>index: true</code>，不用单独起名字。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天的路由树</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: 0,
          }}
        >{`<RouterProvider router={router}>
 └─ RootLayout                    "/"         ← 顶部导航
     ├─ Home                      index       ← 首页
     ├─ Archive                   /archive    ← Day1~6 归档
     ├─ Day7Layout                /day7       ← 今天的子导航
     │   ├─ Day7Overview          index       ← 本页
     │   ├─ RouteBasics           /basics
     │   ├─ UsersList             /users
     │   ├─ UserDetail            /users/:id  ← 冒号 = 变量
     │   ├─ NavigateDemo          /navigate
     │   ├─ SettingsLayout        /nested     ← 再嵌一层！
     │   │   ├─ index / profile / security
     │   └─ PracticeDay7          /practice
     └─ NotFound                  "*"         ← 兜底`}</pre>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天只需要记这 7 个 API</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>API</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>干什么</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>在哪用</th>
            </tr>
          </thead>
          <tbody>
            {API_TABLE.map((row) => (
              <tr key={row.name}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{row.name}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{row.use}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>
                  {row.where}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>建议的顺序</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <Link to="/day7/basics">1. 路由基础</Link> —— 先搞清 <code>Link</code> 和{' '}
            <code>&lt;a&gt;</code> 的区别（3 分钟，但最关键）
          </li>
          <li>
            <Link to="/day7/users">2. 动态路由</Link> —— 列表点进详情，<code>useParams</code> 取 id
          </li>
          <li>
            <Link to="/day7/navigate">3. 编程式导航</Link> —— <code>useNavigate</code> + 把搜索词放进 URL
          </li>
          <li>
            <Link to="/day7/nested">4. 嵌套路由</Link> —— <code>Outlet</code>，以及"这一整页就是嵌套路由"
          </li>
          <li>
            <Link to="/day7/practice">练习</Link> —— 3 个 TODO
          </li>
        </ol>
      </div>
    </div>
  )
}
