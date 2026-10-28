// ============================================================
// Day5-2：自定义 hook —— 把逻辑抽出来复用
// ============================================================
// 什么是自定义 hook？
//   一个**名字以 use 开头**的函数，内部可以调用其他 hook（useState / useEffect / 其他自定义 hook）。
//
// ⚠️ 最重要的一个认知（很多人误解）：
//   **自定义 hook 复用"逻辑"，不复用"状态"！**
//   每个组件调用 useCounter() 都会得到**独立**的 count。
//   想共享状态要用 Context / Zustand（Day6、Day8 学）。

import { useEffect, useRef, useState } from 'react'

// ============================================================
// ① useCounter：把计数器逻辑抽出来
// ============================================================
function useCounter(initial: number = 0) {
  const [count, setCount] = useState(initial)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(initial)

  return { count, increment, decrement, reset }
}

// ============================================================
// ② useLocalStorage：读写 localStorage（自动 JSON 序列化）
// ============================================================
function useLocalStorage<T>(key: string, initialValue: T) {
  // ⭐ 用"惰性初始化"：只在首次渲染时读一次 localStorage（不是每次渲染都读）
  const [value, setValue] = useState<T>(() => {
    // SSR 安全检查（服务端没有 localStorage）
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialValue : (JSON.parse(raw) as T)
    } catch {
      return initialValue
    }
  })

  const setStored = (next: T) => {
    setValue(next)
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // 存储失败（比如超容量/隐私模式）不能让页面崩
    }
  }

  return [value, setStored] as const
}

// ============================================================
// ③ useToggle：布尔开关（非常常用）
// ============================================================
function useToggle(initial: boolean = false) {
  const [on, setOn] = useState(initial)
  const toggle = () => setOn((v) => !v)
  const turnOn = () => setOn(true)
  const turnOff = () => setOn(false)
  return { on, toggle, turnOn, turnOff }
}

// ============================================================
// ④ useDebounce：防抖（把 Day6 的 JS 版搬到 React）
// ============================================================
// 输入 value 变化后，等 delay 毫秒才返回新值；期间再变就重新计时
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id) // ⭐ 关键：每次 value 变化都清掉上一个定时器
  }, [value, delay])

  return debounced
}

// ============================================================
// ⑤ usePrevious：拿到上一次的值（用 useRef 实现）
// ============================================================
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value // effect 在渲染后执行 → 为下一次渲染准备"上一次的值"
  }, [value])
  return ref.current
}

// ============================================================
// 演示区
// ============================================================
export default function CustomHooks() {
  return (
    <div>
      <h3>1. useCounter：两个组件各用一份，状态互不影响</h3>
      <CounterPanel label="计数器 A" />
      <CounterPanel label="计数器 B" />
      <p className="hint">
        👆 两个计数器的数字互不影响 —— 这就是"<strong>复用逻辑，不复用状态</strong>"。
      </p>

      <h3>2. useLocalStorage：刷新页面数据还在</h3>
      <ThemePanel />

      <h3>3. useToggle：布尔开关</h3>
      <TogglePanel />

      <h3>4. useDebounce：输入停下 500ms 才更新</h3>
      <DebouncePanel />

      <h3>5. usePrevious：上一次的值</h3>
      <PreviousPanel />
    </div>
  )
}

function CounterPanel({ label }: { label: string }) {
  const { count, increment, decrement, reset } = useCounter(0)
  return (
    <div className="card">
      <span style={{ marginRight: 8 }}>{label}：<strong>{count}</strong></span>
      <button className="btn-ghost" style={{ marginRight: 4 }} onClick={increment}>+1</button>
      <button className="btn-ghost" style={{ marginRight: 4 }} onClick={decrement}>-1</button>
      <button className="btn-ghost" onClick={reset}>重置</button>
    </div>
  )
}

function ThemePanel() {
  const [theme, setTheme] = useLocalStorage<string>('demo-theme', 'light')
  return (
    <div className="card">
      <p>
        当前主题：<strong>{theme}</strong>（用 localStorage 存的，刷新不丢）
      </p>
      <button className="btn-ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  )
}

function TogglePanel() {
  const { on, toggle } = useToggle(false)
  return (
    <div className="card">
      <p>状态：<strong>{on ? '开' : '关'}</strong></p>
      <button className="btn" onClick={toggle}>切换</button>
    </div>
  )
}

function DebouncePanel() {
  const [input, setInput] = useState('')
  const debouncedValue = useDebounce(input, 500)
  return (
    <div className="card">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="快速输入，看下面什么时候跟上"
        style={{ padding: 4, width: 260 }}
      />
      <p>
        实时值：<strong>{input || '（空）'}</strong>
      </p>
      <p>
        防抖后的值：<strong style={{ color: '#1f883d' }}>{debouncedValue || '（空）'}</strong>
      </p>
      <p className="hint">你停手 500ms 后，两行才一致。</p>
    </div>
  )
}

function PreviousPanel() {
  const [count, setCount] = useState(0)
  const prev = usePrevious(count)
  return (
    <div className="card">
      <p>
        当前：<strong>{count}</strong>　上一次：<strong>{prev === undefined ? '（无）' : prev}</strong>
      </p>
      <button className="btn" onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
