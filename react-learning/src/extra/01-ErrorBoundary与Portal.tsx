// ============================================================
// 补课-1：ErrorBoundary（错误边界）+ createPortal（传送门）
// ============================================================
// 📖 本文件名字对照表
//   ErrorBoundary     错误边界（React 唯一必须用 class 写的 API）
//   getDerivedStateFromError  渲染阶段：把"出错了"变成 state
//   componentDidCatch 提交阶段：做副作用（上报日志 / 埋点）
//   fallback          出问题时显示什么
//   createPortal      把子节点"传送"到另一个 DOM 位置（通常 document.body）
//
// ⭐ 为什么今天先学这两个：
//   做任何真实项目，第一周就会撞上——「弹窗被裁掉」和「一个组件崩了整页白屏」。
//   它们不是"进阶技巧"，是**基建**。

import { Component, lazy, Suspense, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createPortal } from 'react-dom'

// ============================================================
// 一、ErrorBoundary：React 唯一必须用 class 写的 API
// ============================================================
// 为什么不能是 hook？因为 React 没有提供 useErrorBoundary。
// 它靠两个"只有 class 才有"的生命周期工作：
//   static getDerivedStateFromError(error)  渲染阶段，负责把错误变成 state（返回新 state）
//   componentDidCatch(error, info)          提交阶段，负责做副作用（上报 Sentry / 打日志）

type BoundaryProps = {
  children: ReactNode
  /** 出问题时显示什么（拿到 error 和一个 reset 函数） */
  fallback: (error: Error, reset: () => void) => ReactNode
  /** 点"重试"时，除了清掉边界状态，还要通知外面把"故障源"也复位 */
  onReset?: () => void
}

type BoundaryState = { error: Error | null }

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 真实项目里这里一般是 Sentry.captureException(error, { extra: info })
    console.error('[ErrorBoundary] 接住一个渲染错误：', error.message)
    console.error('[ErrorBoundary] 出事组件栈：', info.componentStack)
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error !== null) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}

// 一个会炸的组件
function Bomb({ explode }: { explode: boolean }) {
  if (explode) {
    throw new Error('💥 我在渲染的时候抛错了')
  }
  return <span style={{ color: '#1f883d' }}>✅ 子组件正常渲染</span>
}

function Demo1() {
  const [explode, setExplode] = useState(false)
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 1：一个组件崩了，整页不该跟着崩</h3>
      <p style={{ marginTop: 0 }}>
        <button className="btn" onClick={() => setExplode(true)}>
          让子组件崩
        </button>
      </p>

      {/* ⭐ 边界只包住"可能出事的区域"，不是包住整个应用 */}
      <ErrorBoundary
        onReset={() => setExplode(false)}
        fallback={(error, reset) => (
          <div
            style={{
              border: '1px solid #cf222e',
              borderRadius: 6,
              padding: 10,
              background: '#fff5f5',
            }}
          >
            <strong style={{ color: '#cf222e' }}>⚠️ 这块区域崩了</strong>
            <p style={{ margin: '6px 0', fontSize: 13 }}>
              <code>{error.message}</code>
            </p>
            <button className="btn-ghost" onClick={reset}>
              重试
            </button>
            <p className="hint" style={{ marginBottom: 0 }}>
              注意：只有这一块变成了红色兜底 UI，
              <strong>上面的导航、别的内容都还在</strong>。这就是错误边界的意义。
            </p>
          </div>
        )}
      >
        <Bomb explode={explode} />
      </ErrorBoundary>

      <p className="hint" style={{ marginBottom: 0 }}>
        点「让子组件崩」→ 看这块变红，但整页没白屏 → 再点「重试」恢复。
      </p>
    </div>
  )
}

