// ============================================================
// Day10-0：重渲染到底怎么发生的（今天所有内容的地基）
// ============================================================
// 📖 本文件名字对照表
//   RerenderBasics  重渲染基础（本页 /day10）
//   RenderBadge     渲染计数器（只在 dev 下会双倍，见页内说明）
//   ChildPlain      普通子组件   ChildMemo  memo 包过的子组件
//   useRef          计数器用它存（改它不触发渲染）
//
// ⭐ 一句话：**React 只会因为 4 种原因重渲染一个组件**
//   ① 它自己的 state 变了
//   ② 它的父组件重渲染了（且它没被 memo 拦住）
//   ③ 它读的 Context 值变了
//   ④ 它订阅的 store 切片变了（Zustand）
// 除此之外，什么都不会让它重渲染。

import { memo, useRef, useState } from 'react'

// ============================================================
// 渲染计数器：每次组件函数被调用就 +1
// ============================================================
// ⚠️ 两个必须知道的点：
//   1. 这是在 render 期间改 ref（严格说"不纯"），但用来做教学计数没问题
//   2. StrictMode 在 dev 下会把首次渲染跑两遍 → 挂载时数字会跳 2。
//      生产环境（npm run build 之后）不会双倍。
function RenderBadge({ name, color }: { name: string; color?: string }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <span
      className="tag"
      style={{ background: color ?? '#eaeef2', color: '#1f2328', marginLeft: 8, fontSize: 12 }}
    >
      {name} 渲染 {renders.current} 次
    </span>
  )
}

// ============================================================
// 实验 A：父组件重渲染 → 子组件跟着重渲染
// ============================================================
const ChildPlain = ({ label }: { label: string }) => (
  <div style={{ padding: '4px 0' }}>
    {label}
    <RenderBadge name="普通子" />
  </div>
)

const ChildMemo = memo(function ChildMemo({ label }: { label: string }) {
  return (
    <div style={{ padding: '4px 0' }}>
      {label}
      <RenderBadge name="memo 子" color="#dafbe1" />
    </div>
  )
})

function RerenderBasics() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验：点按钮让父组件重渲染，看哪些子组件跟着渲染</h3>
      <ParentDemo />
      <p className="hint" style={{ marginBottom: 0 }}>
        👆 每点一次「父组件 tick +1」：
        <strong>普通子组件必然 +1</strong>（父变它就变），
        <strong>memo 子组件不动</strong>（props 没变就跳过）。
        <br />
        注意页面刚打开时数字会跳 2 —— 那是 StrictMode 在 dev 下故意渲染两遍，不是 bug。
      </p>
    </div>
  )
}

function ParentDemo() {
  const [tick, setTick] = useState(0)
  return (
    <div>
      <p style={{ marginTop: 0 }}>
        父组件的 tick = <strong>{tick}</strong>{' '}
        <button className="btn" onClick={() => setTick((t) => t + 1)}>
          父组件 tick +1
        </button>
        <RenderBadge name="父" color="#ddf4ff" />
      </p>
      <ChildPlain label="① 普通子组件（props 永远不变）" />
      <ChildMemo label="② 被 memo 包住的子组件（props 永远不变）" />
    </div>
  )
}

// ============================================================
// 实验 B：memo 的三种失效方式
// ============================================================
// ⭐ 这是今天最实用的部分：**memo 不是万能药，props 不稳它就白包**。

type Config = { role: string }

const ChildPlain2 = ({ config }: { config: Config }) => (
  <div style={{ padding: '4px 0' }}>
    没包 memo
    <RenderBadge name="对照组" />
    <span style={{ color: '#8b949e', fontSize: 12 }}>（config.role = {config.role}）</span>
  </div>
)

const ChildMemoOk = memo(function ChildMemoOk({ config }: { config: Config }) {
  return (
    <div style={{ padding: '4px 0' }}>
      memo + useMemo 的对象
      <RenderBadge name="✅ 该跳过" color="#dafbe1" />
      <span style={{ color: '#8b949e', fontSize: 12 }}>（config.role = {config.role}）</span>
    </div>
  )
})

