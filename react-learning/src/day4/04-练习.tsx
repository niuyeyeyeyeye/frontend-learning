// ============================================================
// Day4-4：你的练习
// ============================================================
// 规则：补完 TODO → 保存 → 浏览器看效果
// 卡 20 分钟看文件底部的参考答案

import { useEffect, useState } from 'react'

// ------------------------------------------------------------
// 练习 1：让浏览器标签显示未完成数量
// 要求：页面有一个待办数组（已给），用 useEffect 把
//       document.title 改成 "待办（N）"，其中 N 是未完成的条数
// 提示：依赖数组里写 todos
// ------------------------------------------------------------
function TitleSync() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学 useEffect', done: false },
    { id: 2, text: '写练习', done: true },
    { id: 3, text: '复习算法', done: false },
  ])

  // TODO 1：写 useEffect，把 document.title 改成 `待办（${未完成数}）`

  return (
    <div>
      <p className="hint">看浏览器标签，应该显示"待办（2）"；点下面按钮后数字要跟着变</p>
      {todos.map((t) => (
        <div key={t.id} className="card">
          <input
            type="checkbox"
            checked={t.done}
            onChange={() =>
              setTodos(todos.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
            }
          />{' '}
          {t.text}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 练习 2：倒计时
// 要求：
//   - 输入一个秒数（默认 10），点"开始"后每秒减 1，到 0 显示"时间到！"
//   - **必须写清理函数**（否则切走或重开会有多个定时器同时跑）
// 提示：用 useState 存剩余秒数 + isRunning，useEffect 里开 setInterval
// ------------------------------------------------------------
function Countdown() {
  const [seconds, setSeconds] = useState(10)
  const [running, setRunning] = useState(false)

  // TODO 2：写 useEffect，实现倒计时 + 清理函数

  return (
    <div>
      <p>
        剩余：<strong>{seconds}</strong> 秒 {seconds === 0 ? '⏰ 时间到！' : ''}
      </p>
      <button
        className="btn"
        onClick={() => {
          setSeconds(10)
          setRunning(true)
        }}
      >
        开始倒计时
      </button>
      {' '}
      <button className="btn-ghost" onClick={() => setRunning(false)}>
        暂停
      </button>
    </div>
  )
}

// ------------------------------------------------------------
// 练习 3：键盘监听
// 要求：监听 keydown，把最近按下的 5 个键显示出来
//       组件里要有输入框，输入框里的按键也要能捕获（试试 e.key）
// 提示：window.addEventListener('keydown', ...) + 清理函数
// ------------------------------------------------------------
function KeyLogger() {
  // TODO 3：用 useState 存按键数组，useEffect 里加 window keydown 监听 + 清理

  return (
    <div>
      <p className="hint">随便按几个键，看下面</p>
      <div className="card">（练习 3 还没实现）</div>
    </div>
  )
}

// ------------------------------------------------------------
// 展示区（不用改）
// ------------------------------------------------------------
export default function PracticeDay4() {
  return (
    <div>
      <h3>练习 1：同步浏览器标题</h3>
      <TitleSync />

      <h3>练习 2：倒计时（必须写清理函数）</h3>
      <Countdown />

      <h3>练习 3：键盘监听</h3>
      <KeyLogger />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   useEffect(() => {
 *     const left = todos.filter(t => !t.done).length
 *     document.title = `待办（${left}）`
 *   }, [todos])
 *
 * 练习 2：
 *   useEffect(() => {
 *     if (!running || seconds <= 0) return
 *     const id = setInterval(() => {
 *       setSeconds(s => s - 1)          // ⭐ 函数式更新：不依赖外部 seconds
 *     }, 1000)
 *     return () => clearInterval(id)    // ⭐ 清理：暂停/卸载时清掉
 *   }, [running])                       // ⭐ 只依赖 running（因为用了函数式更新）
 *
 *   ——注意 setSeconds(s => s - 1) 用的是函数式更新，所以依赖数组里不需要 seconds，
 *     否则每次 seconds 变化都会重建定时器（虽然能跑，但没必要）。
 *
 * 练习 3：
 *   const [keys, setKeys] = useState<string[]>([])
 *   useEffect(() => {
 *     const onKey = (e: KeyboardEvent) => {
 *       setKeys(prev => [...prev.slice(-4), e.key])   // 只留最近 5 个
 *     }
 *     window.addEventListener('keydown', onKey)
 *     return () => window.removeEventListener('keydown', onKey)   // ⭐ 清理必须用同一个函数引用
 *   }, [])
 *
 * 【做完后想一件事】
 * 练习 2 的依赖数组，为什么可以用 [running] 而不是 [running, seconds]？
 * 答：因为 setSeconds(s => s - 1) 是"函数式更新"——它不读外部的 seconds，
 *     React 会把最新的值传给 s。所以 effect 里没有用到 seconds，就不需要把它写进依赖。
 *     ⭐ 这条是 useEffect 依赖数组的核心原则：**用了什么，才写什么**。
 * ============================================================ */
