// ============================================================
// Day5-1：useRef —— "不会触发渲染的容器"
// ============================================================
// useRef 返回一个对象 { current: 初始值 }。三个关键点：
//   ① 改 .current **不会触发重新渲染**（这是它和 useState 最大的区别）
//   ② 它的值在多次渲染之间**保持不变**
//   ③ 可以拿来存 DOM 元素（ref={xxxRef}）

import { useEffect, useRef, useState } from 'react'

export default function RefBasics() {
  const [count, setCount] = useState(0)

  // ---------- 用途 1：存"不需要触发渲染"的值 ----------
  const renderCount = useRef(0)
  renderCount.current += 1 // 直接在渲染时改 ref —— 注意：这不触发新渲染

  // ---------- 用途 2：访问 DOM 元素 ----------
  const inputRef = useRef<HTMLInputElement>(null)

  // ---------- 用途 3：保存"上一次渲染"的值 ----------
  const prevCountRef = useRef<number | null>(null)
  const prevCount = prevCountRef.current // 这里读到的是上一次 effect 存的
  useEffect(() => {
    prevCountRef.current = count // effect 在渲染之后执行 → 为下次渲染准备
  }, [count])

  return (
    <div>
      <h3>1. useRef 不触发渲染（对比 useState）</h3>
      <div className="card">
        <p>
          这个组件已经渲染了 <strong>{renderCount.current}</strong> 次
        </p>
        <p>
          count = <strong>{count}</strong>，上一次是 <strong>{prevCount === null ? '（无）' : prevCount}</strong>
        </p>
        <button className="btn" onClick={() => setCount(count + 1)}>
          setCount + 1（触发渲染）
        </button>
        {' '}
        <button
          className="btn-ghost"
          onClick={() => {
            renderCount.current += 100 // ❌ 改 ref 不会让页面更新
            console.log('我把 renderCount.current 改成', renderCount.current, '但页面数字不会变')
          }}
        >
          改 ref（不触发渲染，看数字变不变）
        </button>
        <p className="hint">
          👉 点第二个按钮：控制台里的数字变了，但页面上"渲染了 N 次"不变 —— 因为 ref 不触发渲染。
          下一次任何 state 更新（比如点第一个按钮）时，页面才会同步显示新值。
        </p>
      </div>

      <h3>2. 访问 DOM：控制输入框焦点</h3>
      <div className="card">
        <input ref={inputRef} placeholder="点下面按钮让我聚焦" style={{ padding: 4 }} />
        {' '}
        <button className="btn" onClick={() => inputRef.current?.focus()}>
          聚焦输入框
        </button>
        {' '}
        <button className="btn-ghost" onClick={() => inputRef.current?.blur()}>
          失焦
        </button>
        <p className="hint">
          注意 <code>inputRef.current?.focus()</code> 里的 <code>?.</code>：
          因为 current 可能是 null（首次渲染时元素还没挂载）—— 你 Day3 学的可选链正好用上。
        </p>
      </div>

      <h3>3. useRef vs useState（背下来）</h3>
      <div className="card">
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: 4 }}></td>
              <td><strong>useState</strong></td>
              <td><strong>useRef</strong></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>改它会怎样</td>
              <td>触发重新渲染 ✅</td>
              <td><strong>不触发渲染</strong></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>值会保持吗</td>
              <td>保持（跨渲染）</td>
              <td>保持（跨渲染，同一个 ref 对象）</td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>什么时候用</td>
              <td><strong>影响 UI 显示的数据</strong></td>
              <td>定时器 id、DOM 引用、上一次的值、不需要显示的内部数据</td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>读它的时机</td>
              <td>渲染时拿到最新值</td>
              <td>渲染时拿到的是"上次改完"的值（不保证最新）</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>4. 一个非常重要的用途：定时器 id</h3>
      <div className="card">
        <p className="hint">
          你 Day4 写定时器时用的是 <code>let id = setInterval(...)</code> 写在 effect 里。
          如果要在<strong>别的函数</strong>里清除它（比如按钮点击），就需要用 ref 存：
        </p>
        <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: 10, borderRadius: 6, fontSize: 12, overflowX: 'auto' }}>
{`const timerRef = useRef<number | null>(null)

function start() {
  stop()   // 先清掉可能存在的
  timerRef.current = window.setInterval(() => { ... }, 1000)
}
function stop() {
  if (timerRef.current !== null) {
    clearInterval(timerRef.current)
    timerRef.current = null
  }
}`}
        </pre>
      </div>
    </div>
  )
}
