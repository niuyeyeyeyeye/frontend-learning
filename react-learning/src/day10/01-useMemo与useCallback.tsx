// ============================================================
// Day10-1：useMemo 与 useCallback 的真实作用（和它们的代价）
// ============================================================
// 📖 本文件名字对照表
//   MemoCallbackDemo  useMemo / useCallback 演示（本页 /day10/memo）
//   expensiveSum      一个故意很慢的纯计算（500 万次累加）
//   slow              "慢"（40ms 以上）的测量结果
//   useCallback       稳住函数引用（= useMemo(() => fn, deps)）
//
// ⭐ useMemo 只有两个真实作用：
//   ① 缓存**昂贵计算**（重算一次要几十毫秒的那种）
//   ② 稳住**引用**（对象/数组/函数），好让 memo 子组件能跳过渲染
//   剩下 95% 的用法都是在给 ② 服务 —— 而大多数人以为它是 ①。

import { memo, useCallback, useMemo, useRef, useState } from 'react'

// ============================================================
// ① 昂贵计算：什么时候 useMemo 真的有用
// ============================================================
function expensiveSum(n: number): number {
  let sum = 0
  for (let i = 0; i < n; i++) sum += i
  return sum
}

function ExpensiveDemo() {
  const [n, setN] = useState(5_000_000)
  const [tick, setTick] = useState(0)

  // ⭐ 每次都重算（不加 useMemo）
  const startA = performance.now()
  const totalNoMemo = expensiveSum(n)
  const costNoMemo = performance.now() - startA

  // ⭐ 只有 n 变才重算
  const startB = performance.now()
  const totalWithMemo = useMemo(() => expensiveSum(n), [n])
  const costWithMemo = performance.now() - startB

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验：一个"慢计算" + 一个无关的 tick</h3>
      <p style={{ marginTop: 0 }}>
        无关的 tick = <strong>{tick}</strong>{' '}
        <button className="btn" style={{ marginRight: 6 }} onClick={() => setTick((t) => t + 1)}>
          点我（跟求和无关）
        </button>
        <button className="btn-ghost" onClick={() => setN((x) => x + 1)}>
          强制重算（n 不变）
        </button>
      </p>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#57606a' }}>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>写法</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>结果</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>
              本次渲染花在计算上的时间
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
              不加 useMemo（每次都算）
            </td>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{totalNoMemo}</td>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
              <strong style={{ color: costNoMemo > 5 ? '#cf222e' : '#1f883d' }}>
                {costNoMemo.toFixed(2)} ms
              </strong>
            </td>
          </tr>
          <tr>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
              加了 useMemo（n 没变就不算）
            </td>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{totalWithMemo}</td>
            <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
              <strong style={{ color: '#1f883d' }}>{costWithMemo.toFixed(2)} ms</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="hint" style={{ marginBottom: 0 }}>
        👆 <strong>连点几次「点我（跟求和无关）」</strong>：上面那行的时间一直很高（每次渲染都白算一遍），
        下面那行接近 0。
        <br />
        ⚠️ 但注意：<strong>第一次渲染时 useMemo 也要算</strong>，而且它自己还有"比较依赖"的开销。
        如果你把 n 改成 1000（算起来不到 0.01ms），加 useMemo 纯属自找麻烦。
      </p>
    </div>
  )
}

// ============================================================
// ② useCallback：稳住函数，好让 memo 子组件能跳过
// ============================================================
const Item = memo(function Item({ label, onPick }: { label: string; onPick: () => void }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div style={{ padding: '3px 0', fontSize: 13 }}>
      {label}
      <span className="tag" style={{ marginLeft: 6, fontSize: 11 }}>
        渲染 {renders.current} 次
      </span>
      <button className="btn-ghost" style={{ marginLeft: 6, padding: '0 6px' }} onClick={onPick}>
        pick
      </button>
    </div>
  )
})

