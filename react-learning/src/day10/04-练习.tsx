// ============================================================
// Day10-4：你的练习
// ============================================================
// 📖 本文件名字对照表
//   PracticeDay10   今天的练习页（/day10/practice）
//   WrongPlace      练习 1：state 放错位置，你来修
//   BadMemoList     练习 2：memo 白包了，你来修
//   LazyThing       练习 3：你自己写一个懒加载
//
// 规则：补完 TODO → 保存 → 浏览器看效果（用渲染次数判断对错）

import { memo, useCallback, useRef, useState } from 'react'
import { lazy, Suspense } from 'react'

// 小工具：显示渲染次数（不用改）
function Badge({ name }: { name: string }) {
  const r = useRef(0)
  r.current += 1
  return (
    <span className="tag" style={{ marginLeft: 8, fontSize: 11 }}>
      {name} {r.current} 次
    </span>
  )
}

// ============================================================
// 练习 1 ⭐⭐：state 放在太上层，打字时整个大列表都在重渲染
// ============================================================
// 要求：让「在大框里打字」时，BigList 的渲染次数**不再增加**
//   （提示：把 keyword 这个 state 挪到只用到它的那个组件里 —— 不需要任何 hook）
// ------------------------------------------------------------

function BigList() {
  return (
    <div className="card" style={{ padding: 8 }}>
      100 项列表
      <Badge name="BigList" />
      <div style={{ maxHeight: 70, overflow: 'auto', fontSize: 12, color: '#8b949e' }}>
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} style={{ marginRight: 6 }}>
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  )
}

