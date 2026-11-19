// ============================================================
// 补课-2：useReducer —— 把"状态怎么变"写成可测试的纯函数
// ============================================================
// 📖 名字对照
//   useReducer   用 reducer 管状态            dispatch   发一个"动作"
//   reducer      (state, action) => 新 state 纯函数，不碰外部世界
//   action       { type: '...', ...数据 }    一个描述"发生了什么"的对象
//   Action       用可辨识联合（discriminated union）定义所有 action
//
// ⭐ 一句话：**useReducer 不是"另一个 useState"，它是"把状态变化写成 switch"。**
//   好处只有三个：① 变化逻辑集中在一处 ② 复杂状态不会越写越乱 ③ 能直接单元测试

import { createContext, useContext, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'

// ============================================================
// 一、先把 action 定义清楚（这是 useReducer 最值钱的地方）
// ============================================================
// 用"可辨识联合"：每个 action 有一个固定的 type，TS 会自动收窄参数类型。
// 好处：dispatch 写错 type 立刻报错；写 switch 时有自动补全。
type Todo = { id: number; text: string; done: boolean }

type Action =
  | { type: 'add'; id: number; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearDone' }

// ============================================================
// 二、reducer：纯函数
// ============================================================
// ⚠️ 三条铁律（都是你已经踩过的坑）：
//   1. **必须返回新对象**，不能改 state（Day3 的不可变更新）
//   2. **不能有副作用**：不能发请求、不能 console、不能改外部变量
//   3. **默认分支要返回 state**（不然未匹配的 action 会把状态变成 undefined）
//
// 为什么"不能有副作用"这么严格？因为 StrictMode 会**把 reducer 调用两次**（dev 下）。
// 纯函数调两次结果一样；有副作用就会执行两遍。

let reducerCalls = 0 // ⚠️ 这是故意加的副作用，用来给你看调用次数（真实项目别这么写）

function todoReducer(state: Todo[], action: Action): Todo[] {
  reducerCalls += 1

  switch (action.type) {
    case 'add': {
      const text = action.text.trim()
      if (text === '') return state // 空文本：返回原状态，不产生新引用
      // ⭐ id 是外面传进来的，不是在这里生成的
      //    因为 Date.now() / 自增计数器都是"副作用"，放进 reducer 就破坏纯度
      return [...state, { id: action.id, text, done: false }]
    }
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    case 'clearDone':
      return state.filter((t) => !t.done)
    default:
      return state
  }
}

const INITIAL: Todo[] = [
  { id: 1, text: '读一遍 reducer 的三条铁律', done: true },
  { id: 2, text: '点几下，看 dispatch 怎么改 state', done: false },
]

function Demo1() {
  const [todos, dispatch] = useReducer(todoReducer, INITIAL)
  const nextId = useRef(100) // ⭐ id 在外面生成，reducer 只负责"按 id 放进去"

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 1：一个 reducer 管四种操作</h3>
      <p style={{ marginTop: 0 }}>
        <button
          className="btn"
          onClick={() => dispatch({ type: 'add', id: nextId.current++, text: '新的一条' })}
        >
          dispatch add
        </button>{' '}
        <button className="btn-ghost" onClick={() => dispatch({ type: 'clearDone' })}>
          dispatch clearDone
        </button>{' '}
        <span style={{ color: '#8b949e', fontSize: 12 }}>
          reducer 累计被调用 <strong>{reducerCalls}</strong> 次
        </span>
      </p>

      <ul style={{ margin: '0 0 8px', paddingLeft: 20 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ marginBottom: 4 }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: 'toggle', id: t.id })}
              />{' '}
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </label>{' '}
            <button className="btn-ghost" onClick={() => dispatch({ type: 'remove', id: t.id })}>
              删
            </button>
          </li>
        ))}
      </ul>

      <p className="hint" style={{ marginBottom: 0 }}>
        ⚠️ 看那个调用次数：<strong>点一次按钮，它 +2</strong>（dev 下 StrictMode 把 reducer 调了两次）。
        <br />
        这就是为什么 reducer 必须纯 —— 如果里面写了 <code>list.push(x)</code>，
        dev 下你会得到 2 条，生产 1 条，出现"本地对、线上错"。
      </p>
    </div>
  )
}

// ============================================================
// 三、useState vs useReducer：什么时候用哪个
// ============================================================
function Compare() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 2：判断标准（面试会问这个）</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#57606a' }}>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>你的情况</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>用哪个</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['1~2 个独立的简单值（开关、输入框）', 'useState'],
            ['多个字段互相关联（表单 + 校验 + 提交状态）', 'useReducer'],
            ['下个状态依赖上上个状态（撤销/重做）', 'useReducer'],
            ['同一个状态有 4 种以上改法', 'useReducer'],
            ['想把"怎么变"抽出来单独测试', 'useReducer'],
          ].map(([a, b]) => (
            <tr key={a}>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                <strong>{b}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>一句话判断</strong>：改法超过 3 种，或者几个值必须一起变 → 上 reducer。
        反之 <code>useState</code> 更短更清楚，别为了"高级"用它。
      </p>
    </div>
  )
}

