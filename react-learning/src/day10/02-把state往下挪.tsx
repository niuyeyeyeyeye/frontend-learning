// ============================================================
// Day10-2：最有效的优化不是 memo，是"把 state 挪下去"
// ============================================================
// 📖 本文件名字对照表
//   StatePlacementDemo  状态位置演示（本页 /day10/placement）
//   HeavyList           一个"有点贵"的列表（100 项）
//   children 技巧        把不变的子树当 children 传进去
//
// ⭐ 一句话：**state 放在太上层，是 React 应用最常见的性能问题来源。**
//   把 state 挪到真正需要它的那个组件里，比加十个 memo 都管用 ——
//   而且不需要任何 hook，代码还更短。

import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

// 一个"有点贵"的列表：100 项
function HeavyList() {
  const renders = useRef(0)
  renders.current += 1
  const items = Array.from({ length: 100 }, (_, i) => `条目 ${i + 1}`)
  return (
    <div className="card" style={{ padding: 8 }}>
      <div style={{ fontSize: 12, color: '#57606a', marginBottom: 4 }}>
        100 项的列表 —— 渲染了 <strong>{renders.current}</strong> 次
      </div>
      <div style={{ maxHeight: 110, overflow: 'auto', fontSize: 12, color: '#8b949e' }}>
        {items.map((t) => (
          <span key={t} style={{ marginRight: 8 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// ❌ 写法 A：state 在顶层（最常见的错法）
// ============================================================
function StateAtTop() {
  const [keyword, setKeyword] = useState('')
  return (
    <div className="card" style={{ borderColor: '#cf222e' }}>
      <strong style={{ color: '#cf222e' }}>❌ state 放在顶层</strong>
      <p style={{ margin: '6px 0' }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="在这里打字，看列表的渲染次数"
          style={{ padding: 4, width: 240 }}
        />
      </p>
      {/* keyword 一变 → StateAtTop 重渲染 → HeavyList 跟着重渲染 */}
      <HeavyList />
    </div>
  )
}

// ============================================================
// ✅ 写法 B：state 挪到真正用它的组件里
// ============================================================
function SearchBox() {
  // ⭐ state 只属于输入框自己，别人不关心
  const [keyword, setKeyword] = useState('')
  return (
    <p style={{ margin: '6px 0' }}>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="在这里打字，列表不动"
        style={{ padding: 4, width: 240 }}
      />
    </p>
  )
}

function StateDown() {
  return (
    <div className="card" style={{ borderColor: '#1f883d' }}>
      <strong style={{ color: '#1f883d' }}>✅ state 下移到 SearchBox</strong>
      {/* 打字只让 SearchBox 重渲染，兄弟 HeavyList 完全不受影响 */}
      <SearchBox />
      <HeavyList />
    </div>
  )
}

// ============================================================
// ✅ 写法 C：state 留在外壳里，大子树从**外面**通过 children 传进来
// ============================================================
// ⚠️ 关键不是"state 在第几层"，而是 **"创建 element 的那一层有没有重渲染"**。
//    · 如果 children 是"持有 state 的那个组件"创建的 → state 一变，element 就是新的 → 照样重渲染
//    · 如果 children 是"外层不重渲染的组件"创建的 → 引用不变 → React 直接复用，跳过
function Shell({ children }: { children: ReactNode }) {
  // ⭐ state 在这个外壳里（它必须重渲染）
  const [keyword, setKeyword] = useState('')
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="card" style={{ borderColor: '#0969da' }}>
      <strong style={{ color: '#0969da' }}>✅ state 在外壳 Shell 里，大子树用 children 传进来</strong>
      <div style={{ fontSize: 12, color: '#57606a' }}>
        Shell 自己渲染了 <strong>{renders.current}</strong> 次（它确实在渲染）
      </div>
      <p style={{ margin: '6px 0' }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="在这里打字，看列表的渲染次数"
          style={{ padding: 4, width: 240 }}
        />
      </p>
      {children}
    </div>
  )
}

function StateTopWithChildren() {
  // ⭐ 这个组件不持有状态，所以它**永远不会重渲染**
  //    → 下面这个 <HeavyList /> 的 element 只创建一次，引用永远不变
  //    → Shell 重渲染时，React 看到 children 是同一个 element → 直接复用，不重渲染列表
  return (
    <Shell>
      <HeavyList />
    </Shell>
  )
}

// ============================================================
// 页面
// ============================================================
export default function StatePlacementDemo() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>实验：分别在这三个输入框里打字，看下面列表的渲染次数</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            在 <strong>A</strong> 里打字 → 列表渲染次数<strong>飞涨</strong>（每敲一个字整个列表重渲染）
          </li>
          <li>
            在 <strong>B</strong> 里打字 → 列表<strong>一动不动</strong>（state 已经挪到 SearchBox 里了）
          </li>
          <li>
            在 <strong>C</strong> 里打字 → 列表也<strong>不动</strong>（children 技巧，同样的效果）
          </li>
        </ol>
      </div>

      <h3>A / B 对比：state 的位置比什么 hook 都重要</h3>
      <div style={{ display: 'grid', gap: 10 }}>
        <StateAtTop />
        <StateDown />
      </div>

      <h3>C：state 必须留在顶层时，用 children 技巧</h3>
      <StateTopWithChildren />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>为什么 children 能救？</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 12.5,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// ❌ 错的版本：state 在"创建 children 的那一层"
function Outer() {
  const [kw, setKw] = useState('')
  return <Shell><HeavyList /></Shell>
  //           ↑ kw 一变，Outer 重渲染 → 这里创建出**新的** element
  //             Shell 收到的 children 换了 → HeavyList 照样重渲染（技巧失效）
}

// ✅ 对的版本：state 在 Shell 里，children 由"永不重渲染的外层"创建
function Outer() {
  return <Shell><HeavyList /></Shell>
  //           ↑ Outer 没有 state，永远不重渲染 → 这个 element 引用永远不变
}
function Shell({ children }) {
  const [kw, setKw] = useState('')     // 状态在这里，Shell 会重渲染
  return <div><input ... />{children}</div>
  //        React 发现 children 还是同一个 element 对象 → 直接复用，不重渲染
}`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          这个技巧在真实项目里非常常用 —— 比如一个"带状态的 Modal / 带滚动位置的容器"，
          里面的内容用 children 传进去，就不会被动重渲染。
          <strong>它不需要 memo、不需要 useMemo，只是把 element 的创建位置挪了一下。</strong>
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>优化的优先级（从高到低）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>顺序</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>做什么</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>成本</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', '把 state 挪到真正用它的地方 / 用 children 技巧', '免费，代码还更短'],
              ['2', '拆组件（把大列表拆成"外壳 + 列表项"）', '低'],
              ['3', '列表项加 memo + props 用 useCallback/useMemo 稳住', '中，容易写错'],
              ['4', '虚拟列表（几百行以上才需要）', '高，要引库'],
              ['5', '到处包 memo / useMemo', '**负优化**，别做'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