// ============================================================
// 二、⭐ ErrorBoundary 接不住什么（面试最常问的一句）
// ============================================================
function Demo2() {
  const [log, setLog] = useState<string[]>([])
  const push = (s: string) => setLog((l) => [s, ...l].slice(0, 5))

  const throwInEvent = () => {
    push('① 事件处理里抛错了 —— 边界接不住，控制台会红')
    throw new Error('事件处理里的错误')
  }

  const throwInTimer = () => {
    push('② 定时器里抛错了 —— 边界接不住')
    setTimeout(() => {
      throw new Error('定时器里的错误')
    }, 0)
  }

  const rejectPromise = () => {
    push('③ Promise 里 reject —— 边界接不住（要做成 .catch 或 try/await 处理）')
    void Promise.reject(new Error('Promise 里的错误'))
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 2：这三种错误，边界**接不住**</h3>
      <p style={{ marginTop: 0 }}>
        <button className="btn-ghost" style={{ marginRight: 6 }} onClick={throwInEvent}>
          ① onClick 里 throw
        </button>
        <button className="btn-ghost" style={{ marginRight: 6 }} onClick={throwInTimer}>
          ② setTimeout 里 throw
        </button>
        <button className="btn-ghost" onClick={rejectPromise}>
          ③ Promise.reject
        </button>
      </p>
      <p className="hint">
        👆 点任意一个：<strong>页面不会变成兜底 UI</strong>（因为边界管不到），
        只会在 F12 控制台留下红字。这就是「错误边界只管"渲染期间"的同步错误」。
      </p>
      {log.length > 0 && (
        <ul style={{ margin: '0 0 8px', paddingLeft: 20, fontSize: 13 }}>
          {log.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#57606a' }}>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>错误发生的位置</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>边界接得住吗</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['渲染期间 throw（含 class 生命周期）', '✅ 接得住'],
            ['lazy 加载失败（也是在渲染时 throw）', '✅ 接得住'],
            ['事件处理 onClick / onSubmit 里 throw', '❌ 接不住'],
            ['setTimeout / setInterval 里 throw', '❌ 接不住'],
            ['Promise.reject / async 里 throw', '❌ 接不住'],
            ['服务端渲染（SSR）期间', '❌ 不生效'],
          ].map(([a, b]) => (
            <tr key={a}>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>那事件/异步里的错误怎么办？</strong>自己 try/catch，然后 setState 让组件显示错误 UI。
        边界是"兜底"，不是"万能"。
      </p>
    </div>
  )
}

// ============================================================
// 三、createPortal：把弹窗"传送"出去
// ============================================================
// 问题：弹窗写在某个容器里，容器有 overflow:hidden → 弹窗被裁掉
// 解法：createPortal(node, document.body) —— DOM 上挂到 body，但 React 树上还在原位
//      → 不受父容器样式限制，同时还能用父组件的 state / context

function Modal({ onClose, usePortal }: { onClose: () => void; usePortal: boolean }) {
  const node = (
    <div
      style={{
        position: usePortal ? 'fixed' : 'absolute',
        top: usePortal ? 0 : 16,
        left: usePortal ? 0 : 16,
        right: usePortal ? 0 : 'auto',
        bottom: usePortal ? 0 : 'auto',
        width: usePortal ? 'auto' : 180,
        height: usePortal ? 'auto' : 130,
        background: usePortal ? 'rgba(0,0,0,.45)' : '#fff',
        border: '2px solid #0969da',
        borderRadius: 8,
        padding: 12,
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        color: usePortal ? '#fff' : '#1f2328',
        fontSize: 13,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {usePortal ? '🌐 我挂在 document.body 上' : '📦 我留在这个容器里'}
        <br />
        <button className="btn-ghost" style={{ marginTop: 6 }} onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  )

  if (!usePortal) return node
  // ⚠️ SSR 安全：服务端没有 document
  if (typeof document === 'undefined') return null
  return createPortal(node, document.body)
}

function Demo3() {
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  const box: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    height: 90,
    border: '2px dashed #8b949e',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 3：为什么弹窗"突然"被裁掉了一半</h3>

      <div style={box}>
        外层容器：<code>overflow: hidden; height: 90px</code>
        <br />
        <button className="btn-ghost" style={{ marginTop: 6 }} onClick={() => setShowLeft(true)}>
          ❌ 打开弹窗（不用 Portal）
        </button>
        {showLeft && <Modal usePortal={false} onClose={() => setShowLeft(false)} />}
      </div>

      <div style={box}>
        同一个容器
        <br />
        <button className="btn-ghost" style={{ marginTop: 6 }} onClick={() => setShowRight(true)}>
          ✅ 打开弹窗（用 Portal）
        </button>
        {showRight && <Modal usePortal onClose={() => setShowRight(false)} />}
      </div>

      <p className="hint" style={{ marginBottom: 0 }}>
        👆 左边那个被容器<strong>裁掉了下半部分</strong>（因为 `overflow: hidden`）；
        右边那个挂到了 <code>document.body</code> 上，<strong>完整显示</strong>。
        <br />
        <strong>关键点：</strong>Portal 只改变"DOM 挂在哪"，不改 React 树的位置 ——
        所以弹窗里依然能拿到父组件的 state、Context、路由。
      </p>
    </div>
  )
}

// ============================================================
// 四、两者结合：懒加载失败 → 错误边界兜底
// ============================================================
// 这是 Day10 留的尾巴：lazy 的 chunk 下载失败（弱网/改版后旧 chunk 404）
// 会导致渲染时 throw → 正好是 ErrorBoundary 能接住的场景

const BrokenChunk = lazy(
  () =>
    new Promise<{ default: () => ReactNode }>((_, reject) => {
      // 300ms 后失败，让你能先看到 Suspense 的 fallback
      setTimeout(() => reject(new Error('chunk 下载失败（模拟弱网/旧版本缓存）')), 300)
    }),
)

function Demo4() {
  const [show, setShow] = useState(false)

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 4：懒加载失败，谁能接住？</h3>
      <p style={{ marginTop: 0 }}>
        <button className="btn" onClick={() => setShow(true)}>
          加载一个"一定会失败"的懒加载组件
        </button>
      </p>

      <ErrorBoundary
        fallback={(error, reset) => (
          <div style={{ border: '1px solid #bf8700', borderRadius: 6, padding: 10, background: '#fff8c5' }}>
            <strong style={{ color: '#9a6700' }}>⚠️ 模块加载失败</strong>
            <p style={{ margin: '6px 0', fontSize: 13 }}>
              <code>{error.message}</code>
            </p>
            <button
              className="btn-ghost"
              onClick={() => {
                reset()
                setShow(false)
              }}
            >
              重试
            </button>
            <p className="hint" style={{ marginBottom: 0 }}>
              真实项目里这就是「网络异常，请点击重试」——而且<strong>不用白屏</strong>。
            </p>
          </div>
        )}
      >
        <Suspense fallback={<p style={{ color: '#8b949e' }}>⏳ 正在下载模块……</p>}>
          {show && <BrokenChunk />}
        </Suspense>
      </ErrorBoundary>

      <p className="hint" style={{ marginBottom: 0 }}>
        点按钮 → 先看到「⏳ 正在下载模块」，300ms 后变成黄色的兜底 UI。
        <strong>如果没有 ErrorBoundary，这里会白屏。</strong>
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function ErrorBoundaryAndPortal() {
  return (
    <div>
      <h2>1. ErrorBoundary：别让一个组件崩掉整页</h2>
      <Demo1 />

      <h2>2. 它接不住什么（面试高频）</h2>
      <Demo2 />

      <h2>3. createPortal：弹窗为什么会被裁掉</h2>
      <Demo3 />

      <h2>4. 两者结合：懒加载失败的白屏兜底</h2>
      <Demo4 />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>这几句要能背下来</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>ErrorBoundary 必须是 class</strong>：React 没提供 hook 版，靠
            <code>getDerivedStateFromError</code>（渲染阶段改 state）+
            <code>componentDidCatch</code>（提交阶段做副作用）
          </li>
          <li>
            <strong>它只接"渲染期间"的同步错误</strong>：事件处理、定时器、Promise 里的错误都接不住
          </li>
          <li>
            <strong>边界要包在"可能出事的区域"外面</strong>，不是包整页 —— 不然一处崩了还是整页白屏
          </li>
          <li>
            <strong>createPortal 只改 DOM 位置，不改 React 树</strong>：所以弹窗里还能用父组件的
            state / Context / 路由
          </li>
          <li>
            <strong>用 Portal 前要判 <code>typeof document !== 'undefined'</code></strong>，否则 SSR 会炸
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          真实项目里通常直接用 <code>react-error-boundary</code> 这个库（提供
          <code>&lt;ErrorBoundary&gt;</code> 组件 + <code>useErrorBoundary</code> hook + resetKeys），
          但<strong>原理就是上面这 20 行</strong>，面试要能讲出来。
        </p>
      </div>
    </div>
  )
}
