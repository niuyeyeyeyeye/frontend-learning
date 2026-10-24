// ============================================================
// Day4-2：清理函数（cleanup）—— 不写会出事
// ============================================================
// useEffect 可以 return 一个函数，这就是"清理函数"。
// 它的执行时机：
//   ① 组件卸载时
//   ② **下一次 effect 执行之前**（也就是说：每次重新执行 effect 前，先清理上一次）
//
// 什么时候必须写清理函数？
//   定时器（setInterval / setTimeout）、事件监听、订阅、请求取消、WebSocket

import { useEffect, useState } from 'react'

export default function CleanupBasics() {
  return (
    <div>
      <h3>1. 定时器：不清理会怎样（看下面的"运行中定时器数量"）</h3>
      <TimerDemo />

      <h3>2. 事件监听：不清理会怎样（拖动窗口大小看计数）</h3>
      <ResizeDemo />

      <h3>3. 清理函数的执行时机</h3>
      <div className="card">
        <p>
          <code>useEffect(() =&gt; {'{'} ... return 清理函数 {'}'}, [依赖])</code>
        </p>
        <p><b>清理函数在这两种时候执行：</b></p>
        <ul style={{ paddingLeft: 20 }}>
          <li>① 组件<strong>卸载</strong>时（从页面上消失）</li>
          <li>② <strong>下一次 effect 执行前</strong>（依赖变了 → 先清理旧的，再跑新的）</li>
        </ul>
        <p className="hint">
          ⭐ 为什么这样设计：effect 代表"建立了一个连接/订阅/定时器"，
          那么"下一次建立之前"必须先把上一次的销毁，否则就会<strong>泄漏</strong>。
        </p>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// 演示：多个定时器叠加
// ------------------------------------------------------------
function TimerDemo() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [activeCount, setActiveCount] = useState(0) // 当前有几个定时器在跑

  useEffect(() => {
    if (!running) return

    setActiveCount((c) => c + 1)
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    // ⭐ 清理函数：组件卸载或下一次 effect 前执行
    return () => {
      clearInterval(id)
      setActiveCount((c) => c - 1)
    }
  }, [running]) // running 变化时：先清理旧定时器，再看是否新建

  return (
    <div className="card">
      <p>
        计时：<strong>{seconds}</strong> 秒　|　当前活跃定时器：<strong style={{ color: activeCount > 1 ? '#cf222e' : '#1f883d' }}>{activeCount}</strong> 个
      </p>
      <button className={running ? 'btn-ghost' : 'btn'} onClick={() => setRunning(!running)}>
        {running ? '停止' : '开始'}
      </button>
      {'　'}
      <button className="btn-ghost" onClick={() => setSeconds(0)}>
        归零
      </button>
      <p className="hint">
        ✅ 正常情况：点"开始/停止"时，活跃定时器数量始终是 0 或 1。<br />
        ❌ 如果清理函数写错（比如没写 clearInterval），你多次点"开始"会看到数量变成 2、3、4…
        而且计时速度越来越快 —— 这就是<strong>内存泄漏 + 重复执行</strong>。
      </p>
    </div>
  )
}

// ------------------------------------------------------------
// 演示：窗口大小监听
// ------------------------------------------------------------
function ResizeDemo() {
  // 注意：SSR（服务端渲染）环境里没有 window，所以要判断一下 ——
  // 这是 React 项目里常见的"SSR 安全"写法（第三章学 Next.js 时会经常遇到）
  const [width, setWidth] = useState(typeof window === 'undefined' ? 0 : window.innerWidth)
  const [bindCount, setBindCount] = useState(0) // 当前绑定了几个监听器（示意）

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    setBindCount((c) => c + 1)
    console.log('[ResizeDemo] 绑定监听，当前绑定次数:', bindCount + 1)

    // ⭐ 清理：必须用**同一个函数引用**移除
    return () => {
      window.removeEventListener('resize', onResize)
      setBindCount((c) => c - 1)
    }
  }, [])

  return (
    <div className="card">
      <p>
        窗口宽度：<strong>{width}</strong> px
      </p>
      <p className="hint">
        拖动浏览器窗口大小，上面数字会实时变化。<br />
        打开控制台能看到"绑定监听"的日志 —— 在 StrictMode 下可能会看到两次（见 Day4 说明）。
      </p>
      <p className="hint">
        ⚠️ 经典坑：清理时写 <code>window.removeEventListener('resize', () =&gt; setWidth(window.innerWidth))</code>
        —— <b>不行！</b>因为每次写的箭头函数都是"新的函数"，移除不了。
        必须先把函数存到变量里，用同一个引用移除。
      </p>
    </div>
  )
}
