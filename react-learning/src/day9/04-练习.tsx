// ============================================================
// Day9-4：你的练习
// ============================================================
// 📖 本文件名字对照表
//   PracticeDay9   今天的练习页（/day9/practice）
//   ThreeStateList 练习 1：三态列表
//   request2       练习 2：你自己封装的请求函数
//   SearchBox      练习 3：搜索 + 取消
//
// 规则：补完 TODO → 保存 → 浏览器看效果
// 每个练习 20 分钟左右；卡住看文件底部的答案，隔一晚闭卷重写

import { useEffect, useState } from 'react'
import axios from 'axios'
import { api, mockAdapter, toFriendlyError } from './mock/mockApi'
import type { Post } from './mock/mockApi'

// ============================================================
// 练习 1 ⭐：把三态补完
// ============================================================
// 要求：补完 load 函数，让下面三个按钮分别显示
//   ① 正常 8 条　② 空数据提示　③ 错误提示
// 提示：try / catch / toFriendlyError；loading 记得两头都要改
// ------------------------------------------------------------
function ThreeStateList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Post[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async (query: string) => {
    // TODO 1-a：开始请求 → setLoading(true)、setError(null)
    // TODO 1-b：成功 → setData(res.data)
    // TODO 1-c：失败 → setError(toFriendlyError(err).message)
    // TODO 1-d：不管成功失败，最后都要 setLoading(false)
    void query
    void api
  }

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        <button className="btn-ghost" style={{ marginRight: 6 }} onClick={() => load('')}>
          正常
        </button>
        <button className="btn-ghost" style={{ marginRight: 6 }} onClick={() => load('?_empty=1')}>
          空数据
        </button>
        <button className="btn-ghost" onClick={() => load('?_status=500')}>
          服务器 500
        </button>
      </p>
      {loading && <p>⏳ 加载中……</p>}
      {error !== null && <p style={{ color: '#cf222e' }}>❌ {error}</p>}
      {data !== null && data.length === 0 && <p style={{ color: '#8b949e' }}>📭 还没有内容</p>}
      {data !== null && data.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {data.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
      {!loading && error === null && data === null && <p className="hint">（点个按钮试试）</p>}
    </div>
  )
}

// ============================================================
// 练习 2 ⭐⭐：自己封装一个 request
// ============================================================
// 要求：
//   a) 给 http2 加**请求拦截器**：从 localStorage 读 token，有就带 Authorization
//   b) 给 http2 加**响应拦截器**：成功时返回 response.data；失败时继续 reject
//   c) 做完之后 request2 返回的就是**数据本身**，不是 AxiosResponse
// ------------------------------------------------------------

const http2 = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: mockAdapter, // 假后端，别改
})

// TODO 2-a / 2-b：在这里加两个拦截器

async function request2<T>(url: string): Promise<T> {
  // TODO 2-c：做完拦截器后，这里就能直接拿到 data
  return (await http2.get(url)) as unknown as T
}

function RequestDemo() {
  const [msg, setMsg] = useState('')
  const call = async () => {
    const posts = await request2<Post[]>('/posts')
    // 做完 2-b 之前，posts 其实是整个 AxiosResponse，posts.length 会是 undefined
    setMsg(
      Array.isArray(posts)
        ? `✅ 拿到数组，${posts.length} 条`
        : `⚠️ 拿到的不是数组：${Object.keys(posts ?? {}).join(',')}（说明拦截器还没剥 data）`,
    )
  }
  return (
    <div className="card">
      <button className="btn" onClick={call}>
        用 request2 请求
      </button>
      {msg !== '' && <p style={{ marginBottom: 0 }}>{msg}</p>}
    </div>
  )
}

// ============================================================
// 练习 3 ⭐⭐⭐（挑战）：搜索框 + 取消（今天最重要的一题）
// ============================================================
// 要求：
//   a) 输入框变化 → 请求 /posts?_keyword=xx&_delay=300
//   b) 用 AbortController：新请求发出前取消旧的（写在 effect 的 cleanup 里）
//   c) catch 里忽略 ERR_CANCELED
//   d) 让显示结果**永远对应输入框里的内容**
//   e)（加分）再叠一层 Day5 的 useDebounce，减少请求次数
// ------------------------------------------------------------

