// ============================================================
// Day2-4：你的练习
// ============================================================
// 规则：补完 TODO → 保存 → 浏览器自动刷新看效果
// 卡 20 分钟看文件底部的参考答案
//
// 完成标准：3 个练习都能正确交互，且页面看起来符合要求

import { useState } from 'react'

// ------------------------------------------------------------
// 练习 1：Toggle —— 显示/隐藏开关
// 要求：点按钮在"显示 / 隐藏"之间切换；
//       显示时在按钮下面显示一段文字"我是被隐藏的内容"
// ------------------------------------------------------------
function Toggle() {
  // TODO: 声明一个 boolean state（默认 false = 隐藏）
  // TODO: 按钮文字根据 state 变化（显示 / 隐藏）
  // TODO: state 为 true 时渲染那段文字
  const [toggle,setToggle]=useState(false)
  return <div>
    <button onClick={
      ()=>setToggle(!toggle)
      }>{toggle?'隐藏':'显示'}</button>
    {toggle && <p>{'我是被隐藏的内容'}</p>}
  </div>
}

// ------------------------------------------------------------
// 练习 2：温度换算 —— 受控输入框
// 要求：一个输入框输入摄氏度，下面实时显示华氏度
//       公式：F = C * 9 / 5 + 32
//       输入为空或非法数字时显示 "--"
// ------------------------------------------------------------
function Temperature() {
  // TODO: 用 useState 存输入框的值
  // TODO: 输入框用 value + onChange 变成受控组件
  // TODO: 计算华氏度并显示（注意输入为空时不要显示 NaN）
  const [C,setC]=useState('')
  const F =isNaN(Number(C))||C===''?'--':Number(C)*9/5+32
  return <div>
    <input
    onChange={(e)=>setC(e.target.value)}
    value={C}
    placeholder='请输入摄氏温度'
    ></input>
    <p>{F}</p>
  </div>
}

// ------------------------------------------------------------
// 练习 3：颜色选择器 —— 事件传参
// 要求：三个按钮（红/绿/蓝），点击后下面那个方块的背景色变过去
//       用 useState 存当前颜色，事件里给处理函数传参
// ------------------------------------------------------------
const COLORS = [
  { name: '红', value: '#cf222e' },
  { name: '绿', value: '#1f883d' },
  { name: '蓝', value: '#0969da' },
]

function ColorPicker() {
  // TODO: 用 useState 存当前颜色（默认第一个）
  // TODO: 三个按钮，onClick 里传参调用 set 函数
  // TODO: 下面渲染一个方块，背景色用当前的 state
  const [color,setColor]=useState(COLORS[0].value)
  return <div>
    <button onClick={()=>setColor(COLORS[0].value)}>{COLORS[0].name}</button>
    <button onClick={()=>setColor(COLORS[1].value)}>{COLORS[1].name}</button>
    <button onClick={()=>setColor(COLORS[2].value)}>{COLORS[2].name}</button>
    <div style={{background:color, height:100, width:100}}></div>
  </div>
}

// ------------------------------------------------------------
// 下面是展示区（不用改）
// ------------------------------------------------------------
export default function PracticeDay2() {
  return (
    <div>
      <h3>练习 1：Toggle 开关</h3>
      <Toggle />

      <h3>练习 2：温度换算</h3>
      <Temperature />

      <h3>练习 3：颜色选择器</h3>
      <ColorPicker />
    </div>
  )
}

/* ============================================================
 * 参考答案（先自己写，写完再对照）
 * ============================================================
 *
 * 练习 1：
 *   function Toggle() {
 *     const [show, setShow] = useState(false)
 *     return (
 *       <div>
 *         <button className="btn-ghost" onClick={() => setShow(!show)}>
 *           {show ? '隐藏' : '显示'}
 *         </button>
 *         {show && <p>我是被隐藏的内容</p>}
 *       </div>
 *     )
 *   }
 *
 * 练习 2：
 *   function Temperature() {
 *     const [celsius, setCelsius] = useState('')
 *     const fahrenheit = celsius === '' || isNaN(Number(celsius))
 *       ? '--'
 *       : (Number(celsius) * 9 / 5 + 32).toFixed(1)
 *     return (
 *       <div>
 *         <input
 *           value={celsius}
 *           onChange={(e) => setCelsius(e.target.value)}
 *           placeholder="输入摄氏度"
 *         />
 *         <span> ℃ → {fahrenheit} ℉</span>
 *       </div>
 *     )
 *   }
 *
 * 练习 3：
 *   function ColorPicker() {
 *     const [color, setColor] = useState(COLORS[0].value)
 *     return (
 *       <div>
 *         {COLORS.map((c) => (
 *           <button key={c.value} className="btn-ghost" onClick={() => setColor(c.value)}>
 *             {c.name}
 *           </button>
 *         ))}
 *         <div style={{ background: color, width: 120, height: 60, marginTop: 8, borderRadius: 6 }} />
 *       </div>
 *     )
 *   }
 *
 * 【做完后想一件事】
 * 这三个练习里，哪些地方用到了 "不可变更新"？
 * （提示：练习 2/3 的 set 都是"直接换一个新值"，不需要改对象/数组，所以没用到；
 *   等 Day3 做列表时就要用 [...arr, x] 了。）
 * ============================================================ */
