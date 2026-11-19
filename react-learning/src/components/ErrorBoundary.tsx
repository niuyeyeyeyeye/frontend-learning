// ============================================================
// components/ErrorBoundary.tsx —— 可复用的错误边界
// ============================================================
// 📖 名字对照
//   ErrorBoundary   错误边界
//   fallback        出错时显示什么（ReactNode 或函数）
//   resetKeys       这些值一变就自动"重试"（比如路由变了、请求参数变了）
//   onReset         点"重试"时的额外回调
//
// ⭐ 你不需要会写 class 组件 —— 但这段代码需要 class，因为 React 没有 hook 版。
//   真实项目里就把它当一个黑盒工具用：import 进来包住可能出事的区域。
//   面试前再回来看这 30 行，讲清两个生命周期就够了。

import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** 出错时显示什么。给函数可以拿到 error 和 reset */
  fallback?:
    | ReactNode
    | ((error: Error, reset: () => void) => ReactNode)
  /** 这些值任意一个变化 → 自动重置（常用：路由 pathname、列表的查询参数） */
  resetKeys?: unknown[]
  /** 重置时的额外动作（比如让父组件把"故障源"也复位） */
  onReset?: () => void
  /** 上报错误（Sentry / 自己的埋点） */
  onError?: (error: Error, info: ErrorInfo) => void
}

type State = {
  error: Error | null
  /** 上一轮的 resetKeys，用来比较 */
  prevKeys: unknown[] | undefined
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, prevKeys: this.props.resetKeys }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  // ⭐ resetKeys 变化时自动恢复：不用外面手动调 reset
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (state.error !== null && props.resetKeys !== undefined) {
      const changed =
        state.prevKeys === undefined ||
        props.resetKeys.length !== state.prevKeys.length ||
        props.resetKeys.some((k, i) => !Object.is(k, state.prevKeys?.[i]))
      if (changed) return { error: null, prevKeys: props.resetKeys }
    }
    return props.resetKeys === state.prevKeys ? null : { prevKeys: props.resetKeys }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError } = this.props
    if (onError) {
      onError(error, info)
      return
    }
    // 默认行为：打到控制台（真实项目这里换成 Sentry.captureException）
    console.error('[ErrorBoundary] 接住一个渲染错误：', error.message)
    console.error('[ErrorBoundary] 出事组件栈：', info.componentStack)
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error === null) return children

    if (typeof fallback === 'function') return fallback(error, this.reset)
    if (fallback !== undefined) return fallback

    // 没给 fallback 时的默认兜底 UI
    return (
      <div
        role="alert"
        style={{
          border: '1px solid #cf222e',
          borderRadius: 6,
          padding: 12,
          background: '#fff5f5',
        }}
      >
        <strong style={{ color: '#cf222e' }}>⚠️ 这块区域出错了</strong>
        <p style={{ margin: '6px 0', fontSize: 13 }}>
          <code>{error.message}</code>
        </p>
        <button className="btn-ghost" onClick={this.reset}>
          重试
        </button>
      </div>
    )
  }
}
