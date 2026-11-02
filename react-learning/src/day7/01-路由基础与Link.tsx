// ============================================================
// Day7-1：路由基础 —— <Link> vs <a>，以及"页面不刷新"到底指什么
// ============================================================
// 📖 本文件名字对照表
//   RouteBasics   路由基础（本页）
//   Link          路由链接：点击 → 只换组件，不发新请求
//   NavLink       路由链接 + isActive（导航栏用）
//   useNavigate   代码跳转（本页只用一次做对比）
//   mount/unmount 挂载 / 卸载（切路由 = 上一个组件卸载、下一个挂载）
//
// ⭐ 一句话：站内跳转**永远**用 <Link>，不要用 <a href>。
//    <a href="/xxx">      → 浏览器发新请求、拿 index.html、整个 React 应用重启
//    <Link to="/xxx">     → 只跑路由匹配、只换 <Outlet> 那块内容

import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

// ============================================================
// 实验 A：<a> vs <Link> —— 看顶部的"本次启动时间"
// ============================================================
function LinkVsAnchor() {
  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        <strong>怎么做这个实验：</strong>先记住页面右上角「本次启动：xx:xx:xx」那个时间，
        然后分别点下面两个链接，回到本页再看那个时间。
      </p>

      <p>
        <a className="btn-ghost" href="/day7/users" style={{ marginRight: 8 }}>
          ❌ 用 &lt;a href&gt; 跳转
        </a>
        <Link className="btn" to="/day7/users">
          ✅ 用 &lt;Link to&gt; 跳转
        </Link>
      </p>

      <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
        <li>
          <strong>&lt;a&gt;</strong>：整页重载 → 顶部时间<strong>变了</strong>（应用重启），
          而且你能看到页面白闪一下；F12 的 Network 里会多一条 <code>index.html</code> 文档请求。
        </li>
        <li>
          <strong>&lt;Link&gt;</strong>：客户端跳转 → 顶部时间<strong>不变</strong>，
          没有白闪，Network 里没有文档请求。
        </li>
      </ul>
      <p className="hint">
        ⚠️ 注意：<code>&lt;a href="/day7/users"&gt;</code> 在开发服务器上也会"能跳"，
        所以很多人以为没问题 —— 但它是把整个应用重启了一遍，所有内存里的状态都没了。
      </p>
    </div>
  )
}

// ============================================================
// 实验 B：切路由时，组件是"卸载"而不是"隐藏"
// ============================================================
// 这条很重要：切走 → 组件卸载 → useEffect 的清理函数会执行 → 回来时 state 归零。
// 所以"页面 A 的状态"不会自动带到"页面 B"，想要保留就得提到 URL / Context / store 里。

function MountLogger() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('[MountLogger] 挂载了（切路由进来）')
    return () => {
      console.log('[MountLogger] 卸载了（切路由走了）')
    }
  }, [])

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        计数器：<strong>{count}</strong>
      </p>
      <button className="btn" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
      <p className="hint">
        👆 加几次，然后点下面的链接切走再切回来 —— 数字归零了。
        打开 F12 能看到「挂载 / 卸载」两条日志。<strong>切路由 = 卸载 + 挂载</strong>，
        不是"把页面藏起来"。
      </p>
      <p>
        <Link to="/day7/basics" style={{ marginRight: 12 }}>
          切走（去别的页）
        </Link>
        <NavLink to="/day7" end style={{ color: '#0969da' }}>
          回概览
        </NavLink>
      </p>
    </div>
  )
}

// ============================================================
// 实验 C：NavLink 的 isActive
// ============================================================
function NavLinkDemo() {
  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        普通 <code>Link</code> 不会告诉你"我是不是当前页"，<code>NavLink</code> 会 ——
        下面这三个链接和上面的子导航区用的是同一套逻辑：
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { to: '/day7', label: '概览', end: true },
          { to: '/day7/basics', label: '路由基础', end: false },
          { to: '/day7/users', label: '用户列表', end: false },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              padding: '4px 10px',
              borderRadius: 6,
              textDecoration: 'none',
              border: '1px solid ' + (isActive ? '#0969da' : '#d0d7de'),
              background: isActive ? '#ddf4ff' : '#fff',
              color: isActive ? '#0969da' : '#57606a',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <p className="hint">
        ⚠️ <code>end</code> 的作用：<code>/day7</code> 是 <code>/day7/basics</code> 的前缀，
        不加 <code>end</code> 的话，你在子页面时"概览"也会一直亮着。
      </p>
    </div>
  )
}

// ============================================================
// 实验 D：编程式跳转（代码里主动跳，不是用户点链接）
// ============================================================
function NavigateIntro() {
  const navigate = useNavigate()

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        <code>useNavigate()</code> 给你一个 <code>navigate</code> 函数，可以在任何函数里跳转 ——
        比如"提交表单成功后跳到列表页"。完整用法在第 3 节，这里先试一下：
      </p>
      <button className="btn" style={{ marginRight: 8 }} onClick={() => navigate('/day7/users')}>
        代码跳到用户列表
      </button>
      <button className="btn-ghost" onClick={() => navigate(-1)}>
        返回上一页（navigate(-1)）
      </button>
    </div>
  )
}

export default function RouteBasics() {
  return (
    <div>
      <h2>1. Link 和 a 的区别</h2>
      <LinkVsAnchor />

      <h2>2. 切路由 = 卸载 + 挂载</h2>
      <MountLogger />

      <h2>3. NavLink：导航栏为什么能自动高亮</h2>
      <NavLinkDemo />

      <h2>4. 用代码跳转</h2>
      <NavigateIntro />
    </div>
  )
}

/* ============================================================
 * 三条铁律（记住这三条，路由就入门了）
 * ============================================================
 * 1. 站内跳转只用 <Link> / <NavLink>，永远不要 <a href> / window.location.href
 *    （除非要跳去站外，比如 https://github.com）
 *
 * 2. 切路由 = 旧页面卸载 + 新页面挂载
 *    → 旧页面的 state 全部消失（这是设计，不是 bug）
 *    → 想在页面之间共享状态：提到 URL（?id=1）、Context、或 store（Day8）
 *
 * 3. 路由表写在一个地方（src/router.tsx），组件只负责"我这个页面长什么样"
 *    → 以后加页面 = 加一个文件 + 加一行路由，不用改任何已有页面
 * ============================================================ */