function SearchBox() {
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (keyword.trim() === '') {
      setResult('')
      setError(null)
      return
    }
    // TODO 3-a ~ 3-c：建 AbortController、传 signal、cleanup 里 abort
    //                 （提示：结构见 03-竞态与取消.tsx 的"治法就三行"）
    setLoading(true)
    void api
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  return (
    <div className="card">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="试试快速输入 React / key / 请求"
        style={{ padding: 6, width: 260 }}
      />
      {loading && <p>⏳ 搜索中……</p>}
      {error !== null && <p style={{ color: '#cf222e' }}>❌ {error}</p>}
      {result !== '' && (
        <p style={{ marginBottom: 0 }}>
          「{keyword}」的结果：{result}
        </p>
      )}
      {result === '' && error === null && !loading && keyword !== '' && (
        <p className="hint">（还没实现，先看 TODO）</p>
      )}
      <p className="hint" style={{ marginBottom: 0 }}>
        TODO 没做完之前，这里不会有结果。
      </p>
    </div>
  )
}

// ============================================================
// 展示区（不用改）
// ============================================================
export default function PracticeDay9() {
  return (
    <div>
      <h2>练习 1 ⭐：三态</h2>
      <ThreeStateList />

      <h2>练习 2 ⭐⭐：自己封装 request</h2>
      <RequestDemo />

      <h2>练习 3 ⭐⭐⭐：搜索 + 取消</h2>
      <SearchBox />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   const load = async (query: string) => {
 *     setLoading(true)
 *     setError(null)
 *     setData(null)                       // 可选：清掉旧数据，避免"旧内容+新 loading"
 *     try {
 *       const res = await api.get<Post[]>(`/posts${query}`)
 *       setData(res.data)
 *     } catch (err) {
 *       setError(toFriendlyError(err).message)
 *     } finally {
 *       setLoading(false)                 // 成功失败都要关 —— 这一句最容易漏
 *     }
 *   }
 *
 * 练习 2：
 *   http2.interceptors.request.use((config) => {
 *     const token = localStorage.getItem('token')
 *     if (token) config.headers.Authorization = `Bearer ${token}`
 *     return config                        // ⚠️ 必须 return
 *   })
 *
 *   http2.interceptors.response.use(
 *     (res) => res.data,                    // ⭐ 剥掉一层，调用方直接拿数据
 *     (err) => Promise.reject(err),         // ⚠️ 必须继续 reject
 *   )
 *
 *   // 做完这两个，request2 里的 as unknown as T 就成真了
 *   // 没做之前：posts 是整个 { data, status, headers, config } 对象
 *
 * 练习 3：
 *   useEffect(() => {
 *     const kw = keyword.trim()
 *     if (kw === '') {
 *       setResult('')
 *       setError(null)
 *       return
 *     }
 *     const controller = new AbortController()
 *     setLoading(true)
 *     setError(null)
 *
 *     api
 *       .get<Post[]>(`/posts?_keyword=${kw}&_delay=300`, { signal: controller.signal })
 *       .then((res) => {
 *         setResult(res.data.length === 0 ? '0 条' : res.data.map((p) => p.title).join('、'))
 *         setLoading(false)
 *       })
 *       .catch((err) => {
 *         if (err?.code === 'ERR_CANCELED') return    // 取消不是错误
 *         setError(toFriendlyError(err).message)
 *         setLoading(false)
 *       })
 *
 *     return () => controller.abort()                 // ⭐ 核心就这一行
 *   }, [keyword])
 *
 *   // 加分：防抖
 *   const debounced = useDebounce(keyword, 300)      // Day5 写的那个 hook
 *   useEffect(() => { ... }, [debounced])
 *   → 防抖管"请求次数"，abort 管"响应顺序"，两个一起上才是完整答案。
 *
 * 【三个自问】
 * 1. 练习 1 里为什么 finally 可以放 setLoading(false)，而第 3 节说不能？
 *    答：练习 1 是"用户手动点按钮"，每次点击都是新的一次，没有互相覆盖的关系。
 *        第 3 节是"输入框每次变化都发请求"，被取消的请求如果也跑 finally，
 *        就会把新请求的 loading 关掉 —— 场景不同，写法也不同。
 *
 * 2. 练习 2 里拦截器返回 res.data，那 res.status 就没了，需要状态码怎么办？
 *    答：常见做法是"业务约定"—— HTTP 层错误交给 reject 处理（error.response.status），
 *        只有成功时才剥 data。真实项目里有些团队不剥，调用方写 res.data，也对。
 *        关键是**团队统一**，别一半剥一半不剥。
 *
 * 3. 为什么不给每个请求都写 signal，只在需要的地方写？
 *    答：signal 的成本是"要记着 abort"。凡是"由状态驱动、可能连续变化"的请求
 *        （搜索、切换 tab、翻页）都必须写；一次性的提交请求不需要。
 * ============================================================ */
