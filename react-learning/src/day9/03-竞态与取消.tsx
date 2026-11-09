// ============================================================
// Day9-3：⭐ 竞态与请求取消（今天唯一"真正新"的东西）
// ============================================================
// 📖 本文件名字对照表
//   RaceDemo        竞态演示（本页 /day9/race）
//   AbortController 浏览器提供的"取消器"
//   signal          取消信号，传给 axios 就能中止请求
//   abort()         按下取消按钮
//   ERR_CANCELED    被取消时 axios 抛的错误码（不是"出错"）
//
// ⭐ 竞态（race condition）是什么：
//   你点「搜索 A」（慢，900ms），紧接着点「搜索 B」（快，120ms）。
//   B 的结果先回来 → 屏幕上显示 B；然后 A 的结果迟到 → **把 B 的覆盖掉**。
//   用户明明搜的是 B，看到的却是 A 的结果。**这就是线上最常见的数据错乱。**
//
// ⭐ 治法只有一句：**每次发新请求前，把上一个请求 abort 掉。**

import { useEffect, useState } from 'react'
import { api, toFriendlyError } from './mock/mockApi'
import type { Post } from './mock/mockApi'

// 故意做成"慢的比快的先点"，才能复现乱序
const KEYWORDS: { kw: string; delay: number; label: string }[] = [
  { kw: 'React', delay: 900, label: '搜「React」（慢 900ms）' },
  { kw: 'key', delay: 120, label: '搜「key」（快 120ms）' },
  { kw: '请求', delay: 450, label: '搜「请求」（中 450ms）' },
]

const brief = (posts: Post[]) =>
  posts.length === 0 ? '0 条' : `${posts.length} 条：${posts.map((p) => p.title).join('、')}`

// ============================================================
// 左边：不取消（会出错）
// ============================================================
function WithoutCancel() {
  const [clicked, setClicked] = useState('') // 用户最后一次点的
  const [shown, setShown] = useState('') // 屏幕上现在显示的（可能已过期）
  const [shownKw, setShownKw] = useState('')
  const [loading, setLoading] = useState(false)

  const search = (kw: string, delay: number) => {
    setClicked(kw)
    setLoading(true)
    setShown('')
    setShownKw('')
    api
      .get<Post[]>(`/posts?_keyword=${kw}&_delay=${delay}`)
      .then((res) => {
        setShown(brief(res.data))
        setShownKw(kw)
      })
      .catch((err) => setShown(toFriendlyError(err).message))
      .finally(() => setLoading(false))
  }

  const mismatch = clicked !== '' && shownKw !== '' && clicked !== shownKw

  return (
    <div className="card" style={{ borderColor: '#cf222e' }}>
      <strong style={{ color: '#cf222e' }}>❌ 不取消</strong>
      <p style={{ margin: '8px 0' }}>
        {KEYWORDS.map((k) => (
          <button
            key={k.kw}
            className="btn-ghost"
            style={{ marginRight: 6, marginBottom: 6 }}
            onClick={() => search(k.kw, k.delay)}
          >
            {k.label}
          </button>
        ))}
      </p>
      <p style={{ margin: '4px 0' }}>
        你最后点的是：<strong>{clicked || '（还没点）'}</strong>
      </p>
      <p style={{ margin: '4px 0' }}>
        屏幕上显示：<strong>{loading ? '加载中…' : shownKw ? `「${shownKw}」的结果` : '（空）'}</strong>
      </p>
      <p style={{ margin: '4px 0', color: mismatch ? '#cf222e' : '#1f883d', fontWeight: 600 }}>
        {mismatch ? '⚠️ 不一致！旧请求把新结果覆盖了（竞态）' : '✅ 目前一致'}
      </p>
      <p className="hint" style={{ marginBottom: 0 }}>
        试：<strong>先点「慢 900ms」，0.3 秒内再点「快 120ms」</strong>。
        快的结果先显示，然后慢的结果迟到，把它覆盖 → 上面那行会变红。
      </p>
    </div>
  )
}