function CallbackDemo() {
  const [tick, setTick] = useState(0)

  // ❌ 每次渲染都是新函数 → Item 的 memo 失效
  const inlinePick = () => {}

  // ✅ 引用永远不变 → Item 能跳过
  const stablePick = useCallback(() => {}, [])

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验：同样的 memo 子组件，一个拿到新函数，一个拿到稳定函数</h3>
      <p style={{ marginTop: 0 }}>
        父组件 tick = <strong>{tick}</strong>{' '}
        <button className="btn" onClick={() => setTick((t) => t + 1)}>
          让父组件重渲染
        </button>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="card" style={{ padding: 8, borderColor: '#cf222e' }}>
          <div style={{ fontSize: 12, color: '#cf222e' }}>❌ 传内联函数 onPick={'() => {}'}</div>
          <Item label="子组件 A" onPick={inlinePick} />
        </div>
        <div className="card" style={{ padding: 8, borderColor: '#1f883d' }}>
          <div style={{ fontSize: 12, color: '#1f883d' }}>✅ 传 useCallback 的函数</div>
          <Item label="子组件 B" onPick={stablePick} />
        </div>
      </div>
      <p className="hint" style={{ marginBottom: 0 }}>
        👆 连点几次按钮：<strong>A 的渲染次数一直涨，B 不动</strong>。
        <br />
        <strong>这就是 useCallback 的全部意义</strong>：不是为了"函数快一点"，而是为了让下游的 memo 能生效。
        如果子组件没包 memo，useCallback 一点用都没有。
      </p>
    </div>
  )
}

// ============================================================
// ③ 依赖数组写错：stale 闭包 & 缓存失效
// ============================================================
function DepsTrapDemo() {
  const [count, setCount] = useState(0)
  const [note, setNote] = useState('')

  // ❌ 漏写 count：结果永远停在第一次渲染的值（stale / 过期闭包）
  const staleValue = useMemo(() => `count 是 ${count}`, [])

  // ❌ 依赖里塞了每次新建的对象：等于没写 useMemo
  const inlineOpts = { doubled: count * 2 }
  const uselessValue = useMemo(() => `翻倍是 ${inlineOpts.doubled}`, [inlineOpts])

  // ✅ 正确：依赖写"真正用到的原始值"
  const goodValue = useMemo(() => `count 是 ${count}`, [count])

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验：三种依赖写法的下场</h3>
      <p style={{ marginTop: 0 }}>
        count = <strong>{count}</strong>{' '}
        <button className="btn" style={{ marginRight: 6 }} onClick={() => setCount((c) => c + 1)}>
          count +1
        </button>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="改这里也会触发重渲染"
          style={{ padding: 4 }}
        />
      </p>
      <ul style={{ margin: '0 0 8px', paddingLeft: 20 }}>
        <li>
          ❌ 漏写依赖 <code>[]</code>：<strong style={{ color: '#cf222e' }}>{staleValue}</strong>
          <span className="hint">　→ 永远是第一次的 0（stale 闭包）</span>
        </li>
        <li>
          ❌ 依赖是内联对象：<strong>{uselessValue}</strong>
          <span className="hint">　→ 每次都"变"，缓存白存（结果对，但没省任何东西）</span>
        </li>
        <li>
          ✅ 依赖是原始值 <code>[count]</code>：<strong style={{ color: '#1f883d' }}>{goodValue}</strong>
        </li>
      </ul>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>两种失败方式完全相反</strong>：漏依赖 → 结果错（更难查）；
        多依赖/依赖不稳定 → 结果对但白费（看不出来，只是没变快）。
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function MemoCallbackDemo() {
  return (
    <div>
      <h2>① useMemo 到底什么时候有用</h2>
      <ExpensiveDemo />

      <h2>② useCallback：唯一目的是喂饱 memo</h2>
      <CallbackDemo />

      <h2>③ 依赖数组写错的两种下场</h2>
      <DepsTrapDemo />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⭐ 加之前先问这三句（面试官也会这么问）</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>它省下了什么？</strong>—— 省了一次几十毫秒的计算？还是让下游 memo 能跳过？
            答不出来就别加
          </li>
          <li>
            <strong>加它本身要花多少？</strong>—— 一次依赖比较 + 一块缓存内存。
            对于 0.01ms 的计算，这纯属负优化
          </li>
          <li>
            <strong>它会不会让代码更难懂？</strong>—— 依赖数组就是"隐藏的约束"，
            写错不会报错，只会悄悄出 bug
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>顺序永远是：先让它能跑 → 发现卡 → 定位到具体组件 → 才动手优化。</strong>
          反过来（先到处包一层）是新手最典型的浪费。
        </p>
      </div>
    </div>
  )
}

/* ============================================================
 * 三个等式（背下来就够）
 * ============================================================
 * useCallback(fn, deps)  ≡  useMemo(() => fn, deps)
 *        ↑ useCallback 就是 useMemo 的函数特例
 *
 * memo(Component)  =  "props 没变就跳过渲染"
 *        ↑ 它需要 props 稳定，所以要用 useMemo/useCallback 配合
 *
 * 重渲染 ≠ 慢
 *        ↑ 重渲染是"再调一次函数"，慢的是函数里的活（大列表、同步计算、布局）
 * ============================================================ */
