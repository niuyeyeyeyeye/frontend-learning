// ============================================================
// Day6-2：Context —— 跨层级共享数据（治 props 钻地）
// ============================================================
// 📖 本文件名字对照表（完整版见 00-命名对照表.md）
//   ContextBasics        Context·基础（本文件的出口组件）
//   ThemeContext         主题上下文 / 主题"管道"（createContext 的产物）
//   ThemeContextValue    主题上下文里装的"东西"的类型（Value = 值）
//   useTheme             用主题（把 useContext 包成 hook + 忘包 Provider 就报错）
//   ThemeProvider        主题提供者（发报机：它包住的子树都能收到）
//   MiddleLayer          中间层（只排版，一个 props 都不传）
//   InnerCard            内层卡片（真正用 useTheme 的人）
//   RerenderDemo         重渲染演示（value 稳不稳的对照实验）
//   CountContext / CountContextValue   计数上下文 / 它的值类型
//   badValue / goodValue 坏的值 / 好的值（坏 = 每次渲染都新建对象）
//   tick                 滴答（跟主题无关的计数器，点它看谁白渲染）
//   RenderLogger         渲染日志器（每次渲染往控制台打一行）
//   ctx                  context 的缩写（const ctx = useContext(...)）
//   children             子元素（标签中间夹的东西）
// ============================================================
// 一句话：Context 让"某个值"跳过中间层，直接被任意深度的后代组件拿到。
//
// 三个 API，只考这三个：
//   createContext(默认值)       创建"管道"
//   <Ctx.Provider value={...}>  在管道上方"注入"值
//   useContext(Ctx)             在管道下方任意位置"取"值
//
// ⚠️ 必须先想清楚一件事（这是本节的重点）：
//   **Context 不是"全局变量"，它是"某个子树范围内的共享值"。**
//   不要拿它当状态管理库用 —— 它没有性能优化，只解决"传得烦"。

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// ============================================================
// 一、最小可用版本：主题（light / dark）
// ============================================================
// 第一步：定义类型 + createContext
//   ⚠️ 默认值写 null，然后靠自定义 hook 在"忘了包 Provider"的时候报错。
//      如果直接给一个假对象当默认值，用错了不会报错 → 排查起来要命。

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ============================================================
// 二、⭐ 把 useContext 包成一个自定义 hook
// ============================================================
// 这是 React 圈的标准写法（社区叫 "context + hook 模式"）：
//   1. 组件里只写 const { theme } = useTheme()，不关心 Context 对象叫什么
//   2. 忘了包 Provider 时，直接报一句人话错误，而不是 "Cannot read property of null"
//   3. 以后想换实现（换成 Zustand），只改这个 hook，调用方一行不用动

function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext) // ctx = context 的缩写（社区常见简写）
  if (ctx === null) {
    throw new Error('useTheme 必须在 <ThemeProvider> 内部使用')
  }
  return ctx
}

// ============================================================
// 三、Provider 组件：把 state + 逻辑都收进来
// ============================================================
// ⚠️ 坑：value={ { theme, toggleTheme } } 这样写，每次渲染都是**新对象**，
//    React 会认为"值变了"→ 所有消费者全部重新渲染。
//    所以用 useMemo 把 value 稳住，依赖写"value 里真正用到的东西"。

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme }),
    [theme], // ⭐ 只有 theme 变，value 才换新对象
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// ============================================================
// 四、深层组件：中间层一行 props 都不用写
// ============================================================

const THEME_BG: Record<Theme, { background: string; color: string }> = {
  light: { background: '#fff', color: '#1f2328' },
  dark: { background: '#1f2328', color: '#f0f3f6' },
}

function ContextDemo() {
  return (
    <ThemeProvider>
      <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>
        Outer（不用 theme，也不传 props）
      </div>
      <MiddleLayer />
      <p className="hint">
        👆 和上一节对比：MiddleLayer / InnerCard <strong>没有任何 theme props</strong>，
        但一样能读到、能改。
      </p>
    </ThemeProvider>
  )
}

function MiddleLayer() {
  return (
    <div className="card">
      <div style={{ color: '#999', fontSize: 12 }}>MiddleLayer（只负责包一层，什么都不传）</div>
      <InnerCard />
    </div>
  )
}

function InnerCard() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="card" style={THEME_BG[theme]}>
      <p>
        我在最里层，读到 theme = <strong>{theme}</strong>
      </p>
      <button className="btn-ghost" onClick={toggleTheme}>
        点我切换（整个子树一起变）
      </button>
    </div>
  )
}

