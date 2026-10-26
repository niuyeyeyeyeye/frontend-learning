// ============================================================
// Day4-5：变式练习（验证你是不是"真的会了"）
// ============================================================
// 为什么要有这份文件？
//   同一道题重写第二遍，很容易变成"回忆上次怎么写的" = 背答案。
//   这里换成三个新场景，知识点完全一样（useEffect + 定时器 + 清理 + 监听），
//   但如果你真的理解了，就应该能做出来；如果只会背答案，这里会立刻卡住。
//
// 规则：
//   ① 先不看底部答案，自己写
//   ② 每个练习 15 分钟，卡住看提示
//   ③ 三个都能独立写出来 → Day4 真完成

import { useEffect, useState } from 'react'

// ------------------------------------------------------------
// 练习 1：秒表
// 要求：
//   - 显示经过的秒数（保留 1 位小数，比如 "3.4 秒"）
//   - 点"开始"每 100ms 加 0.1 秒；点"暂停"停下；点"重置"归零
//   - **必须写清理函数**（暂停/卸载时清定时器）
// 提示：状态可以是 elapsed（秒数）+ running（是否在跑）
//       用 setElapsed(e => e + 0.1) 这种函数式更新
// ------------------------------------------------------------
function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)

  // TODO 1：写 useEffect（定时器 + 清理 + 依赖数组）

  return (
    <div>
      <p>
        经过：<strong>{elapsed.toFixed(1)}</strong> 秒
      </p>
      <button className={running ? 'btn-ghost' : 'btn'} onClick={() => setRunning(!running)}>
        {running ? '暂停' : '开始'}
      </button>
      {' '}
      <button className="btn-ghost" onClick={() => { setRunning(false); setElapsed(0) }}>
        重置
      </button>
    </div>
  )
}

// ------------------------------------------------------------
// 练习 2：鼠标位置追踪
// 要求：
//   - 显示鼠标当前坐标 (x, y)
//   - 再显示"移动了多少次"
//   - **必须写清理函数**移除监听
// 提示：window.addEventListener('mousemove', onMove) + removeEventListener
// ------------------------------------------------------------
function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [moves, setMoves] = useState(0)

  // TODO 2：写 useEffect（mousemove 监听 + 计数 + 清理）

  return (
    <div>
      <p>
        坐标：<strong>({pos.x}, {pos.y})</strong>　移动次数：<strong>{moves}</strong>
      </p>
      <p className="hint">在页面上移动鼠标试试</p>
    </div>
  )
}

// ------------------------------------------------------------
// 练习 3：页面可见性统计
// 要求：
//   - 显示"你切走页面的次数"
//   - 显示当前状态（当前页 / 已切走）
//   - **必须写清理函数**移除监听
// 提示：document.hidden 为 true 表示切走了；
//       document.addEventListener('visibilitychange', onVisible)
// ------------------------------------------------------------
function VisibilityTracker() {
  const [hiddenCount, setHiddenCount] = useState(0)
  const [isHidden, setIsHidden] = useState(false)

  // TODO 3：写 useEffect（visibilitychange 监听 + 清理）

  return (
    <div>
      <p>
        当前状态：<strong>{isHidden ? '已切走' : '当前页'}</strong>　
        切走次数：<strong>{hiddenCount}</strong>
      </p>
      <p className="hint">切到别的标签页再切回来，看数字变化（切回来时能看到）</p>
    </div>
  )
}

// ------------------------------------------------------------
// 展示区（不用改）
// ------------------------------------------------------------
export default function PracticeDay4Variant() {
  return (
    <div>
      <h3>变式 1：秒表</h3>
      <Stopwatch />

      <h3>变式 2：鼠标位置追踪</h3>
      <MouseTracker />

      <h3>变式 3：页面可见性统计</h3>
      <VisibilityTracker />
    </div>
  )
}

/* ============================================================
 * 参考答案（先自己写，写完再对照）
 * ============================================================
 *
 * 练习 1：
 *   useEffect(() => {
 *     if (!running) return                 // 没在跑就不开定时器
 *     const id = setInterval(() => {
 *       setElapsed(e => e + 0.1)           // ⭐ 函数式更新
 *     }, 100)
 *     return () => clearInterval(id)       // ⭐ 清理
 *   }, [running])
 *
 * 练习 2：
 *   useEffect(() => {
 *     const onMove = (e: MouseEvent) => {
 *       setPos({ x: e.clientX, y: e.clientY })
 *       setMoves(m => m + 1)               // ⭐ 函数式更新
 *     }
 *     window.addEventListener('mousemove', onMove)
 *     return () => window.removeEventListener('mousemove', onMove)   // ⭐ 同一个引用
 *   }, [])                                 // 只挂载一次
 *
 *   优化思路（知道就行）：mousemove 触发非常频繁，真实项目里通常加"节流"
 *   （Day6 的 JS 练习学过），或者用 requestAnimationFrame。
 *
 * 练习 3：
 *   useEffect(() => {
 *     const onVisible = () => {
 *       const hidden = document.hidden
 *       setIsHidden(hidden)
 *       if (hidden) setHiddenCount(c => c + 1)   // ⭐ 函数式更新
 *     }
 *     document.addEventListener('visibilitychange', onVisible)
 *     return () => document.removeEventListener('visibilitychange', onVisible)
 *   }, [])
 *
 * ============================================================
 * 做完后的验收（这才是重点）
 * ============================================================
 * 三个练习都能**不看答案**写出来，而且满足：
 *   - 清理函数都写了
 *   - 依赖数组都填对了（只有 running 是依赖；其他都是空数组）
 *   - 都用到了"函数式更新"（setX(prev => ...)）
 *
 * 如果练习 1 卡住 → 说明"定时器 + 清理"没懂，回去看 02-清理函数.tsx
 * 如果练习 2 卡住 → 说明"监听 + 清理"没懂（注意要存函数引用）
 * 如果练习 3 卡住 → 说明"事件名/触发时机"不熟，查 MDN 就行（不算难）
 * ============================================================ */