// ============================================================
// 右边：用 AbortController 取消（正确）
// ============================================================
function WithCancel() {
  const [kw, setKw] = useState('') // 唯一的状态源：点了哪个
  const [result, setResult] = useState('')
  const [shownKw, setShownKw] = useState('')
  const [loading, setLoading] = useState(false)

  // ⭐ 全部逻辑在 effect 里：kw 变了就重跑，上次的请求在 cleanup 里被 abort
  useEffect(() => {
    if (kw === '') return
    const delay = KEYWORDS.find((k) => k.kw === kw)?.delay ?? 0
    const controller = new AbortController()

    setLoading(true)
    setResult('')
    setShownKw('')

    api
      .get<Post[]>(`/posts?_keyword=${kw}&_delay=${delay}`, { signal: controller.signal })
      .then((res) => {
        setResult(brief(res.data))
        setShownKw(kw)
        setLoading(false)
      })
      .catch((err) => {
        // ⭐ 关键：被取消不是错误，什么都不用做（新请求已经接管了）
        if (err?.code === 'ERR_CANCELED' || controller.signal.aborted) return
        setResult(toFriendlyError(err).message)
        setLoading(false)
      })

    // ⭐ 这一行是治竞态的核心：下一次 effect 跑之前，先取消上一个请求
    return () => controller.abort()
  }, [kw])

  const mismatch = kw !== '' && shownKw !== '' && kw !== shownKw

  return (
    <div className="card" style={{ borderColor: '#1f883d' }}>
      <strong style={{ color: '#1f883d' }}>✅ 用 AbortController 取消</strong>
      <p style={{ margin: '8px 0' }}>
        {KEYWORDS.map((k) => (
          <button
            key={k.kw}
            className="btn-ghost"
            style={{ marginRight: 6, marginBottom: 6 }}
            onClick={() => setKw(k.kw)}
          >
            {k.label}
          </button>
        ))}
      </p>
      <p style={{ margin: '4px 0' }}>
        你最后点的是：<strong>{kw || '（还没点）'}</strong>
      </p>
      <p style={{ margin: '4px 0' }}>
        屏幕上显示：<strong>{loading ? '加载中…' : shownKw ? `「${shownKw}」的结果` : '（空）'}</strong>
      </p>
      <p style={{ margin: '4px 0', color: mismatch ? '#cf222e' : '#1f883d', fontWeight: 600 }}>
        {mismatch ? '⚠️ 不一致（不该发生）' : '✅ 永远一致'}
      </p>
      <p className="hint" style={{ marginBottom: 0 }}>
        同样的操作顺序：<strong>先点慢的，再快速点快的</strong>。
        慢的请求在点快的瞬间就被 abort 了，所以永远不会覆盖。
        <br />
        ⚠️ 注意：两栏的按钮文字一样，<strong>请分别点这一栏里的按钮</strong>（鼠标悬停时看边框颜色区分）。
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function RaceDemo() {
  return (
    <div>
      <div style={{ display: 'grid', gap: 12 }}>
        <WithoutCancel />
        <WithCancel />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>治法就三行</h3>
        <pre
          style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, fontSize: 12.5, overflowX: 'auto', margin: '8px 0' }}
        >{`useEffect(() => {
  const controller = new AbortController()

  api.get('/posts', { signal: controller.signal })     // ① 把 signal 塞给请求
    .then((res) => setData(res.data))
    .catch((err) => {
      if (err.code === 'ERR_CANCELED') return           // ② 取消不算错误
      setError(...)
    })

  return () => controller.abort()                      // ③ cleanup 里取消
}, [keyword])                                          // ← keyword 变就重跑`}</pre>
        <p style={{ margin: 0 }}>
          <strong>为什么必须是 cleanup 里 abort？</strong>
          因为 React 的规则是：依赖变了 → 先跑上一次的 cleanup → 再跑新一次 effect。
          把 abort 放在 cleanup 里，顺序就天然正确：先掐掉旧的，再发新的。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>四个必须知道的细节</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>细节</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>说明</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['ERR_CANCELED 不能提示用户', '它是你自己取消的，不是故障。提示"请求失败"是纯骚扰'],
              [
                '别用 .finally(() => setLoading(false))',
                '被取消的那次也会跑 finally → 把新请求的 loading 关掉 → 界面卡在"没数据也没转圈"',
              ],
              [
                '别用"标记变量"骗自己',
                'let ignore = true 也能让显示正确，但请求还在跑、流量还在烧。abort 是真的省',
              ],
              [
                '组件卸载时也要 abort',
                'cleanup 天然覆盖这一点（卸载时 cleanup 会跑）→ 不会出现"卸载后 setState"',
              ],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', whiteSpace: 'nowrap' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>面试会怎么问</h3>
        <p style={{ marginTop: 0 }}>
          <strong>Q：搜索框快速输入，结果错乱，你怎么排查和修复？</strong>
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>先判断是<strong>竞态</strong>：响应回来的顺序 ≠ 请求发出的顺序</li>
          <li>修复：每次新请求前 <code>abort()</code> 旧请求（<code>AbortController</code> + <code>signal</code>）</li>
          <li>补充：<code>catch</code> 里忽略 <code>ERR_CANCELED</code>；<code>loading</code> 不要放 <code>finally</code></li>
          <li>
            加分：<strong>再叠一层防抖</strong>（Day5 的 <code>useDebounce</code>）—— 减少请求数，
            abort 解决"顺序"，防抖解决"次数"，两个一起用才是完整方案
          </li>
        </ol>
      </div>
    </div>
  )
}

/* ============================================================
 * 顺带：为什么本地开发很少遇到，上线后才遇到？
 * ============================================================
 * 因为本地接口几毫秒就回来，请求顺序几乎不会乱。
 * 上线后：用户网速差、服务端慢查询、CDN 缓存未命中 —— 延迟差几十倍，乱序就出现了。
 * 所以这个 bug 是典型的"测试环境测不出来"的问题，只能靠提前写对。
 * ============================================================ */
