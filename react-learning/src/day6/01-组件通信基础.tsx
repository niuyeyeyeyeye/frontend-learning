// ============================================================
// Day6-1：组件通信的三种基本方式
// ============================================================
// 📖 本文件名字对照表（读代码前先扫一眼；完整版见 00-命名对照表.md）
//   CommunicationBasics  组件通信·基础（本文件的出口组件）
//   SearchSection        搜索区块（父，持有 keyword）
//   SearchInput          搜索输入框（子，靠 onChange 请求父改）
//   ResultList           结果列表（子，靠 props 拿数据）
//   SearchInputProps     搜索输入框的属性类型（Props = 入参清单）
//   keyword              关键词       onChange   （值）变更时
//   ALL_FRUITS           全部水果（全大写 = 常量，不会变）
//   TemperatureConverter 温度转换器   celsius    摄氏度
//   toFahrenheit         转华氏       toCelsius  转摄氏      round1 保留 1 位小数
//   CelsiusInput         摄氏输入框   FahrenheitInput  华氏输入框（两个兄弟）
//   theme                主题         toggle     切换
//   THEME_STYLE          主题样式表（常量）
//   PropDrillingDemo     props 钻地演示   drilling = 打钻，一层层往下钻
//   Level1 / Level2 / Level3   第 1 / 2 / 3 层
// ============================================================
// React 的数据流是**单向**的：props 只能"往下"传（父 → 子）。
//
// 那"往上"怎么办？—— 靠函数。
//   父把函数作为 props 传给子，子一调用 → 数据就"顺着函数"回到父。
//
// 今天要学的三层：
//   ① 父 → 子：传数据（props）                     ← Day1 就会了，复习
//   ② 子 → 父：传函数（回调）                       ← 今天补
//   ③ 兄弟之间：**状态提升** —— 把 state 挪到最近的公共父组件
//   ④ 再往上：props 钻地（prop drilling）有多痛  ← 引出 Day6-2 的 Context

import { useState } from 'react'

// ============================================================
// ① + ② 一起演示：搜索框 + 结果列表（两个兄弟）
// ============================================================
// keyword 这个 state 放在父组件 SearchSection 里。
//   → SearchInput 需要它（显示 + 改它）：子 → 父，用 onChange 回调
//   → ResultList 需要它（过滤）：父 → 子，用 props
// 这就是"状态提升"：两个兄弟都要用的 state，放在它们共同的父组件里。

const ALL_FRUITS = ['苹果', '香蕉', '橙子', '西瓜', '葡萄', '芒果', '草莓', '蓝莓']

function SearchSection() {
  const [keyword, setKeyword] = useState('')

  return (
    <div className="card">
      {/* ⬇️ 父 → 子：keyword 往下传；子 → 父：setKeyword 包成 onChange 往下传 */}
      <SearchInput keyword={keyword} onChange={setKeyword} />
      <ResultList keyword={keyword} />
      <p className="hint">
        👆 输入框和列表是<strong>兄弟</strong>，它们能联动，是因为 state 被提到了父组件。
      </p>
    </div>
  )
}

type SearchInputProps = {
  keyword: string
  onChange: (next: string) => void
}

function SearchInput({ keyword, onChange }: SearchInputProps) {
  return (
    <input
      value={keyword}
      onChange={(e) => onChange(e.target.value)} // ⭐ 子不能直接改父的 state，只能"请求"父改
      placeholder="输入水果名试试"
      style={{ padding: 6, width: 240 }}
    />
  )
}

function ResultList({ keyword }: { keyword: string }) {
  const list = ALL_FRUITS.filter((f) => f.includes(keyword.trim()))
  return (
    <div style={{ marginTop: 8 }}>
      共 <strong>{list.length}</strong> 个：
      {list.map((f) => (
        <span key={f} className="tag" style={{ marginRight: 6 }}>
          {f}
        </span>
      ))}
      {list.length === 0 && <span style={{ color: '#999' }}>（没有匹配的）</span>}
    </div>
  )
}

// ============================================================
// ③ 兄弟通信（状态提升）再练一遍：温度转换
// ============================================================
// 两个输入框互相联动：改摄氏 → 华氏跟着变；改华氏 → 摄氏跟着变。
// 唯一能存"温度"的地方，就是它们的公共父组件。

function toFahrenheit(c: number): number {
  return c * 9 / 5 + 32
}
function toCelsius(f: number): number {
  return (f - 32) * 5 / 9
}
// 显示时保留 1 位小数，避免 25 → 77.0000000001 这种
const round1 = (n: number) => Math.round(n * 10) / 10

