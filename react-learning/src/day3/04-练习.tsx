// ============================================================
// Day3-4：你的练习
// ============================================================
// 今天的练习是"从零写一个待办列表"的各个部分。
// 规则：补完 TODO → 保存 → 浏览器看效果
// 卡 20 分钟看文件底部的参考答案

import { useState } from 'react'

interface Todo {
  id: number
  text: string
  done: boolean
}

// ------------------------------------------------------------
// 练习 1：待办的三个核心操作（add / toggle / remove）
// 要求：
//   - 添加：输入框内容 trim 后为空则不添加；添加后清空输入框
//   - 切换：点复选框切换完成状态（要造新数组 + 新对象）
//   - 删除：按 id 删除（filter）
// ------------------------------------------------------------
function TodoCore() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [nextId, setNextId] = useState(1)
  const [input, setInput] = useState('')

  // TODO 1-a：实现添加
  function add() {
    // 提示：先 trim 判断空；再 setTodos([...todos, { id: nextId, text, done: false }])；
    //       然后 setNextId(nextId + 1) 和 setInput('')
    if(input.trim()==='') return
    setTodos(()=>[...todos,{id:nextId,text:input.trim(),done:false}])
    setNextId(nextId+1)
    setInput('')
  }

  // TODO 1-b：实现切换完成
  function toggle(id: number) {
    // 提示：setTodos(todos.map(...)) —— 找到 id 的那项要造新对象
    setTodos(todos.map((n)=>n.id===id?{...n,done:!n.done}:n))
  }

  // TODO 1-c：实现删除
  function remove(id: number) {
    // 提示：setTodos(todos.filter(...))
    setTodos(todos.filter((n)=>
      n.id!=id
    ))
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 8 }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入待办" style={{ flex: 1, padding: 4 }} />
        <button className="btn" type="submit">
          添加
        </button>
      </form>

      {todos.length === 0 && <p className="hint">（还没有待办）</p>}

      {todos.map((t) => (
        <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} style={{ marginRight: 8 }} />
          <span style={{ flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
          <button className="btn-ghost" style={{ fontSize: 12, padding: '2px 8px' }} onClick={() => remove(t.id)}>
            删除
          </button>
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 练习 2：过滤 + 计数
// 要求：
//   - 三个按钮切换筛选（全部 / 未完成 / 已完成）
//   - 显示"已完成 X / 共 Y"
//   - 列表只显示当前筛选下的数据
// ------------------------------------------------------------
function TodoFilter() {
  const [todos] = useState<Todo[]>([
    { id: 1, text: '已完成的事', done: true },
    { id: 2, text: '还没做的事', done: false },
    { id: 3, text: '另一件已完成的事', done: true },
  ])
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  // TODO 2：算出 visibleTodos 和 doneCount
  const visibleTodos = todos.filter((n)=>
    filter==='done'?n.done===true:filter==='active'?n.done===false:n
  ) // ← 改这里
  const doneCount = todos.filter((n)=>n.done===true).length// ← 改这里

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button className="btn-ghost" onClick={() => setFilter('all')}>全部</button>
        <button className="btn-ghost" onClick={() => setFilter('active')}>未完成</button>
        <button className="btn-ghost" onClick={() => setFilter('done')}>已完成</button>
      </div>
      <p className="hint">
        已完成 {doneCount} / 共 {todos.length}（当前筛选 {visibleTodos.length} 条）
      </p>
      {visibleTodos.map((t) => (
        <div key={t.id} className="card">
          {t.done ? '✅' : '⬜'} {t.text}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 练习 3（挑战）：编辑功能
// 要求：双击待办文字 → 变成输入框编辑；回车或失焦保存；Esc 取消
// 提示：需要两个 state —— editingId（哪一项正在编辑）和 draft（正在输入的内容）
// ------------------------------------------------------------
function TodoEdit() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '双击我试试', done: false },
    { id: 2, text: '再双击我', done: false },
  ])
  // TODO 3：加 editingId 和 draft 两个 state，实现编辑
  return (
    <div>
      {todos.map((t) => (
        <div key={t.id} className="card">
          {t.text}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 展示区（不用改）
// ------------------------------------------------------------
export default function PracticeDay3() {
  return (
    <div>
      <h3>练习 1：待办核心（增 / 改 / 删）</h3>
      <TodoCore />

      <h3>练习 2：过滤 + 计数</h3>
      <TodoFilter />

      <h3>练习 3（挑战）：双击编辑</h3>
      <TodoEdit />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   function add() {
 *     const text = input.trim()
 *     if (text === '') return
 *     setTodos([...todos, { id: nextId, text, done: false }])
 *     setNextId(nextId + 1)
 *     setInput('')
 *   }
 *
 *   function toggle(id: number) {
 *     setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
 *   }
 *
 *   function remove(id: number) {
 *     setTodos(todos.filter((t) => t.id !== id))
 *   }
 *
 * 练习 2：
 *   const visibleTodos =
 *     filter === 'active' ? todos.filter((t) => !t.done)
 *     : filter === 'done' ? todos.filter((t) => t.done)
 *     : todos
 *
 *   const doneCount = todos.filter((t) => t.done).length
 *
 * 练习 3（挑战）：
 *   const [editingId, setEditingId] = useState<number | null>(null)
 *   const [draft, setDraft] = useState('')
 *
 *   function startEdit(t: Todo) {
 *     setEditingId(t.id)
 *     setDraft(t.text)
 *   }
 *   function saveEdit() {
 *     const text = draft.trim()
 *     if (text !== '' && editingId !== null) {
 *       setTodos(todos.map((t) => (t.id === editingId ? { ...t, text } : t)))
 *     }
 *     setEditingId(null)     // 保存后退出编辑
 *   }
 *
 *   在渲染里：
 *     {editingId === t.id ? (
 *       <input
 *         value={draft}
 *         autoFocus
 *         onChange={(e) => setDraft(e.target.value)}
 *         onBlur={saveEdit}
 *         onKeyDown={(e) => {
 *           if (e.key === 'Enter') saveEdit()
 *           if (e.key === 'Escape') setEditingId(null)   // 取消
 *         }}
 *       />
 *     ) : (
 *       <span onDoubleClick={() => startEdit(t)}>{t.text}</span>
 *     )}
 *
 * 【做完后想一件事】
 * 练习 3 里，为什么用「editingId + draft 两个 state」，而不是
 * 「一个 editingTodo 对象」？
 * 答：对象 state 每次输入都要造新对象，而且"退出编辑"时还要多处理一步；
 *     拆成两个简单 state 反而更清晰。**state 的设计原则：能简单就简单。**
 * ============================================================ */
