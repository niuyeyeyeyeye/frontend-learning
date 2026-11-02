// ============================================================
// NotFound：404 页面（兜底路由）
// ============================================================
// 📖 本文件名字对照表
//   NotFound     404 页面
//   useLocation  当前位置（pathname / search / hash / state）
//   pathname     路径部分（不含 ?后面的查询参数）
//
// 💡 为什么需要它？
//   路由表最后一条 `path: '*'` 会接住"所有没匹配上的地址"。
//   没有它，用户手滑打错地址就看到一片空白 —— 这是最常见的"上线事故"之一。

import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  return (
    <div>
      <h1>404 · 这个地址不存在</h1>
      <div className="card">
        <p>
          你访问的是：<code style={{ background: '#f6f8fa', padding: '2px 6px' }}>{location.pathname}</code>
        </p>
        <p className="hint">
          这个地址没有在 <code>src/router.tsx</code> 里配过，所以落到了 <code>path: '*'</code> 这条兜底路由。
        </p>
        <p>
          <Link className="btn" to="/">
            回首页
          </Link>
        </p>
      </div>
    </div>
  )
}
