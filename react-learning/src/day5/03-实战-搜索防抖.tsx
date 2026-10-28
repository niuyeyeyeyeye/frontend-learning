// ============================================================
// Day5-3：实战 —— 用 useDebounce 重写搜索框
// ============================================================
// 这个文件把 Day4（useEffect + 清理 + 请求）和 Day5（自定义 hook）结合起来了。
// 对比看：用防抖前 vs 用防抖后，"请求次数"差多少。

import { useEffect, useState } from 'react'

// ---------- 数据与模拟请求 ----------
interface User {
  id: number
  name: string
  bio: string
  color: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'gaearon', bio: 'React 核心作者', color: '#6e40c9' },
  { id: 2, name: 'gatsby', bio: '静态站点框架', color: '#2ea44f' },
  { id: 3, name: 'antfu', bio: 'Vue 生态活跃开发者', color: '#d29922' },
  { id: 4, name: 'yyx990803', bio: 'Vue.js 作者 Evan You', color: '#8250df' },
  { id: 5, name: 'leerob', bio: 'Next.js 布道师', color: '#cf222e' },
  { id: 6, name: 'sindresorhus', bio: '开源狂人', color: '#1f883d' },
  { id: 7, name: 'tj', bio: 'Express 作者', color: '#0969da' },
  { id: 8, name: 'ryan', bio: '前端工程师', color: '#6e7781' },
]

// 模拟后端搜索接口（500ms 延迟）
function mockSearch(keyword: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const kw = keyword.trim().toLowerCase()
      if (kw === '') {
        resolve([])
      } else {
        resolve(
          MOCK_USERS.filter((u) => u.name.toLowerCase().includes(kw) || u.bio.toLowerCase().includes(kw)),
        )
      }
    }, 500)
  })
}

// ---------- 防抖 hook（在 02 文件里讲过，这里再写一遍方便单文件阅读） ----------
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

// ---------- 主组件 ----------
export default function SearchDemo() {
  const [input, setInput] = useState('')
  const debouncedKeyword = useDebounce(input, 400) // ⭐ 输入停下 400ms 才更新

  const [results, setResults] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [inputCount, setInputCount] = useState(0) // 输入变化次数
  const [searchCount, setSearchCount] = useState(0) // 实际发起搜索次数

  // 只要 debouncedKeyword 变了，就发起搜索
  useEffect(() => {
    setSearchCount((c) => c + 1)

    const keyword = debouncedKeyword.trim()
    if (keyword === '') {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    let cancelled = false

    mockSearch(debouncedKeyword).then((data) => {
      if (cancelled) return
      setResults(data)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [debouncedKeyword])

  return (
    <div>
      <h3>搜索示例：试试快速输入 "ga"</h3>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setInputCount((c) => c + 1) // 每次输入都 +1
        }}
        placeholder="快速输入几个字母，观察下面两个计数"
        style={{ padding: 6, width: '100%', maxWidth: 320, marginBottom: 10 }}
      />

      <div className="card" style={{ display: 'flex', gap: 24, fontSize: 14 }}>
        <span>
          输入变化：<strong>{inputCount}</strong> 次
        </span>
        <span>
          实际搜索：<strong style={{ color: '#1f883d' }}>{searchCount}</strong> 次
        </span>
      </div>

      <p className="hint">
        👉 快速输入 5 个字母：输入变化 = 5 次，但实际搜索 = 1 次（只搜最后那一下）。
        这就是防抖的价值：<strong>减少无效请求</strong>。
      </p>
      <p className="hint">
        ⚠️ 开发模式下搜索次数可能多算 1 次（StrictMode 会让 effect 多跑一次），生产构建不会。
      </p>

      {/* 三态渲染（Day4 学的） */}
      {loading && <p className="hint">⏳ 搜索中…</p>}
      {!loading && debouncedKeyword.trim() !== '' && results.length === 0 && (
        <p className="hint">没有找到匹配的用户</p>
      )}
      {!loading &&
        results.map((u) => (
          <div key={u.id} className="card" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: u.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {u.name[0].toUpperCase()}
            </div>
            <div>
              <strong>{u.name}</strong>
              <div className="hint">{u.bio}</div>
            </div>
          </div>
        ))}

      <h3>对比：不用防抖会怎样？</h3>
      <div className="card">
        <p>
          把上面代码里的 <code>useDebounce(input, 400)</code> 改成直接用 <code>input</code>，
          然后快速输入 5 个字母：
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>输入变化 5 次 → 实际搜索 <strong>5 次</strong>（每次输入都发请求）</li>
          <li>而且返回顺序不确定（可能先发的后到）→ 竞态问题（Day4 学过）</li>
        </ul>
        <p className="hint">
          ⭐ 这就是为什么真实的搜索框都要防抖：<strong>省流量、省服务器、避免结果错乱</strong>。
        </p>
      </div>
    </div>
  )
}