const ChildMemoBadObject = memo(function ChildMemoBadObject({ config }: { config: Config }) {
  return (
    <div style={{ padding: '4px 0' }}>
      memo + 内联对象 {'{{ role: "admin" }}'}
      <RenderBadge name="❌ 白包了" color="#ffebe9" />
      <span style={{ color: '#8b949e', fontSize: 12 }}>（config.role = {config.role}）</span>
    </div>
  )
})

const ChildMemoBadFn = memo(function ChildMemoBadFn({ onAction }: { onAction: () => void }) {
  return (
    <div style={{ padding: '4px 0' }}>
      memo + 内联函数 {'() => {}'}
      <RenderBadge name="❌ 也白包了" color="#ffebe9" />
      <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={onAction}>
        子组件按钮
      </button>
    </div>
  )
})

function MemoTrapDemo() {
  const [tick, setTick] = useState(0)

  // ⭐ 稳定引用：只有 /day10 这一页重新挂载才会变
  const stableConfig = useRef<Config>({ role: 'admin' }).current
  // ⭐ 故意不稳定：父组件每次渲染都新建
  const unstableConfig: Config = { role: 'admin' }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>四个 memo 子组件，只有两个真的能跳过</h3>
      <p style={{ marginTop: 0 }}>
        父组件 tick = <strong>{tick}</strong>{' '}
        <button className="btn" onClick={() => setTick((t) => t + 1)}>
          让父组件重渲染
        </button>
      </p>

      <ChildPlain2 config={unstableConfig} />
      <ChildMemoOk config={stableConfig} />
      <ChildMemoBadObject config={unstableConfig} />
      <ChildMemoBadFn onAction={() => {}} />

      <p className="hint" style={{ marginBottom: 0 }}>
        👆 每点一次，<strong>只有第 2 个（用 useRef 稳住的对象）会跳过渲染</strong>。
        第 3、4 个虽然包了 memo，但拿到的是<strong>每次新建的对象/函数</strong>，
        memo 比较引用 → 永远"变了" → 白包。
        <br />
        <strong>这就是 useMemo / useCallback 存在的唯一理由：给 memo 提供稳定的 props。</strong>
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function Day10Overview() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天要推翻两个迷信</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>迷信</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>真相</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['“重渲染 = 性能问题”', '重渲染只是"再调用一次函数"，绝大多数时候便宜到看不见。真正的瓶颈通常是别的东西（大列表、同步计算、频繁布局）'],
              ['“多加 memo / useMemo 准没错”', '每个 memo 都要做一次比较，useMemo 要存缓存。**包里不该包的，反而更慢，还多了 bug 面**'],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', whiteSpace: 'nowrap' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>1. 重渲染只会因为 4 种原因发生</h2>
      <RerenderBasics />

      <h2>2. memo 的三种失效方式</h2>
      <MemoTrapDemo />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>记住这张"什么时候该优化"的判据表</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>现象</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>大概率原因</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>该做什么</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['输入框打字卡', '输入时整棵列表都在重渲染', '拆组件 + memo 列表项；输入用防抖/受控优化'],
              ['几百行列表滚动卡', 'DOM 太多', '虚拟列表（不是 memo 能解决的）'],
              ['首屏加载慢', 'JS 包太大', '路由懒加载 / 代码分割'],
              ['点一下页面整个闪', '一个 state 放在了太上层', '把 state 往下挪（最常见、最有效的"优化"）'],
              ['什么都不卡', '——', '**什么都别做**'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>最后一行是全表最重要的。</strong> 没感觉到慢，就别优化 —— 你今天学这些东西，
          是为了"卡了知道该往哪查"，不是为了回去给所有组件包一层 memo。
        </p>
      </div>
    </div>
  )
}