// ============================================================
// 四、⭐ Context + useReducer = 手写 mini-Redux
// ============================================================
// 这是 React 里最经典的组合：reducer 管"怎么变"，Context 管"谁能拿到"。
// 你在 Day6 学过 Context（传值管道），今天把"值的计算"换成 reducer。
//
// dispatch 是**稳定引用**（React 保证），所以可以放心地放进 Context 的 value 里，
// 不用 useCallback —— 这也是 useReducer 相比 useState 的一个隐藏好处。

type CounterState = { count: number }
type CounterAction = { type: 'inc' } | { type: 'dec' } | { type: 'reset' }

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 }
    case 'dec':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

const CountCtx = createContext<{ state: CounterState; dispatch: (a: CounterAction) => void } | null>(
  null,
)

function CountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 })
  // ⭐ dispatch 是稳定引用，所以 value 只在 count 变化时才变
  return <CountCtx.Provider value={{ state, dispatch }}>{children}</CountCtx.Provider>
}

function useCount() {
  const ctx = useContext(CountCtx)
  if (ctx === null) throw new Error('useCount 必须在 CountProvider 里用')
  return ctx
}

function Display() {
  const { state } = useCount()
  return (
    <span>
      第 3 层看到的 count = <strong>{state.count}</strong>
    </span>
  )
}

function Buttons() {
  const { dispatch } = useCount()
  return (
    <span>
      <button className="btn-ghost" onClick={() => dispatch({ type: 'dec' })}>
        -1
      </button>{' '}
      <button className="btn" onClick={() => dispatch({ type: 'inc' })}>
        +1
      </button>{' '}
      <button className="btn-ghost" onClick={() => dispatch({ type: 'reset' })}>
        reset
      </button>
    </span>
  )
}

function Demo3() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 3：Context + useReducer（mini-Redux）</h3>
      <CountProvider>
        <div className="card" style={{ padding: 8 }}>
          {/* 中间隔一层，证明不用传 props */}
          <div style={{ paddingLeft: 12 }}>
            <Display />
          </div>
        </div>
        <Buttons />
      </CountProvider>
      <p className="hint" style={{ marginBottom: 0 }}>
        这就是 Redux 的骨架：<strong>reducer（纯函数）+ dispatch（发动作）+ Provider（跨层共享）</strong>。
        面试问"Redux 原理"，你把这个讲一遍就够。
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function UseReducerDemo() {
  return (
    <div>
      <h2>1. 一个 reducer 管四种操作</h2>
      <Demo1 />

      <h2>2. useState 还是 useReducer</h2>
      <Compare />

      <h2>3. Context + useReducer = 手写 mini-Redux</h2>
      <Demo3 />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>四句话记住 useReducer</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            写法：<code>const [state, dispatch] = useReducer(reducer, 初始值)</code>，
            改状态靠 <code>dispatch({'{ type: "..." }'})</code>
          </li>
          <li>
            <strong>reducer 必须是纯函数</strong>：返回新对象、无副作用、默认分支返回 state
            （StrictMode dev 下调两次）
          </li>
          <li>
            <strong>改法超过 3 种、或几个值要一起变</strong> → 用 reducer；<strong>否则 useState 更短</strong>
          </li>
          <li>
            <strong>dispatch 是稳定引用</strong>，所以 Context 的 value 里放 dispatch 不用 useCallback
          </li>
        </ol>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⏱ 10 分钟动手（这节必做）</h3>
        <p style={{ marginTop: 0 }}>
          打开 <code>src/day8/04-练习.tsx</code>，把练习 1 的 <code>useCountStore</code>（Zustand）
          <strong>改写成 useReducer 版本</strong>：
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 10,
            borderRadius: 6,
            fontSize: 12.5,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// 要求：
// 1. 定义 type Action = { type: 'inc' } | { type: 'reset' }
// 2. 写一个 countReducer
// 3. 在 CounterA / CounterB 里各自 useReducer（注意：状态不再共享了！）
//
// ⭐ 关键体会：这就是 useReducer 和 Zustand 的区别 ——
//    useReducer 的状态住在组件里，两个组件各有一份，不共享。`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>验证标准</strong>：点 A 的 +1，A 变、B 不变 → 说明你理解了"reducer 不管共享"。
          <br />
          想共享就要配合 Context（本页实验 3）或 Zustand（Day8）。
        </p>
      </div>
    </div>
  )
}
