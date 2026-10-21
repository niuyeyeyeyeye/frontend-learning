// ============================================================
// Day2-3：条件渲染（以及 && 的一个大坑）
// ============================================================
// 三种写法：
//   ① 三元：cond ? <A /> : <B />        两个分支都有内容
//   ② &&  ：cond && <A />               条件为真才渲染
//   ③ 提前 return：函数里 if (!x) return null   整个组件不渲染

import { useState } from 'react'

export default function ConditionalBasics() {
  const [count, setCount] = useState(0)
  const [isLogin, setIsLogin] = useState(false)

  // 演示"各种假值渲染成什么"用的变量。
  // 注意：必须用【变量】而不是字面量 —— 直接写 {null && ...} 或 {false && ...}，
  // TS 会报 "This kind of expression is always falsy"（TS2873），挺严格的 ✅
  const maybeNull: string | null = null
  const maybeFalse: boolean = false
  const zero: number = 0
  const emptyStr: string = ''

  return (
    <div>
      <h3>1. 三元：两个分支</h3>
      <button className="btn-ghost" onClick={() => setIsLogin(!isLogin)}>
        切换登录状态
      </button>
      <p>{isLogin ? '✅ 欢迎回来，小明' : '❌ 请先登录'}</p>

      <h3>2. ⚠️ 大坑：count && 渲染出 0</h3>
      <div className="card">
        <button className="btn-ghost" onClick={() => setCount(count + 1)}>
          点一下（当前 count = {count}）
        </button>

        {/* ❌ 错误写法：count 是 0 时，{0 && <p>} 会渲染出数字 0！ */}
        {/* {count && <p>有 {count} 条数据</p>} */}

        {/* ✅ 正确写法 1：用比较运算，保证左边是 boolean */}
        {count > 0 && <p>✅ 有 {count} 条数据（count &gt; 0 &amp;&amp; ...）</p>}

        <p className="hint">
          下面四种"假值"渲染出来的结果不一样（我这个页面里，count 从 0 开始）：
        </p>
        <div className="hint" style={{ background: '#f6f8fa', padding: 8, borderRadius: 6 }}>
          <p>null：{maybeNull && <span>看不到我</span>}（什么都不渲染）</p>
          <p>false：{maybeFalse && <span>看不到我</span>}（什么都不渲染）</p>
          <p>0：{zero && <span>看不到我</span>} ← 你会看到 "0"！</p>
          <p>空字符串：{emptyStr && <span>看不到我</span>}（渲染为空，看着像没渲染）</p>
        </div>
        <p className="hint" style={{ color: '#cf222e' }}>
          ⭐ 规律：{'{false && X}'} 和 {'{null && X}'} 什么都不渲染；
          但 {'{0 && X}'} 会渲染出 <strong>0</strong>。
          所以用 &amp;&amp; 之前，**左边一定要是 boolean**。
        </p>
      </div>

      <h3>3. 提前 return：整个组件不渲染</h3>
      {/* 这个组件在下面定义，见 NotReady */}
      <NotReady show={isLogin} />

      <h3>4. 一个实用的模式：用变量先算好，再渲染</h3>
      <div className="card">
        {(() => {
          // 在组件里可以先用变量算好，让 JSX 保持干净
          const label = isLogin ? '已登录' : '未登录'
          const color = isLogin ? '#1f883d' : '#cf222e'
          return <p style={{ color }}>状态：{label}</p>
        })()}
        <p className="hint">
          复杂条件不要全塞进 JSX 里，先算出变量再引用（可读性会好很多）
        </p>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// 提前 return 的写法：条件不满足时直接 return null
// ------------------------------------------------------------
function NotReady({ show }: { show: boolean }) {
  if (!show) return null // ← 整个组件什么都不渲染
  return (
    <div className="card" style={{ marginTop: 8 }}>
      这个组件已经"准备好"了（只有 show 为 true 才渲染）
    </div>
  )
}
