// ============================================================
// Day5-4：你的练习
// ============================================================
// 规则：补完 TODO → 保存 → 浏览器看效果
// 卡 20 分钟看文件底部的参考答案

import { useEffect, useRef, useState } from 'react'

// ------------------------------------------------------------
// 练习 1：自动聚焦（useRef 访问 DOM）
// 要求：页面加载后，输入框自动获得焦点（用户直接就能打字，不用点）
// 提示：const ref = useRef<HTMLInputElement>(null) + useEffect(() => { ref.current?.focus() }, [])
// ------------------------------------------------------------
function AutoFocus() {
  // TODO 1：声明 ref，用 effect 聚焦

  return (
    <div>
      <input placeholder="我应该在页面加载后自动获得焦点" style={{ padding: 6, width: 320 }} />
      <p className="hint">（如果没自动聚焦，说明还没实现）</p>
    </div>
  )
}

// ------------------------------------------------------------
// 练习 2：自己写 useToggle 自定义 hook
// 要求：写一个 useToggle，返回 { on, toggle }
//       然后在两个组件里各用一次，验证状态互不影响
// 提示：一个 useState<boolean> + 一个 toggle 函数 + return 对象
// ------------------------------------------------------------
// TODO 2：在这里写 useToggle

function ToggleA() {
  // TODO 2-a：用你的 useToggle
  return <div className="card">（练习 2 还没实现）</div>
}

function ToggleB() {
  // TODO 2-b：再写一个组件（各自独立）
  return <div className="card">（练习 2 还没实现）</div>
}

// ------------------------------------------------------------
// 练习 3（挑战）：自己写 useDebounce
// 要求：
//   - 函数签名：useDebounce<T>(value: T, delay?: number): T
//   - value 变化后等 delay 毫秒才返回新值；期间再变就重新计时
//   - 必须清理定时器（否则会同时触发多个）
// 提示：useState 存 debounced + useEffect 里 setTimeout + 清理函数
//       依赖数组写 [value, delay]
// ------------------------------------------------------------
// TODO 3：在这里写 useDebounce

function DebounceInput() {
  const [input, setInput] = useState('')
  // TODO 3-a：调用你的 useDebounce(input, 500)
  const debounced = '（还没实现）'

  const [count, setCount] = useState(0)
  // TODO 3-b：（可选）统计防抖后的值变化了几次

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="快速输入" style={{ padding: 4 }} />
      <p>
        实时值：<strong>{input}</strong>
      </p>
      <p>
        防抖后的值：<strong>{debounced}</strong>（变化 {count} 次）
      </p>
    </div>
  )
}

// ------------------------------------------------------------
// 展示区（不用改）
// ------------------------------------------------------------
export default function PracticeDay5() {
  return (
    <div>
      <h3>练习 1：自动聚焦</h3>
      <AutoFocus />

      <h3>练习 2：useToggle</h3>
      <ToggleA />
      <ToggleB />

      <h3>练习 3：useDebounce（挑战）</h3>
      <DebounceInput />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   const inputRef = useRef<HTMLInputElement>(null)
 *   useEffect(() => {
 *     inputRef.current?.focus()
 *   }, [])          // 空数组：只挂载时执行一次
 *   ...
 *   <input ref={inputRef} placeholder="..." />
 *
 * 练习 2：
 *   function useToggle(initial: boolean = false) {
 *     const [on, setOn] = useState(initial)
 *     const toggle = () => setOn((v) => !v)
 *     return { on, toggle }
 *   }
 *
 *   function ToggleA() {
 *     const { on, toggle } = useToggle(false)
 *     return (
 *       <div className="card">
 *         A：{on ? '开' : '关'}
 *         <button className="btn" onClick={toggle}>切换</button>
 *       </div>
 *     )
 *   }
 *
 * 练习 3：
 *   function useDebounce<T>(value: T, delay: number = 300): T {
 *     const [debounced, setDebounced] = useState(value)
 *     useEffect(() => {
 *       const id = setTimeout(() => setDebounced(value), delay)
 *       return () => clearTimeout(id)      // ⭐ 关键：清掉上一个
 *     }, [value, delay])
 *     return debounced
 *   }
 *
 *   function DebounceInput() {
 *     const [input, setInput] = useState('')
 *     const debounced = useDebounce(input, 500)
 *     const [count, setCount] = useState(0)
 *     useEffect(() => {
 *       setCount((c) => c + 1)             // 每次 debounced 变化 +1
 *     }, [debounced])
 *     ...
 *   }
 *
 * 【做完后想一件事】
 * 练习 3 里，为什么清理函数是必须的？
 * 答：如果不清掉上一个定时器，每次输入都会发一个新 setTimeout，
 *     等 500ms 后它们全部触发 → 你会看到一堆"旧值"依次更新。
 *     清理函数让"只有最后一个定时器活着"——这正是防抖的原理。
 * ============================================================ */
