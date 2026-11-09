// ============================================================
// mockApi.ts：一个"假后端"（用 axios 的自定义 adapter 实现）
// ============================================================
// 📖 本文件名字对照表
//   mockApi       假后端（不发真实网络请求，数据在本地）
//   mockAdapter   axios 的"传输层"，替换掉真实的 XHR/fetch
//   POSTS         假数据（8 篇文章）
//   sleep         假的网络延迟
//   api           配置好的 axios 实例（baseURL = /api）
//
// ⚠️ 为什么不直接请求真实接口？
//   1. 你需要能在"错"的状态下调试：500、没网、空数据、超慢、乱序
//      真实接口不会配合你，而且你没法重现
//   2. 离线也能练
//   3. 真实项目里我们用 msw（Mock Service Worker）做同样的事，
//      这里用一个简化的 adapter，让你看到"拦截器/三态/取消"全是真代码路径
//
// ⭐ 关键：除了"网络传输"这一层是假的，**其他全是真的**
//   请求拦截器、响应拦截器、错误对象、AbortSignal 取消、并发 —— 都真的在跑

import axios, { AxiosError, CanceledError } from 'axios'
import type { AxiosAdapter, AxiosResponse } from 'axios'

export type Post = {
  id: number
  title: string
  body: string
}

export const POSTS: Post[] = [
  { id: 1, title: 'React 的单向数据流', body: '数据往下，事件往上……' },
  { id: 2, title: '为什么 key 不能用 index', body: '列表重排时 React 会认错……' },
  { id: 3, title: '依赖数组到底写什么', body: '写 effect 里读过的变量……' },
  { id: 4, title: 'Context 不是状态管理', body: '它只是传值管道……' },
  { id: 5, title: 'Zustand 为什么快', body: 'selector + Object.is……' },
  { id: 6, title: '路由切换 = 卸载 + 挂载', body: '状态会消失……' },
  { id: 7, title: '请求的三态', body: 'loading / error / 空数据……' },
  { id: 8, title: '竞态是什么', body: '旧请求覆盖新结果……' },
]

// 假的网络延迟（还能被 AbortSignal 打断）
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new CanceledError('canceled'))
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new CanceledError('canceled'))
    })
  })
}

// ============================================================
// ⭐ 核心：adapter = "谁来发这个请求"
// ============================================================
// 返回值必须是 { data, status, statusText, headers, config }，
// 出错时要 throw AxiosError —— 和真实 adapter 一模一样。
//
// 支持的开关（都写在 url 的查询参数里）：
//   ?_delay=800    延迟 800ms
//   ?_status=500   返回 500（也可以 401 / 404）
//   ?_empty=1      返回空数组
//   ?_network=1    模拟断网（没有 response）
//   ?_keyword=xx   只返回标题含 xx 的文章
export const mockAdapter: AxiosAdapter = async (config) => {
  const url = config.url ?? ''
  const query = new URLSearchParams(url.split('?')[1] ?? '')

  await sleep(Number(query.get('_delay') ?? 0), config.signal as AbortSignal | undefined)

  // ① 断网：没有 response，只有 error
  if (query.get('_network') === '1') {
    throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config)
  }

  // ② 造数据
  let status = Number(query.get('_status') ?? 200)

  // 需要登录的接口：没有 Authorization 头就 401（第 3 节演示用）
  if (query.get('_auth') === '1') {
    const headers = config.headers as Record<string, unknown> | undefined
    if (!headers || headers.Authorization === undefined) {
      status = 401
    }
  }

  const keyword = query.get('_keyword') ?? ''
  let data: unknown = query.get('_empty') === '1' ? [] : POSTS
  if (keyword !== '') {
    data = (data as Post[]).filter((p) => p.title.includes(keyword))
  }

  const response: AxiosResponse = {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {},
    config: config as never,
  }

  // ③ 4xx / 5xx：真实 adapter 在这一步就抛错了（axios 不会把错误状态码当成功）
  if (status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${status}`,
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    )
  }

  return response
}

// ============================================================
// 预配置好的实例（真实项目里这行会很长：baseURL、超时、withCredentials…）
// ============================================================
export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: mockAdapter, // ⚠️ 只有这一行是"假的"，其他都是真的 axios
})

// ============================================================
// 把 axios 的错误翻译成人话（这个函数在真实项目里几乎一定会写）
// ============================================================
export type FriendlyError = {
  /** 给用户看的一句话 */
  message: string
  /** 给代码判断的：网络 / 4xx / 5xx / 取消 / 超时 */
  kind: 'network' | 'client' | 'server' | 'canceled' | 'timeout' | 'unknown'
  status?: number
}

export function toFriendlyError(err: unknown): FriendlyError {
  if (!axios.isAxiosError(err)) {
    return { message: '未知错误', kind: 'unknown' }
  }
  const status = err.response?.status
  switch (err.code) {
    case AxiosError.ERR_CANCELED:
      return { message: '请求已取消', kind: 'canceled' }
    case AxiosError.ECONNABORTED:
    case AxiosError.ETIMEDOUT:
      return { message: '请求超时，请检查网络', kind: 'timeout' }
    case AxiosError.ERR_NETWORK:
      return { message: '网络异常（断网或被跨域拦截）', kind: 'network' }
    default:
      if (status === 401) return { message: '登录已过期，请重新登录', kind: 'client', status }
      if (status === 403) return { message: '没有权限', kind: 'client', status }
      if (status === 404) return { message: '数据不存在', kind: 'client', status }
      if (status !== undefined && status >= 500) {
        return { message: '服务器出错了，请稍后再试', kind: 'server', status }
      }
      if (status !== undefined) return { message: '请求失败', kind: 'client', status }
      return { message: err.message, kind: 'unknown' }
  }
}
