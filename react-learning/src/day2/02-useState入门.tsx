// ============================================================
// Day2-2：useState 入门 —— React 最核心的思想
// ============================================================
// 一句话：**UI = f(state)**。页面长什么样，完全由状态（state）决定。
//
// 三个必须记住的规则：
//   ① 声明：const [值, 改值的函数] = useState(初始值)
//   ② 改值必须用 setXxx(新值)，**不能直接改**（count++ 无效）
//   ③ 改完之后，React 会**自动重新渲染**这块 UI

import { useState } from 'react'

export default function UseStateBasics() {
  // ① 数字
  const [count, setCount] = useState(0)
  // ② 字符串（受控输入框）
  const [text, setText] = useState('')
  // ③ 布尔（开关）
  const [visible, setVisible] = useState(true)
  // ④ 对象
  const [profile, setProfile] = useState({ name: '小明', age: 18 })

  return (
    <div>
      <h3>1. 计数器：改 state → 页面自动更新</h3>
      <button className="btn" onClick={() => setCount(count + 1)}>
        点我 +1（现在是 {count}）
      </button>
      {'　'}
      <button className="btn-ghost" onClick={() => setCount(0)}>
        归零
      </button>
      <p className="hint">
        ⭐ 注意：你没有写任何 "把 0 改成 1" 的 DOM 操作 —— 你只改了 state，页面自己变了
      </p>

      <h3>2. ❌ 错误写法：直接改 state</h3>
      <div className="card">
        <p>
          <code>count++</code> ← ❌ 无效（React 不知道你改了，不会重新渲染）
          <br />
          <code>setCount(count + 1)</code> ← ✅ 必须调用 set 函数
        </p>
        <p className="hint">
          同样的坑还有：`arr.push(x)` ❌ / `setArr([...arr, x])` ✅（不可变更新 —— 你 Day6 学过）
        </p>
      </div>

      <h3>3. 受控输入框：input 的值由 state 决定</h3>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="边输入边看下面"
        style={{ padding: '4px 8px', width: 220 }}
      />
      <p>
        你输入了：<strong>{text || '（空）'}</strong>（{text.length} 个字）
      </p>
      <p className="hint">
        受控 = value 绑 state + onChange 更新 state。<br />
        ⚠️ 只写 value 不写 onChange，输入框会变得**输不进去**（值被 state 锁死了）
      </p>

      <h3>4. 布尔开关：显示 / 隐藏</h3>
      <button className="btn-ghost" onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}下面这块内容
      </button>
      {visible && (
        <div className="card" style={{ marginTop: 8 }}>
          👋 我现在是可见的。点上面的按钮我就消失。
        </div>
      )}

      <h3>5. 对象 state：必须造新对象</h3>
      <div className="card">
        <p>
          {profile.name}，{profile.age} 岁
        </p>
        <button
          className="btn-ghost"
          onClick={() => {
            // ❌ profile.name = '小红'   ← 直接改对象，React 检测不到
            // ✅ 造一个新对象（对象展开）
            setProfile({ ...profile, age: profile.age + 1 })
          }}
        >
          过一年（+1 岁）
        </button>
      </div>
      <p className="hint">
        ⭐ 这里用到了对象展开 {'{...obj, 字段: 新值}'} —— 和 Day6 的 {"{...t, done}"} 是同一个手法
      </p>

      <h3>6. 一个重要的坑：setState 是异步的、会批处理</h3>
      <div className="card">
        <button
          className="btn-ghost"
          onClick={() => {
            // ❌ 这三次读到的 count 都是同一个旧值（React 批处理），结果只 +1
            setCount(count + 1)
            setCount(count + 1)
            setCount(count + 1)
            // ✅ 要用"函数式更新"才能基于最新值连续累加：
            // setCount((c) => c + 1)
            // setCount((c) => c + 1)
            // setCount((c) => c + 1)
          }}
        >
          连写三次 setCount(count + 1)（看看加了几）
        </button>
        <p className="hint">
          点一下你会发现只 +1 —— 因为三次读的都是渲染时的同一个 count。
          要连续累加必须用 <code>setCount((c) =&gt; c + 1)</code>（函数式更新）
        </p>
      </div>
    </div>
  )
}
