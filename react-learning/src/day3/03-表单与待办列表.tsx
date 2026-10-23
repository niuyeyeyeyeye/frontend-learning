// ============================================================
// Day3-3：完整版待办列表（表单 + 列表 + 过滤 + 增删改）
// ============================================================
// 这个文件是今天的目标形态：一个功能完整的待办应用。
// 你在 Day6 用原生 JS 写过一个版本，对比一下差别有多大 ——
// 这里**没有一行 DOM 操作**，全是数据 + 渲染。

import { useState } from 'react'

type Filter = 'all' | 'active' | 'done'

interface Todo {
  id: number
  text: string
  done: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学列表渲染', done: true },
    { id: 2, text: '学 key 的坑', done: false },
    { id: 3, text: '写完整待办列表', done: false },
  ])
  const [nextId, setNextId] = useState(4)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  // ---------- 添加 ----------
  function addTodo() {
    const text = input.trim()
    if (text === '') return // 空输入直接返回（比 alert 更友好）
    setTodos([...todos, { id: nextId, text, done: false }])
    setNextId(nextId + 1)
    setInput('') // 清空输入框
  }

  // ---------- 切换完成 ----------
  function toggleTodo(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  // ---------- 删除 ----------
  function removeTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  // ---------- 批量操作 ----------
  function clearDone() {
    setTodos(todos.filter((t) => !t.done))
  }

  function markAllDone() {
    setTodos(todos.map((t) => ({ ...t, done: true })))
  }

  // ---------- 过滤（算出来，不改源数据） ----------
  const visibleTodos =
    filter === 'active'
      ? todos.filter((t) => !t.done)
      : filter === 'done'
        ? todos.filter((t) => t.done)
        : todos

  const doneCount = todos.filter((t) => t.done).length
  const leftCount = todos.length - doneCount

  return (
    <div>
      {/* 表单：onSubmit + preventDefault，支持回车提交 */}
      <form
        onSubmit={(e) => {
          e.preventDefault() // 阻止页面刷新
          addTodo()
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 12 }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入待办，按回车添加"
          style={{ flex: 1, padding: '6px 10px' }}
        />
        <button className="btn" type="submit">
          添加
        </button>
      </form>

      {/* 过滤器 */}
      <div style={{ marginBottom: 12 }}>
        {(['all', 'active', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            className={filter === f ? 'btn' : 'btn-ghost'}
            style={{ marginRight: 6 }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : f === 'active' ? '未完成' : '已完成'}
          </button>
        ))}
        {'　'}
        <button className="btn-ghost" onClick={markAllDone}>
          全部完成
        </button>
        <button className="btn-ghost" onClick={clearDone}>
          清空已完成
        </button>
      </div>

      {/* 统计 */}
      <p className="hint">
        共 {todos.length} 条 · 未完成 {leftCount} 条 · 已完成 {doneCount} 条
        {filter !== 'all' && `（当前筛选显示 ${visibleTodos.length} 条）`}
      </p>

      {/* 列表 */}
      {visibleTodos.length === 0 ? (
        <p className="hint">{todos.length === 0 ? '还没有待办，先添加一条吧' : '当前筛选下没有数据'}</p>
      ) : (
        visibleTodos.map((todo) => (
          <div key={todo.id} className={`card ${todo.done ? 'done' : ''}`} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: 10 }}
            />
            <span style={{ flex: 1 }}>{todo.text}</span>
            <button
              className="btn-ghost"
              style={{ fontSize: 12, padding: '2px 8px' }}
              onClick={() => removeTodo(todo.id)}
            >
              删除
            </button>
          </div>
        ))
      )}
    </div>
  )
}
