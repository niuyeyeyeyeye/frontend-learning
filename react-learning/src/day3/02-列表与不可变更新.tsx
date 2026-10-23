// ============================================================
// Day3-2：列表 operation 与不可变更新
// ============================================================
// 今天的核心规则：**永远不要直接改 state 里的数组/对象，要造新的**
//
// 因为 React 判断"要不要重新渲染"靠的是**引用比较**（===）。
// 你直接 push 改原数组，引用没变 → React 认为"什么都没变" → 页面不更新。

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function ListOperations() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学列表渲染', done: true },
    { id: 2, text: '学 key', done: false },
    { id: 3, text: '写待办列表', done: false },
  ])

  const [nextId, setNextId] = useState(4)
  const [keyword, setKeyword] = useState('')

  // -------- ❌ 演示：直接改数组会怎样 --------
  function addByPush() {
    const newTodo = { id: nextId, text: '用 push 添加的（可能不显示）', done: false }
    todos.push(newTodo) // ❌ 直接改原数组
    setNextId(nextId + 1)
    setTodos(todos) // 引用没变 → React 可能不更新
    // 实际效果：React 18+ 里 setTodos(todos) 因为引用相同，会被跳过 → 页面不更新
  }

  // -------- ✅ 正确：造新数组 --------
  function add() {
    setTodos([...todos, { id: nextId, text: '用展开运算符添加的', done: false }])
    setNextId(nextId + 1)
  }

  function remove(id: number) {
    setTodos(todos.filter((t) => t.id !== id)) // filter 返回新数组 ✅
  }

  function toggle(id: number) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)), // map 返回新数组，改的那项造新对象 ✅
    )
  }

  function clearDone() {
    setTodos(todos.filter((t) => !t.done))
  }

  function toggleAll() {
    setTodos(todos.map((t) => ({ ...t, done: true })))
  }

  // 过滤：不要直接改 todos，而是算出"要显示的"
  const visibleTodos = keyword.trim()
    ? todos.filter((t) => t.text.toLowerCase().includes(keyword.trim().toLowerCase()))
    : todos

  return (
    <div>
      <h3>1. 数组操作的"不可变"速查表</h3>
      <div className="card">
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: 4 }}>添加一项</td>
              <td>❌ <code>todos.push(x)</code></td>
              <td>✅ <code>setTodos([...todos, x])</code></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>删除一项</td>
              <td>❌ <code>todos.splice(i, 1)</code></td>
              <td>✅ <code>setTodos(todos.filter(t =&gt; t.id !== id))</code></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>修改一项</td>
              <td>❌ <code>todos[i].done = true</code></td>
              <td>✅ <code>setTodos(todos.map(t =&gt; t.id === id ? {'{...t, done}'} : t))</code></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>排序</td>
              <td>❌ <code>todos.sort(...)</code>（sort 会改原数组！）</td>
              <td>✅ <code>setTodos([...todos].sort(...))</code></td>
            </tr>
            <tr>
              <td style={{ padding: 4 }}>清空已完成</td>
              <td>❌ 循环 splice</td>
              <td>✅ <code>setTodos(todos.filter(t =&gt; !t.done))</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2. 试试这些操作</h3>
      <div style={{ marginBottom: 10 }}>
        <button className="btn" onClick={add}>
          ✅ 用 [...todos, x] 添加
        </button>
        {'　'}
        <button className="btn-ghost" onClick={addByPush}>
          ❌ 用 push 添加（看会不会显示）
        </button>
        {'　'}
        <button className="btn-ghost" onClick={clearDone}>
          清空已完成
        </button>
        {'　'}
        <button className="btn-ghost" onClick={toggleAll}>
          全部完成
        </button>
      </div>

      <h3>3. 过滤（不改原数组，算出要显示的）</h3>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索待办..."
        style={{ padding: '4px 8px', width: 220, marginBottom: 8 }}
      />
      <p className="hint">
        {keyword.trim() ? `匹配到 ${visibleTodos.length} 条（共 ${todos.length} 条）` : `共 ${todos.length} 条`}
      </p>

      <h3>4. 渲染出来</h3>
      {visibleTodos.length === 0 ? (
        <p className="hint">（没有匹配的待办）</p>
      ) : (
        visibleTodos.map((todo) => (
          <div key={todo.id} className={`card ${todo.done ? 'done' : ''}`}>
            <span style={{ marginRight: 10 }}>
              {todo.done ? '✅' : '⬜'} {todo.text}
            </span>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '2px 8px' }} onClick={() => toggle(todo.id)}>
              {todo.done ? '取消完成' : '完成'}
            </button>
            {' '}
            <button className="btn-ghost" style={{ fontSize: 12, padding: '2px 8px' }} onClick={() => remove(todo.id)}>
              删除
            </button>
          </div>
        ))
      )}
      <p className="hint">
        ⭐ 注意这里同时用到了「过滤 + 渲染」：`visibleTodos` 是算出来的，不是改 todos。<br />
        原数组 `todos` 一直没被动过 —— 这就是"不可变"的好处：**你想怎么过滤排序都行，
        数据源永远是干净的**。
      </p>
    </div>
  )
}
