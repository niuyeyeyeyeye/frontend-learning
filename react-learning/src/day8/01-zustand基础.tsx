// ============================================================
// Day8-1：Zustand 基础用法（create / set / get）
// ============================================================
// 📖 本文件名字对照表
//   ZustandBasics   基础用法（本页）
//   create          创建 store（模块级执行，只跑一次）
//   set             改状态（会自动合并，不用手写 {...state}）
//   get             在 action 里读当前状态（不用等参数传进来）
//   getState        在**组件外**读状态（事件回调、setTimeout 里用）
//   setState        在**组件外**改状态
//
// ⭐ 一句话：`create` 返回的不是"状态"，是一个 **hook**。
//    组件里调 `useXxx(selector)` 订阅，组件外调 `useXxx.getState()` 读取。

import { useEffect, useRef, useState } from 'react'
import { create } from 'zustand'

// ============================================================
// ① 最小的 store：计数器
// ============================================================
type CounterStore = {
  count: number
  inc: () => void
  dec: () => void
  reset: () => void
  addBy: (n: number) => void
}

const useCounter = create<CounterStore>()((set, get) => ({
  count: 0,

  // ⭐ 函数式 set：拿"最新的"状态算新值（和 useState 的 setCount(c => c+1) 一模一样）
  inc: () => set((s) => ({ count: s.count + 1 })),
  dec: () => set((s) => ({ count: s.count - 1 })),

  // ⭐ 合并式 set：只写要改的字段，其他字段自动保留
  //    （这是 zustand 比 useReducer 舒服的地方 —— 不用手写 {...state}）
  reset: () => set({ count: 0 }),

  // ⭐ get() 在 action 里读当前状态
  addBy: (n) => set({ count: get().count + n }),
}))

function CounterDemo() {
  // ⭐ 一个字段一行 selector（第 2 节会讲为什么不能写成一次拿一个对象）
  const count = useCounter((s) => s.count)
  const inc = useCounter((s) => s.inc)
  const dec = useCounter((s) => s.dec)
  const reset = useCounter((s) => s.reset)
  const addBy = useCounter((s) => s.addBy)

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        count = <strong style={{ fontSize: 20 }}>{count}</strong>
      </p>
      <button className="btn-ghost" style={{ marginRight: 6 }} onClick={dec}>
        -1
      </button>
      <button className="btn" style={{ marginRight: 6 }} onClick={inc}>
        +1
      </button>
      <button className="btn-ghost" style={{ marginRight: 6 }} onClick={() => addBy(10)}>
        +10（用 get 读旧值）
      </button>
      <button className="btn-ghost" onClick={reset}>
        重置（合并式 set）
      </button>
      <p className="hint" style={{ marginBottom: 0 }}>
        这个 store 在别的页面也能读到 —— 去{' '}
        <code>/day8/selector</code> 那条路我们用的是另一个 store，互不影响。
      </p>
    </div>
  )
}

// ============================================================
// ② 带列表的 store：不可变更新照旧（Day3 的老规矩）
// ============================================================
type FruitStore = {
  fruits: string[]
  add: (name: string) => void
  removeAt: (index: number) => void
}

const useFruits = create<FruitStore>()((set) => ({
  fruits: ['苹果', '香蕉'],
  add: (name) => set((s) => ({ fruits: [...s.fruits, name] })), // 造新数组
  removeAt: (i) => set((s) => ({ fruits: s.fruits.filter((_, idx) => idx !== i) })),
}))

function ListDemo() {
  const fruits = useFruits((s) => s.fruits)
  const add = useFruits((s) => s.add)
  const removeAt = useFruits((s) => s.removeAt)
  const [text, setText] = useState('')

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="水果名"
          style={{ padding: 4, marginRight: 8 }}
        />
        <button
          className="btn"
          onClick={() => {
            add(text)
            setText('')
          }}
        >
          加一个
        </button>
      </p>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {fruits.map((f, i) => (
          <li key={f}>
            {f}{' '}
            <button className="btn-ghost" onClick={() => removeAt(i)}>
              删
            </button>
          </li>
        ))}
      </ul>
      <p className="hint" style={{ marginBottom: 0 }}>
        ⚠️ 别写成 <code>s.fruits.push(name)</code> —— 数组引用没变，selector 比较不出来，
        用 <code>[...s.fruits, name]</code>。这条规矩从 Day3 到现在没变过。
      </p>
    </div>
  )
}

// ============================================================
// ③ 组件外读写：getState / setState（治闭包陷阱）
// ============================================================
function OutsideComponentDemo() {
  const [log, setLog] = useState<string[]>([])

  // 场景：定时器里要读"最新的"count
  // ❌ 用组件里的 count 变量 → 闭包陷阱，永远读到挂载时的值（Day4 的坑）
  // ✅ 用 useCounter.getState() → 永远是最新值
  const readLatest = () => {
    const latest = useCounter.getState().count
    setLog((l) => [`定时器读到 count = ${latest}`, ...l].slice(0, 4))
  }

  useEffect(() => {
    const id = setInterval(readLatest, 3000)
    return () => clearInterval(id)
    // ⚠️ 依赖写空数组不会出问题 —— 因为读的是 store，不是组件里的变量
  }, [])

  const renders = useRef(0)
  renders.current += 1

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        每 3 秒自动读一次最新 count（你可以不停点 +1 试试）：
      </p>
      <ul style={{ margin: '0 0 8px', paddingLeft: 20, minHeight: 64 }}>
        {log.length === 0 && <li style={{ color: '#8b949e' }}>（等一下，3 秒后出现）</li>}
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <button
        className="btn-ghost"
        onClick={() => useCounter.setState({ count: 100 })}
        style={{ marginRight: 8 }}
      >
        组件外 setState：直接改成 100
      </button>
      <span style={{ color: '#8b949e', fontSize: 12 }}>本组件渲染次数：{renders.current}</span>
    </div>
  )
}

// ============================================================
// 展示区
// ============================================================
export default function ZustandBasics() {
  return (
    <div>
      <h2>1. 最小 store：create + set + 组件里读</h2>
      <CounterDemo />

      <h2>2. 列表状态：不可变更新照旧</h2>
      <ListDemo />

      <h2>3. 组件外读写：getState / setState</h2>
      <OutsideComponentDemo />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>和 useState 对照着记</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>要做的事</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>useState</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Zustand</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['定义', 'const [n, setN] = useState(0)', 'create((set) => ({ n: 0 }))'],
              ['读', 'n', 'useStore((s) => s.n)'],
              ['改', 'setN(n + 1)', 'set((s) => ({ n: s.n + 1 }))'],
              ['在别的组件里用', '得靠 props / Context 传', 'import 就能用'],
              ['在组件外读', '做不到', 'useStore.getState().n'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>
                  <code>{b}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{c}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ============================================================
 * 三个必须记住的写法
 * ============================================================
 * 1. 创建（TypeScript 下必须写两对括号）
 *      create<Store>()((set, get) => ({ ... }))
 *                            ↑ 少了这对括号，TS 会报错
 *
 * 2. 改状态用函数式，别依赖外部变量
 *      set((s) => ({ count: s.count + 1 }))     ✅
 *      set({ count: count + 1 })                ⚠️ 容易拿到旧的 count
 *
 * 3. 只写要改的字段
 *      set({ count: 0 })          ✅ zustand 自动保留其他字段
 *      set({ ...get(), count: 0 }) ❌ 多余，而且容易写错
 * ============================================================ */
