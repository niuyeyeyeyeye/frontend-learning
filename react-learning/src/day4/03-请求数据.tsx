// ============================================================
// Day4-3：useEffect + 异步请求（loading / error / data 三态）
// ============================================================
// 这是真实项目里最常写的模式：**组件挂载时请求数据，渲染时处理三种状态**。
// 面试题也常问："你怎么处理请求的加载中和失败？"—— 就是这里的三态。

import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
}

// 模拟一个网络请求（真实项目里换成 fetch / axios）
function mockFetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 3) {
        reject(new Error('用户不存在（404）'))
      } else {
        resolve({ id, name: '用户 ' + id, email: `user${id}@example.com` })
      }
    }, 800) // 模拟 800ms 网络延迟
  })
}

export default function FetchDemo() {
  const [userId, setUserId] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ⭐ 关键：这个变量用来判断"这次请求是否还有效"
    let cancelled = false

    setLoading(true)
    setError(null)
    setUser(null)

    mockFetchUser(userId)
      .then((data) => {
        if (cancelled) return // 已经切到别的 id 了，丢弃这次结果
        setUser(data)
        setLoading(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : '未知错误')
        setLoading(false)
      })

    // 清理函数：组件卸载或 userId 变化时，把上一次请求标记为作废
    return () => {
      cancelled = true
    }
  }, [userId])

  // 渲染三态
  return (
    <div>
      <h3>1. 点按钮切换用户（id=3 会失败）</h3>
      <div style={{ marginBottom: 10 }}>
        {[1, 2, 3, 4].map((id) => (
          <button
            key={id}
            className={userId === id ? 'btn' : 'btn-ghost'}
            style={{ marginRight: 6 }}
            onClick={() => setUserId(id)}
          >
            用户 {id}
          </button>
        ))}
      </div>

      {/* ---------- 三种状态 + 空白态 ---------- */}
      <div className="card">
        {loading && <p>⏳ 加载中…（最多 0.8 秒）</p>}
        {error !== null && <p style={{ color: '#cf222e' }}>❌ {error}</p>}
        {!loading && error === null && user !== null && (
          <div>
            <p>✅ 加载成功</p>
            <p>
              <strong>{user.name}</strong>　<span className="hint">{user.email}</span>
            </p>
          </div>
        )}
        {!loading && error === null && user === null && <p className="hint">（还没有数据）</p>}
      </div>

      <h3>2. ⚠️ 竞态问题（race condition）</h3>
      <div className="card">
        <p>
          <b>快速连点 "用户 1" 和 "用户 2"</b>，观察会不会显示错的数据。
        </p>
        <p className="hint">
          如果没有 <code>cancelled</code> 这个标记：先发的请求可能后返回，把后发请求的结果<strong>覆盖掉</strong> →
          你点了"用户 2"，却显示了"用户 1"的数据。<br />
          这就是<strong>竞态</strong>：多个请求的返回顺序不确定。<br />
          我加了 <code>cancelled</code> 标记（清理函数里置 true），保证"过期的请求结果直接丢弃"。
        </p>
        <p className="hint">
          真实项目里另一种做法是用 <code>AbortController</code> 取消请求（axios 支持 signal）。
        </p>
      </div>

      <h3>3. 记住这个写法（以后写项目直接用）</h3>
      <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: 10, borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>
{`useEffect(() => {
  let cancelled = false
  setLoading(true); setError(null)

  fetchData(id)
    .then(data => { if (!cancelled) { setData(data); setLoading(false) } })
    .catch(e => { if (!cancelled) { setError(...); setLoading(false) } })

  return () => { cancelled = true }     // ← 这个清理函数是必须的
}, [id])`}
      </pre>
    </div>
  )
}
