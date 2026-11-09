// ============================================================
// Day9-1：axios 基础 + 错误分类（把 4 种错误都撞一遍）
// ============================================================
// 📖 本文件名字对照表
//   AxiosBasics   axios 基础（本页 /day9/basics）
//   api           配置好的 axios 实例（mock/mockApi.ts）
//   toFriendlyError  把 axios 错误翻成人话 + 分类
//   loading / data / error   一个真实请求的三种状态
//
// ⭐ 本节最该记住的一句：
//   **axios 遇到 4xx / 5xx 会直接抛错（进 catch），而 fetch 不会。**
//   所以 axios 的 catch 里既有"网络挂了"，也有"服务器返回了 500" —— 必须能分清。

import { useState } from 'react'
import { api, toFriendlyError } from './mock/mockApi'
import type { FriendlyError, Post } from './mock/mockApi'

type State = {
  loading: boolean
  data: Post[] | null
  error: FriendlyError | null
}

const EMPTY_STATE: State = { loading: false, data: null, error: null }

export default function AxiosBasics() {
  const [state, setState] = useState<State>(EMPTY_STATE)
  const [lastUrl, setLastUrl] = useState('')

  const load = async (query: string) => {
    setLastUrl(`/api/posts${query}`)
    setState({ loading: true, data: null, error: null })
    try {
      const res = await api.get<Post[]>(`/posts${query}`)
      setState({ loading: false, data: res.data, error: null })
    } catch (err) {
      // ⚠️ 注意：4xx / 5xx / 断网 / 取消 全都进这里
      setState({ loading: false, data: null, error: toFriendlyError(err) })
    }
  }

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>点不同的按钮，看同一个请求的 4 种结果</h3>
        <p style={{ marginTop: 0 }}>
          {[
            ['成功（8 条）', ''],
            ['空数据', '?_empty=1'],
            ['500 服务器错误', '?_status=500'],
            ['401 未登录', '?_status=401'],
            ['404 不存在', '?_status=404'],
            ['断网', '?_network=1'],
            ['慢 1.5 秒（看 loading）', '?_delay=1500'],
          ].map(([label, q]) => (
            <button key={label} className="btn-ghost" style={{ marginRight: 6, marginBottom: 6 }} onClick={() => load(q)}>
              {label}
            </button>
          ))}
        </p>
        {lastUrl !== '' && (
          <p className="hint" style={{ marginBottom: 0 }}>
            实际请求：<code>{lastUrl}</code>
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>结果区（这就是“三态”的写法）</h3>
        {state.loading && <p style={{ color: '#57606a' }}>⏳ 加载中……（慢 1.5 秒那个按钮能看清）</p>}

        {state.error !== null && (
          <p style={{ color: '#cf222e' }}>
            ❌ {state.error.message}　
            <span style={{ color: '#8b949e', fontSize: 13 }}>
              （kind = <code>{state.error.kind}</code>
              {state.error.status !== undefined && <>，status = {state.error.status}</>}）
            </span>
          </p>
        )}

        {state.data !== null && state.data.length === 0 && (
          <p style={{ color: '#8b949e' }}>📭 请求成功，但是没有数据（empty ≠ error）</p>
        )}

        {state.data !== null && state.data.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {state.data.map((p) => (
              <li key={p.id}>
                {p.title}　<span style={{ color: '#8b949e', fontSize: 13 }}>{p.body}</span>
              </li>
            ))}
          </ul>
        )}

        {!state.loading && state.error === null && state.data === null && (
          <p className="hint" style={{ marginBottom: 0 }}>
            点上面任意一个按钮试试。
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⭐ 错误分类表（这张表就是 catch 里的 if-else）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>情况</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>err.code</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>err.response</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>给用户说什么</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['断网 / 跨域', 'ERR_NETWORK', '无（undefined）', '网络异常，请检查网络'],
              ['4xx 客户端', 'ERR_BAD_REQUEST', '有，status 4xx', '401 登录过期 / 404 数据不存在'],
              ['5xx 服务端', 'ERR_BAD_RESPONSE', '有，status 5xx', '服务器出错了，请稍后再试'],
              ['超时', 'ECONNABORTED', '无', '请求超时'],
              ['主动取消', 'ERR_CANCELED', '无', '不用提示（不是错误）'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{b}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{c}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>判断顺序很重要</strong>：先看 <code>err.code</code>（网络/超时/取消都没有 response），
          再在 <code>err.response.status</code> 里分 4xx / 5xx。
          <code>toFriendlyError()</code> 就是按这个顺序写的，你可以去 <code>mock/mockApi.ts</code> 看。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>顺带：两个必会的写法</h3>
        <pre
          style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, fontSize: 13, overflowX: 'auto', margin: '8px 0' }}
        >{`// ① GET 带参数：params 比手拼字符串安全（自动编码中文/特殊字符）
await api.get('/posts', { params: { keyword: 'React', page: 2 } })
// 实际变成 /posts?keyword=React&page=2

// ② POST 带 body：第二个参数是 body，第三个才是配置
await api.post('/posts', { title: '新文章' }, { timeout: 3000 })

// ③ TypeScript 泛型：告诉 axios "data 长什么样"
const res = await api.get<Post[]>('/posts')   // res.data 是 Post[]`}</pre>
      </div>
    </div>
  )
}

/* ============================================================
 * 三个高频坑
 * ============================================================
 * 1. 只写 .then 不写 .catch → 500 的时候页面直接白屏，控制台一堆红
 * 2. catch 里不区分情况 → 服务器 500 也提示"网络异常"，排查时误导自己
 * 3. finally 里 setLoading(false) → 竞态时会把新请求的 loading 关掉
 *    （第 4 节会专门讲这个）
 * ============================================================ */