function WrongPlace() {
  // ❌ TODO 1：把这个 state 挪到该去的地方
  const [keyword, setKeyword] = useState('')
  void setKeyword

  return (
    <div className="card" style={{ borderColor: '#cf222e' }}>
      父组件 —— 打字时列表会跟着重渲染
      <Badge name="WrongPlace" />
      <p style={{ margin: '6px 0' }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="在大框里打字，看 BigList 的次数"
          style={{ padding: 4, width: 260 }}
        />
      </p>
      <BigList />
    </div>
  )
}

// ============================================================
// 练习 2 ⭐⭐⭐：memo 包了，但 props 不稳定，等于白包
// ============================================================
// 要求：让 BadMemoList 的渲染次数在「父组件重渲染」时**不再增加**
//   a) 给子组件加上 memo（现在没加）
//   b) 用 useCallback / useMemo 让传进去的函数和对象保持稳定
// ------------------------------------------------------------

type Filters = { sort: 'asc' | 'desc' }

const BadMemoList = ({ filters, onPick }: { filters: Filters; onPick: (id: number) => void }) => {
  return (
    <div className="card" style={{ padding: 8 }}>
      列表（排序：{filters.sort}）
      {/* 用一个 ref 计数，避免额外 state */}
      <Counter />
      <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={() => onPick(1)}>
        pick 1
      </button>
    </div>
  )
}

function Counter() {
  const r = useRef(0)
  r.current += 1
  return (
    <span className="tag" style={{ fontSize: 11 }}>
      BadMemoList {r.current} 次
    </span>
  )
}

function BadMemoListParent() {
  const [tick, setTick] = useState(0)

  // TODO 2-a：用 useMemo 稳住 filters（依赖数组自己判断）
  const filters: Filters = { sort: 'asc' }

  // TODO 2-b：用 useCallback 稳住 onPick
  const onPick = (id: number) => {
    void id
  }

  return (
    <div className="card">
      父组件 tick = {tick}
      <Badge name="父" />
      <button className="btn" style={{ marginLeft: 8 }} onClick={() => setTick((t) => t + 1)}>
        让父组件重渲染
      </button>
      <BadMemoList filters={filters} onPick={onPick} />
      <p className="hint" style={{ marginBottom: 0 }}>
        TODO：现在每点一次上面的按钮，BadMemoList 的次数都会 +1。修好之后它应该**不动**。
      </p>
    </div>
  )
}

// ============================================================
// 练习 3 ⭐：自己写一个懒加载
// ============================================================
// 要求：用 lazy + Suspense 把「重内容」改成点击才加载
//   （重内容就用下面这个 HeavyContent，不要改它）
// ------------------------------------------------------------

function HeavyContent() {
  return (
    <div className="card" style={{ padding: 8, borderColor: '#0969da' }}>
      ✅ 我是懒加载进来的重内容（渲染了 500 项）
      <div style={{ maxHeight: 60, overflow: 'auto', fontSize: 12, color: '#8b949e' }}>
        {Array.from({ length: 500 }, (_, i) => (
          <span key={i} style={{ marginRight: 4 }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}

// ❌ TODO 3：现在它是普通 import（一进页面就加载了）
//    改成：const LazyContent = lazy(() => import(...))
//    然后下面用 <Suspense fallback={...}><LazyContent /></Suspense>
const LazyContent = HeavyContent

function LazyPractice() {
  const [show, setShow] = useState(false)
  return (
    <div className="card">
      <button className="btn" onClick={() => setShow((s) => !s)}>
        {show ? '藏起来' : '加载重内容'}
      </button>
      <Suspense fallback={<p style={{ color: '#8b949e' }}>⏳ 加载中……</p>}>
        {show && <LazyContent />}
      </Suspense>
      <p className="hint" style={{ marginBottom: 0 }}>
        TODO：做完之后，点按钮会先看到「加载中」（因为文件是点击时才请求的）。
      </p>
    </div>
  )
}

// ============================================================
// 展示区（不用改）
// ============================================================
export default function PracticeDay10() {
  return (
    <div>
      <h2>练习 1 ⭐⭐：state 放错位置</h2>
      <WrongPlace />

      <h2>练习 2 ⭐⭐⭐：memo + 稳定 props</h2>
      <BadMemoListParent />

      <h2>练习 3 ⭐：自己写懒加载</h2>
      <LazyPractice />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：把 state 挪下去 + 用 children 技巧都行
 *
 *   // 办法 A：把 state 挪进一个小组件
 *   function SearchInput() {
 *     const [keyword, setKeyword] = useState('')
 *     return <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
 *   }
 *   function WrongPlace() {
 *     return <div className="card"><SearchInput /><BigList /></div>
 *   }
 *   ← keyword 只影响 SearchInput，BigList 是兄弟，完全不受影响
 *
 *   // 办法 B：state 必须留在父组件时，用 children
 *   function Shell({ children }) {
 *     const [keyword, setKeyword] = useState('')
 *     return <div><input ... />{children}</div>
 *   }
 *   function WrongPlace() {
 *     return <Shell><BigList /></Shell>
 *   }
 *
 * 练习 2：
 *   const BadMemoList = memo(function BadMemoList({ filters, onPick }) { ... })
 *
 *   const filters = useMemo<Filters>(() => ({ sort: 'asc' }), [])   // 依赖为空：永远不变
 *   const onPick = useCallback((id: number) => { void id }, [])      // 同上
 *
 *   ⚠️ 注意 filters 的依赖是 [] 因为 sort 是写死的 'asc'。
 *      如果 sort 是个 state，依赖就得写 [sort]。
 *
 * 练习 3：
 *   const LazyContent = lazy(async () => {
 *     const mod = await import('./重内容')      // 指向一个真实存在的文件才生效
 *     return { default: mod.default }
 *   })
 *   ← 关键：被懒加载的组件**必须写在另一个文件里**（同一个文件没法拆出去）。
 *     所以这题的真实做法是：把 HeavyContent 挪到 day10/HeavyContent.tsx，
 *     然后 lazy(() => import('./HeavyContent'))。
 *
 * 【三个自问】
 * 1. 练习 1 修好之后，为什么不需要 memo？
 *    答：因为"不该渲染"的那棵子树，压根没有从父组件重新渲染 —— state 挪走了，
 *        父组件都不渲染了。memo 是用来处理"必须渲染但想跳过"的情况。
 *
 * 2. 练习 2 里如果 onPick 依赖了 tick，还能用 useCallback 吗？
 *    答：能，但依赖一变引用就变，memo 还是会失效 —— 这是正常的：
 *        **回调真的依赖新值时，它就是"新函数"，memo 就该失效**。
 *        别为了"让 memo 生效"去乱删依赖，那是 bug。
 *
 * 3. 懒加载有没有副作用？
 *    答：有 —— 多一次网络请求（首次点击会等一下）。所以：
 *        · 首屏必须显示的内容不要懒加载
 *        · 用户很少点的重型功能（图表、编辑器、导出）最适合
 * ============================================================ */