function TemperatureConverter() {
  const [celsius, setCelsius] = useState(25)

  return (
    <div className="card">
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitInput celsius={celsius} onChangeCelsius={setCelsius} />
      <p className="hint">
        👆 两个输入框都<strong>不持有 state</strong>，它们只是"显示器 + 遥控器"。
      </p>
    </div>
  )
}

function CelsiusInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ marginBottom: 6 }}>
      摄氏 ℃：
      <input
        type="number"
        value={round1(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: 4, width: 100 }}
      />
    </div>
  )
}

function FahrenheitInput({
  celsius,
  onChangeCelsius,
}: {
  celsius: number
  onChangeCelsius: (n: number) => void
}) {
  return (
    <div>
      华氏 ℉：
      <input
        type="number"
        value={round1(toFahrenheit(celsius))}
        // ⭐ 关键：别人给的是"华氏"，父组件存的是"摄氏" → 必须换算回去
        onChange={(e) => onChangeCelsius(toCelsius(Number(e.target.value)))}
        style={{ padding: 4, width: 100 }}
      />
    </div>
  )
}

// ============================================================
// ④ 反例：props 钻地（prop drilling）
// ============================================================
// theme 只有最里面那个 Level3 在用，但中间两层一行代码都用不上，
// 却必须"接住 → 原封不动往下传"。
// 层级一深（真实项目 5~8 层很常见），这就是灾难：改个字段名要改 8 个文件。
//
// 下一课（02-Context入门.tsx）专门治这个病。

type Theme = 'light' | 'dark'

const THEME_STYLE: Record<Theme, { background: string; color: string }> = {
  light: { background: '#fff', color: '#1f2328' },
  dark: { background: '#1f2328', color: '#f0f3f6' },
}

function PropDrillingDemo() {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <div>
      <button className="btn" onClick={toggle} style={{ marginBottom: 8 }}>
        切换主题（现在是 {theme}）
      </button>
      {/* ⬇️ theme 要穿过 3 层才到 Level3 */}
      <Level1 theme={theme} onToggle={toggle} />
      <p className="hint">
        👆 Level1 和 Level2 <strong>完全不用 theme</strong>，却必须声明它、接住它、再传下去。
        这就是 <strong>props 钻地</strong>。
      </p>
    </div>
  )
}

function Level1({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <div className="card">
      <div style={{ color: '#999', fontSize: 12 }}>Level1（我不用 theme，但得转发）</div>
      <Level2 theme={theme} onToggle={onToggle} />
    </div>
  )
}

function Level2({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <div className="card">
      <div style={{ color: '#999', fontSize: 12 }}>Level2（我不用 theme，但得转发）</div>
      <Level3 theme={theme} onToggle={onToggle} />
    </div>
  )
}

function Level3({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <div className="card" style={THEME_STYLE[theme]}>
      <div style={{ color: '#999', fontSize: 12 }}>Level3（真正用 theme 的人）</div>
      <p>
        我的背景是 <strong>{theme}</strong>
      </p>
      <button className="btn-ghost" onClick={onToggle}>我也能改</button>
    </div>
  )
}

// ============================================================
// 展示区
// ============================================================
export default function CommunicationBasics() {
  return (
    <div>
      <h3>1. 父 → 子（props）+ 子 → 父（回调）+ 兄弟（状态提升）</h3>
      <SearchSection />

      <h3>2. 状态提升：两个输入框互相联动</h3>
      <TemperatureConverter />

      <h3>3. 反例：props 钻地（3 层就开始烦了）</h3>
      <PropDrillingDemo />
    </div>
  )
}

/* ============================================================
 * 三句话记住今天这节
 * ============================================================
 *
 * 1. 数据往下走（props），事件往上走（回调函数）。
 * 2. 两个组件要共享数据 → 把数据放到它们"最近的公共父组件"里（状态提升）。
 * 3. 层级太深还硬传 → props 钻地 → 用 Context（下一节）。
 *
 * 【自测】不看代码，回答：
 *   Q: 为什么 SearchInput 里不能写 setKeyword('x')？
 *   A: 因为 setKeyword 不是它的东西，它没权限。子组件只能通过父给的
 *      onChange 函数"请求"父去改 —— 谁拥有 state，谁才有权改。
 *      这条叫"单一数据源"，是 React 排查 bug 的第一原则。
 * ============================================================ */
