// ============================================================
// Day2-1：事件处理
// ============================================================
// 一、基本写法：onClick 后面跟【函数引用】
//     <button onClick={handleClick}>     ✅ 传函数本身，点击时才调用
//     <button onClick={handleClick()}>   ❌ 渲染时立刻调用，把返回值当事件处理函数
//
// 二、传参数要用箭头函数包一层
//     <button onClick={() => handleClick(id)}>   ✅
//
// 三、事件对象 e（React 的合成事件，和原生事件用法几乎一样）

import { useState } from 'react'

export default function EventsBasics() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('还没点过')

  // 每次渲染都会执行这一段（组件函数体）
  console.log('[渲染] EventsBasics 渲染了一次')

  // ✅ 正确：传函数引用
  function handleClick() {
    setCount((c) => c + 1)
    console.log('点击生效了，count 变成', count + 1)
  }

  return (
    <div>
      <h3>1. 最基本的绑定</h3>
      <button className="btn" onClick={handleClick}>
        点击了 {count} 次
      </button>
      <p className="hint">
        {`onClick={handleClick}`} 里的 handleClick 是**函数本身**，点击时才调用
      </p>

      <h3>2. ⚠️ 经典错误：onClick={'{'}fn(){'}'} 和 onClick={'{'}fn{'}'} 的区别</h3>
      <div className="card">
        <p>
          ❌ <code>{'onClick={handleClick()}'}</code>
          <br />
          <span className="hint">
            渲染时**立刻**执行 handleClick()，然后把它的**返回值**当事件处理函数。
            因为 handleClick 没返回值（undefined），React 会报警告：
            "Expected onClick listener to be a function, instead got undefined"
          </span>
        </p>
        <p>
          ✅ <code>{'onClick={handleClick}'}</code> —— 传函数引用，点击才执行
        </p>
        <p>
          ✅ <code>{'onClick={() => handleClick()}'}</code> —— 需要传参时这么包一层
        </p>
        <p className="hint" style={{ color: '#cf222e' }}>
          👉 打开控制台：每次组件渲染你都会看到「[渲染] EventsBasics 渲染了一次」。
          如果写成 {'onClick={handleClick()}'}，控制台会**每渲染一次就多打一条**点击日志 —— 这就是 bug。
        </p>
      </div>

      <h3>3. 事件对象 e</h3>
      <button
        className="btn-ghost"
        onClick={(e) => {
          console.log('事件对象:', e)
          console.log('  事件类型:', e.type)
          console.log('  目标元素:', e.target)
          setMessage('你点了"事件对象"按钮，看控制台')
        }}
      >
        点我看事件对象
      </button>
      <p className="hint">{message}</p>

      <h3>4. 给事件处理函数传参数（三种写法）</h3>
      <div>
        {/* 写法 A：箭头函数包一层（最常用） */}
        <button
          className="btn-ghost"
          onClick={() => setMessage('A：箭头函数传参 → 收到 "hello"')}
        >
          传参 A
        </button>
        {'　'}
        {/* 写法 B：bind（少用，但要知道） */}
        <button
          className="btn-ghost"
          onClick={() => {
            // 演示 bind：把参数预置进去
            const fn = (text: string) => setMessage('B：bind 传参 → 收到 "' + text + '"')
            const bound = fn.bind(null, 'world')
            bound()
          }}
        >
          传参 B
        </button>
      </div>

      <h3>5. 阻止冒泡 / 阻止默认行为</h3>
      <div
        className="card"
        onClick={() => setMessage('外层被点了（冒泡）')}
        style={{ cursor: 'pointer' }}
      >
        外层容器（点这里会触发它的 onClick）
        <div style={{ marginTop: 8 }}>
          <button
            className="btn-ghost"
            onClick={(e) => {
              e.stopPropagation() // ← 阻止事件冒泡到外层
              setMessage('内层被点了，但冒泡被阻止了')
            }} 
          >
            点我（阻止冒泡）
          </button>
        </div>
      </div>
      <p className="hint">
        不加 e.stopPropagation() 的话，点内层按钮**外层也会被触发**（这就是"冒泡"）
      </p>

      <h3>6. 表单的默认行为：提交会刷新页面</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault() // ← 阻止表单默认的"提交并刷新页面"
          setMessage('表单提交被阻止了，页面没刷新 ✅')
        }}
      >
        <input placeholder="随便输入，按回车试试" style={{ padding: '4px 8px' }} />
        <button className="btn" type="submit" style={{ marginLeft: 8 }}>
          提交
        </button>
      </form>
      <p className="hint">
        ⭐ 不写 e.preventDefault()，页面会刷新 —— 你在 Day6 的 JS 练习里已经踩过这个坑
      </p>
    </div>
  )
}
