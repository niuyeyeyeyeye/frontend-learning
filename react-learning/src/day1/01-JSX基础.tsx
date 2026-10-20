// ============================================================
// Day1-1：JSX 基础
// ============================================================
// JSX = 在 JS 里写"像 HTML"的语法，React 会把它编译成函数调用。
//
// 五条规则（记住就能写）：
//   ① {} 里可以写任意 JS 【表达式】（不是语句）
//   ② 属性用 camelCase：className（不是 class）、htmlFor（不是 for）
//   ③ 组件必须只有一个根元素，多个可以用 <>...</> 包起来（叫 Fragment）
//   ④ 注释写在 {/* ... */} 里
//   ⑤ style 要写成对象：style={{ color: 'red' }}（外层 {} 是 JSX 的，内层 {} 是对象的）

const userName = '小明'
const isLoggedIn = true
const skills = ['HTML', 'CSS', 'JS', 'TS']
const todos = [
  { id: 1, text: '学 JSX', done: true },
  { id: 2, text: '学 props', done: false },
  { id: 3, text: '写一个组件', done: false },
]

function JsxBasics() {
  return (
    <div>
      {/* ---------- 1. 用 {} 插入表达式 ---------- */}
      <h3>1. 用 {'{}'} 插入 JS 表达式</h3>
      <p>你好，{userName}！</p>
      <p>1 + 1 = {1 + 1}</p>
      <p>调用函数：{userName.toUpperCase()}</p>
      <p>三元表达式：{isLoggedIn ? '已登录' : '未登录'}</p>
      <p className="hint">
        注意：{} 里只能放"表达式"（能算出值的东西），不能放 if / for 这种语句
      </p>

      {/* ---------- 2. 条件渲染 ---------- */}
      <h3>2. 条件渲染</h3>
      {/* 写法 A：三元（两个分支都要有内容） */}
      <p>{isLoggedIn ? '欢迎回来' : '请先登录'}</p>
      {/* 写法 B：&&（只在条件为真时显示） */}
      {isLoggedIn && <p>这段只在登录后显示</p>}
      {/* 写法 C：提前 return（组件里最常用） */}
      <p className="hint">写法 C：在组件函数里 if (!isLoggedIn) return null</p>

      {/* ---------- 3. 列表渲染 ---------- */}
      <h3>3. 列表渲染 + key</h3>
      <div>
        {skills.map((skill) => (
          <span key={skill} className="tag">
            {skill}
          </span>
        ))}
      </div>
      <p className="hint">
        key 是 React 用来识别"这一项是谁"的。⭐ 别用数组下标 index 当 key（后面会讲为什么）
      </p>

      <ul style={{ marginTop: 8 }}>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'done' : ''}>
            {todo.text} {todo.done ? '✅' : '⬜'}
          </li>
        ))}
      </ul>

      {/* ---------- 4. 属性写法 ---------- */}
      <h3>4. 属性（HTML 和 JSX 的差异）</h3>
      {/* className 不是 class */}
      <div className="card">
        <p>class → className</p>
        <p>for → htmlFor</p>
        <p>onclick → onClick（驼峰）</p>
        <p>
          style 写成对象：<span style={{ color: '#cf222e', fontWeight: 'bold' }}>这段是红色的</span>
        </p>
      </div>

      {/* ---------- 5. Fragment ---------- */}
      <h3>5. 多根元素用 Fragment</h3>
      <p className="hint">
        组件的 return 必须只有一个根元素。需要并列多个时，用 {'<>'}...{'</>'} 包起来
      </p>
      <>
        <p>第一段</p>
        <p>第二段</p>
      </>
    </div>
  )
}

export default JsxBasics
