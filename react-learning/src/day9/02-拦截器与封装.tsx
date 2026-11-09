// ============================================================
// Day9-2：拦截器与请求封装（封装的核心价值在这一节）
// ============================================================
// 📖 本文件名字对照表
//   InterceptorDemo   拦截器演示（本页 /day9/interceptor）
//   useAuthStore      存登录态的 store（Day8 学的 Zustand，这里正好用上）
//   http              带拦截器的 axios 实例
//   request<T>        最终给业务代码用的封装函数
//   interceptors      拦截器：requests 请求前 / response 响应后
//
// ⭐ 一句话：**拦截器 = 所有请求的公共管道。**
//   加 token、剥 data、401 跳登录、统一报错、记耗时 —— 只写一次，全站生效。

import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'
import { create } from 'zustand'
import { mockAdapter, toFriendlyError } from './mock/mockApi'
import type { Post } from './mock/mockApi'

// ============================================================
// ① 登录态：用 Zustand 存 token（Day8 的知识点在这里派上用场）
// ============================================================
// 为什么不用 useState？因为**拦截器在模块级**，它拿不到组件里的 state。
// 而 store 能在任何地方通过 getState() 读 —— 这正是 Day8 说的"状态住在 React 之外"。

type AuthStore = {
  token: string
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  token: '',
  login: () => set({ token: 'fake-jwt-token-123' }),
  logout: () => set({ token: '' }),
}))

// ============================================================
// ② 带拦截器的实例
// ============================================================
const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: mockAdapter,
})

// ---- 请求拦截器：发出去之前 ----
http.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState() // ⭐ 从 store 读，不用传参
  if (token !== '') {
    config.headers.Authorization = `Bearer ${token}`
  }
  ;(config as unknown as { _start: number })._start = Date.now()
  return config
})

// ---- 响应拦截器：成功时剥一层 data，失败时统一处理 ----
http.interceptors.response.use(
  (response) => {
    // ⭐ 这里返回什么，业务代码的 await 就拿到什么
    //    返回 response.data → 调用方直接拿到数据，不用写 .data
    return response.data
  },
  (error: AxiosError) => {
    // ⭐ 401 统一处理：清掉登录态（真实项目里还要跳登录页）
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

// ============================================================
// ③ 最终给业务代码用的封装函数
// ============================================================
// 注意返回类型：T 直接是"数据"的类型，不再是 AxiosResponse<T>
export async function request<T>(url: string): Promise<T> {
  // 因为响应拦截器已经剥了 data，这里的返回类型要手动声明一下
  return (await http.get(url)) as unknown as T
}

// ============================================================
// 演示
// ============================================================
export default function InterceptorDemo() {
  const token = useAuthStore((s) => s.token)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  const [log, setLog] = useState<string[]>([])
  const [result, setResult] = useState('')
  const push = (s: string) => setLog((l) => [s, ...l].slice(0, 6))

  const call = async (label: string, url: string) => {
    push(`→ ${label}　GET ${url}　token=${token === '' ? '(空)' : '已带'}`)
    try {
      const posts = await request<Post[]>(url)
      setResult(`✅ ${label}：拿到 ${posts.length} 条`)
      push(`← ${label}　成功，${posts.length} 条`)
    } catch (err) {
      const f = toFriendlyError(err)
      setResult(`❌ ${label}：${f.message}`)
      push(`← ${label}　失败：${f.message}（status ${f.status ?? '-'}）`)
    }
  }

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>当前登录态</h3>
        <p style={{ marginTop: 0 }}>
          token：<code>{token === '' ? '(空)' : token}</code>{' '}
          <button className="btn" style={{ marginLeft: 8 }} onClick={login}>
            登录
          </button>
          <button className="btn-ghost" style={{ marginLeft: 6 }} onClick={logout}>
            登出
          </button>
        </p>
        <p className="hint" style={{ marginBottom: 0 }}>
          👆 <strong>先不登录点下面的「需要登录的接口」</strong> → 拦截器没 token → 后端返回 401
          → 响应拦截器自动清掉登录态。<strong>然后再点「登录」，再请求一次</strong> → 成功。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>发请求（注意：调用方没有写 .data、没有写 if 401）</h3>
        <button className="btn" style={{ marginRight: 8 }} onClick={() => call('需要登录', '/posts?_auth=1')}>
          需要登录的接口
        </button>
        <button className="btn-ghost" style={{ marginRight: 8 }} onClick={() => call('公开接口', '/posts')}>
          公开接口
        </button>
        <button className="btn-ghost" onClick={() => call('服务器 500', '/posts?_status=500')}>
          服务器 500
        </button>
        <p style={{ marginTop: 10, marginBottom: 0 }}>
          {result !== '' && <strong>{result}</strong>}
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>拦截器日志（最新在上）</h3>
        {log.length === 0 ? (
          <p className="hint">（点上面的按钮）</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {log.map((l, i) => (
              <li key={i} style={{ fontSize: 13 }}>
                <code>{l}</code>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>这三段代码，你应该能背下来结构</h3>
        <pre
          style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, fontSize: 12, overflowX: 'auto', margin: '8px 0' }}
        >{`// 1) 实例：域名/超时只写一次
const http = axios.create({ baseURL: '/api', timeout: 10000 })

// 2) 请求拦截器：自动带 token
http.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config              // ⚠️ 必须 return config，忘了等于把请求吞了
})

// 3) 响应拦截器：剥 data + 统一错误
http.interceptors.response.use(
  (res) => res.data,                              // 成功：只把数据给调用方
  (error) => {                                    // 失败：这里统一处理
    if (error.response?.status === 401) useAuthStore.getState().logout()
    return Promise.reject(error)                  // ⚠️ 必须继续 reject
  },
)

// 4) 业务代码：干净得只剩"拿什么"
const posts = await request<Post[]>('/posts')`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>两个致命错误</strong>：① 请求拦截器忘了 <code>return config</code> → 所有请求变 undefined；
          ② 响应拦截器忘了 <code>Promise.reject</code> → 错误被吞掉，页面永远停在 loading。
        </p>
      </div>
    </div>
  )
}

/* ============================================================
 * 为什么"剥 data"要放在响应拦截器里
 * ============================================================
 * 不剥：每个调用点都要写 res.data.title
 * 剥了：直接 post.title
 *
 * 代价：TypeScript 的类型会变复杂（http.get 声明返回 AxiosResponse<T>，
 *      但运行时你拿到的是 T）。所以封装函数里要做一次类型断言：
 *          return (await http.get(url)) as unknown as T
 *      这个"断言"不是偷懒 —— 它是"我改造了 axios 的返回结构"的如实声明。
 *      更严谨的写法是自定义一个 AxiosInstance 类型，让 get 直接返回 Promise<T>。
 * ============================================================ */
