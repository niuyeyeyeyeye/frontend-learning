// ============================================================
// Day8-0：为什么需要 Zustand（先看这一页的对比实验）
// ============================================================
// 📖 本文件名字对照表
//   WhyZustand       为什么要它（本页 / /day8）
//   CounterContext   Context 版计数器（Provider 绑在这一页里）
//   useZustandCounter Zustand 版计数器（store 在 React 之外）
//   Provider         提供者（Day6 学的）—— Zustand 不需要它
//
// ⭐ 一句话：**Zustand 把状态从组件树里拿出来，放到一个独立的"仓库"里。**
//    组件不再是"拥有"状态，而是"订阅"状态。

import { createContext, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { create } from 'zustand'
import { useTodoStore } from './store/todoStore'

// ============================================================
// 左边：Day6 的写法（Context）
// ============================================================
type CounterCtx = { count: number; inc: () => void }
const CounterContext = createContext<CounterCtx | null>(null)

function ContextCounterPanel() {
  const [count, setCount] = useState(0)
  return (
    <CounterContext.Provider value={{ count, inc: () => setCount((c) => c + 1) }}>
      <div className="card" style={{ borderColor: '#cf222e' }}>
        <strong style={{ color: '#cf222e' }}>❌ Context 版</strong>
        <ContextCounterDisplay />
      </div>
    </CounterContext.Provider>
  )
}

function ContextCounterDisplay() {
  const ctx = useContext(CounterContext)
  if (ctx === null) throw new Error('必须在 CounterContext.Provider 里')
  return (
    <p style={{ marginBottom: 0 }}>
      count = <strong>{ctx.count}</strong>{' '}
      <button className="btn-ghost" onClick={ctx.inc}>
        +1
      </button>
    </p>
  )
}

// ============================================================
// 右边：Zustand 的写法（store 写在组件外面）
// ============================================================
type CounterStore = { count: number; inc: () => void }

// ⭐⭐⭐ 这一行是今天的核心：create 在**模块级**执行 → 不属于任何组件
const useZustandCounter = create<CounterStore>()((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}))

function ZustandCounterPanel() {
  // 不需要 Provider，直接订阅
  const count = useZustandCounter((s) => s.count)
  const inc = useZustandCounter((s) => s.inc)

  return (
    <div className="card" style={{ borderColor: '#1f883d' }}>
      <strong style={{ color: '#1f883d' }}>✅ Zustand 版</strong>
      <p style={{ marginBottom: 0 }}>
        count = <strong>{count}</strong>{' '}
        <button className="btn-ghost" onClick={inc}>
          +1
        </button>
      </p>
    </div>
  )
}

// ============================================================
// 页面本体
// ============================================================
export default function WhyZustand() {
  const total = useTodoStore((s) => s.todos.length)

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>先做这个实验（30 秒）</h3>
        <ol style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>把左边两个计数器各点 3 下</li>
          <li>
            点上面的 <Link to="/day8/basics">「1. 基础用法」</Link> 切走
          </li>
          <li>再点回「为什么要它」看这两个数字</li>
        </ol>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <ContextCounterPanel />
          <ZustandCounterPanel />
        </div>
        <p className="hint" style={{ marginBottom: 0 }}>
          👆 <strong>Context 那个会归零</strong>（Provider 跟着页面一起卸载了），
          <strong>Zustand 那个还是 3</strong>（store 住在 React 外面，没人卸载它）。
          这就是 Day7 学的"切路由 = 卸载 + 挂载"的直接后果。
          <br />
          顶部「全局待办 {total} 条」也是同一个道理 —— 它在布局里，
          和「3. 实战」页读的是同一个 store。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Context 的三个痛点</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>痛点</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>具体表现</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Zustand 怎么解</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'Provider 地狱',
                '想在深层用，就得把 Provider 提到最外层；页面一多，App 里套一堆 Provider',
                '完全没有 Provider，import 就能用',
              ],
              [
                '状态跟着组件走',
                'Provider 在哪个组件里，状态就在哪儿；组件卸载 → 状态消失',
                'store 在模块里，跟组件树无关',
              ],
              [
                '一变就全变',
                'value 里任何一个字段变，所有消费者全部重渲染（没法只订一部分）',
                'selector 只订阅需要的那一小块',
              ],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', whiteSpace: 'nowrap' }}>
                  {a}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <strong>{c}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          第 3 条是 Zustand 真正的价值所在 —— 在 <Link to="/day8/selector">第 2 节</Link> 用控制台日志让你看见。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天的路线（4 步，别跳）</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <Link to="/day8/basics">1. 基础用法</Link> —— <code>create</code> + <code>set</code> + 在组件里读
          </li>
          <li>
            <Link to="/day8/selector">2. 选择性订阅</Link> —— 为什么只订一个字段，以及最容易踩的坑
          </li>
          <li>
            <Link to="/day8/todo">3. 实战：重写待办</Link> —— 干掉 Provider，加上本地持久化
          </li>
          <li>
            <Link to="/day8/practice">练习</Link> —— 3 个 TODO（购物车 store 就是练习 2）
          </li>
        </ol>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>什么时候**不要**用 Zustand（面试加分）</h3>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>状态只在一个组件里用 → 就用 <code>useState</code>，别搞全局</li>
          <li>只有两三层传递 → props 或 Context 更简单</li>
          <li>服务器数据（列表、详情）→ 应该用 React Query / SWR 那类，不是 Zustand</li>
        </ul>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>判断标准</strong>：这个状态是不是"很多互不相干的组件都要读写"？
          是 → Zustand；否 → 留在组件里。
        </p>
      </div>
    </div>
  )
}

/* ============================================================
 * 一句话总结（背下来）
 * ============================================================
 * Context   = 传值管道（解决"传得烦"），状态还住在组件里
 * Zustand   = 独立仓库（解决"存哪、怎么订"），状态住在 React 之外
 *
 * 所以：
 *   主题 / 登录用户 / 语言（低频、全局都要）  → Context 够用
 *   购物车 / 待办 / 编辑器内容（高频、跨页面） → Zustand
 * ============================================================ */
