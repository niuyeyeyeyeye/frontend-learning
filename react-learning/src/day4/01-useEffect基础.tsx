// ============================================================
// Day4-1：useEffect 基础 + 依赖数组 + 闭包陷阱
// ============================================================
// 一句话理解：**useEffect 是"组件渲染完之后，要额外做的事"**。
//
// 什么叫"额外的事"（副作用）？
//   · 改 document.title（改浏览器标签）
//   · 开定时器 / 发请求 / 加事件监听 / 存 localStorage
//   这些都是"渲染 UI 之外"的动作，不能在组件函数里直接写（会每次渲染都执行、还可能死循环），
//   所以要放进 useEffect 里"控制执行时机"。

import { useEffect, useState } from 'react'

export default function EffectBasics() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('小明')

  // ---------- ① 不传依赖数组：每次渲染都执行 ----------
  useEffect(() => {
    console.log('[①] 每次渲染都执行（不传依赖）')
  }) // ← 没有第二个参数

  // ---------- ② 空数组 []：只在"挂载"时执行一次 ----------
  useEffect(() => {
    console.log('[②] 只在挂载时执行一次（空数组）')
  }, [])

  // ---------- ③ 有依赖 [count]：count 变化时才执行 ----------
  useEffect(() => {
    console.log('[③] count 变了才执行，当前 count =', count)
  }, [count])

  // ---------- 实战：改浏览器标签标题（最经典的副作用） ----------
  useEffect(() => {
    document.title = `你点了 ${count} 次` // ← 副作用写在 effect 里
    // 组件卸载时恢复（可选，演示清理函数）
    return () => {
      document.title = 'React 学习'
    }
  }, [count])

  return (
    <div>
      <h3>1. 三种依赖数组的区别</h3>
      <p className="hint">
        打开控制台看日志。点下面的按钮，观察 [①][②][③] 分别执行了几次：
      </p>
      <button className="btn" onClick={() => setCount(count + 1)}>
        count + 1（当前 {count}）
      </button>
      {'　'}
      <button className="btn-ghost" onClick={() => setName(name === '小明' ? '小红' : '小明')}>
        改 name（当前 {name}）
      </button>

      <div className="card" style={{ marginTop: 8 }}>
        <p>点 count 按钮 → [①] 和 [③] 都执行，[②] 不执行</p>
        <p>点 name 按钮 → 只有 [①] 执行（因为 [③] 只依赖 count）</p>
        <p className="hint">
          ⭐ 规律：<b>effect 里的代码"用到"了什么 state，就应该把它写进依赖数组</b>
        </p>
      </div>

      <h3>2. 浏览器标签标题也跟着变了</h3>
      <p className="hint">
        看浏览器标签页 —— 现在写的是"你点了 N 次"。这就是在 useEffect 里改 document.title 的效果。
      </p>

      <h3>3. ⚠️ 经典坑：闭包陷阱（依赖写少了会怎样）</h3>
      <div className="card">
        <p>
          下面这个组件开了个定时器，每秒打印一次 count。但它<b>故意</b>没把 count 写进依赖：
        </p>
        <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: 10, borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>
{`useEffect(() => {
  const id = setInterval(() => {
    console.log(count)     // ← 永远打印 0！
  }, 1000)
  return () => clearInterval(id)
}, [])                     // ← 依赖是空数组，effect 只跑了一次`}
        </pre>
        <p className="hint">
          <b>为什么永远打印 0</b>：effect 只在挂载时执行一次，回调里捕获的是<b>那一次渲染的 count（0）</b>。
          之后 count 变了，但定时器里的闭包还是旧的 —— 这就是<b>闭包陷阱</b>（你 Day4 学过闭包，这里正好是它的实战场景）。
        </p>
        <ClosureTrap />
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// 闭包陷阱的可运行演示
// ------------------------------------------------------------
function ClosureTrap() {
  const [count, setCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    const id = setInterval(() => {
      // ⚠️ 这里的 count 永远是挂载时那个 0
      setLog((prev) => [...prev.slice(-4), `定时器看到的 count = ${count}`])
    }, 1000)
    return () => clearInterval(id)
  }, []) // ← 故意不写 [count]

  return (
    <div style={{ marginTop: 8 }}>
      <button className="btn-ghost" onClick={() => setCount(count + 1)}>
        增加 count（现在 {count}）
      </button>
      <div className="hint" style={{ marginTop: 6, fontFamily: 'Consolas, monospace' }}>
        {log.length === 0 ? '（等一秒看日志）' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <p className="hint">
        👉 你会发现：<strong>不管 count 变成多少，定时器打印的永远是 0</strong>（应该显示"当前 count = N"）。
        修法：把 count 写进依赖 <code>[count]</code> —— 但那样定时器每秒都会被重建（也不是最优）。
        <strong>最优解是函数式更新</strong>：<code>setCount(c =&gt; c + 1)</code>
        ，effect 里不读 count 就不用依赖它。
      </p>
    </div>
  )
}