// ============================================================
// 五、⚠️ 最常见的坑：value 不稳 → 无谓的重新渲染
// ============================================================
// 下面两个 Provider 的**唯一区别**是 value 有没有 useMemo：
//   ❌ badValue  = { count }                 → 每次父组件渲染都新建
//   ✅ goodValue = useMemo(() => ({count}), [count])
//
// 动手验证：打开 F12 控制台 → 点"tick +1"（这个 state 跟 count 完全无关）
//   → 你会看到 [❌ 没 useMemo] 的日志又打了一次，而 [✅ 用了 useMemo] 没有。
//   → 这就是"provider 白渲染，消费者跟着白渲染"。

type CountContextValue = { count: number }
const CountContext = createContext<CountContextValue>({ count: 0 })

function RerenderDemo() {
  const [count, setCount] = useState(0)
  const [tick, setTick] = useState(0) // 和 Context 毫无关系

  const badValue: CountContextValue = { count } // ❌ 每次渲染新建对象
  const goodValue = useMemo<CountContextValue>(() => ({ count }), [count]) // ✅

  return (
    <div className="card">
      <p>
        count = <strong>{count}</strong>，tick = <strong>{tick}</strong>
      </p>
      <button className="btn" style={{ marginRight: 8 }} onClick={() => setCount((c) => c + 1)}>
        count +1（应该引起消费者渲染）
      </button>
      <button className="btn-ghost" onClick={() => setTick((t) => t + 1)}>
        tick +1（不该引起消费者渲染）
      </button>

      <CountContext.Provider value={badValue}>
        <RenderLogger name="❌ 没 useMemo" />
      </CountContext.Provider>

      <CountContext.Provider value={goodValue}>
        <RenderLogger name="✅ 用了 useMemo" />
      </CountContext.Provider>

      <p className="hint">
        👆 打开 F12 控制台，然后只点"tick +1"，看哪一行日志多出来了。
      </p>
    </div>
  )
}

function RenderLogger({ name }: { name: string }) {
  const { count } = useContext(CountContext)
  // 没有依赖数组的 effect = 每次提交（commit）后都跑一次，正好当"渲染日志"用
  // ⚠️ 页面刚打开时每条会打印两次 —— 这是 StrictMode 在 dev 下故意把 effect 跑两遍
  //    （用来帮你发现"没写清理函数"的 bug），不是这个例子的 bug。
  useEffect(() => {
    console.log(`[${name}] 渲染了一次，读到的 count = ${count}`)
  })
  return (
    <div className="card" style={{ padding: '6px 10px' }}>
      {name}：count = <strong>{count}</strong>
    </div>
  )
}

// ============================================================
// 展示区
// ============================================================
export default function ContextBasics() {
  return (
    <div>
      <h3>1. 最小可用版本：主题切换，中间层不传 props</h3>
      <ContextDemo />

      <h3>2. 坑：value 不是稳定引用 → 消费者白渲染</h3>
      <RerenderDemo />
    </div>
  )
}

/* ============================================================
 * 本节自测（先自己答，再往下看）
 * ============================================================
 * Q1: createContext 的默认值，什么时候会被用到？
 *     A: 只有"上方没有 Provider"时才会用到。所以默认值写 null + hook 里报错，
 *        是最能帮你抓 bug 的写法。
 *
 * Q2: 既然 Context 能跨层，为什么不把所有 state 都塞进去？
 *     A: (1) 它没有性能优化：value 一变，所有消费者全渲染；
 *        (2) 状态一多，一个 Provider 文件会变成"上帝对象"，改一处全是连锁反应；
 *        (3) 并不是所有状态都需要跨层，纯局部的 state 留在组件里更清晰。
 *        → 适合放：主题、登录用户、语言、当前路由。不适合放：一堆表单临时值。
 *
 * Q3: Provider 能不能嵌套？内层会不会影响外层？
 *     A: 能嵌套，就近原则 —— 内层 Provider 只管自己的子树。
 *        这也是"同一个 Context 在不同子树有不同值"的实现方式。
 *
 * Q4: 那 useMemo 的依赖 [theme] 里，要不要写 toggleTheme？
 *     A: 严格说要（eslint 会提醒）。但这里 toggleTheme 每次渲染都是新函数，
 *        写进去等于每次都变 → useMemo 失去意义。正确做法是把它也 useCallback 包起来。
 *        → 生产代码里：useMemo + useCallback 成对出现，或者干脆用 useReducer
 *          （Day7 讲）让 dispatch 天然稳定。
 * ============================================================ */
