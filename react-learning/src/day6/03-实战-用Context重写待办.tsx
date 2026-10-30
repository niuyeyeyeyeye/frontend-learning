// ============================================================
// Day6-3：实战 —— 用 Context 重写待办列表
// ============================================================
// 📖 本文件名字对照表（完整版见 00-命名对照表.md）
//   TodoWithContext      用 Context 的待办（本文件的出口组件）
//   Todo                 待办（类型：{ id, text, done }）
//   TodoSummary          待办汇总（类型：total / done / remaining / percent）
//   TodoContextValue     待办上下文里装的东西的类型
//   TodoContext         待办上下文 / useTodos 用待办 / TodoProvider 待办提供者
//   INITIAL_TODOS        初始待办列表（全大写 = 常量）
//   nextId               下一个 id（自增发号器）
//   addTodo              加待办    toggleTodo 勾选/取消   removeTodo 删
//   clearDone            清空已完成（clear = 清空，done = 已完成）
//   trimmed              去掉首尾空格之后的文本（trim = 修剪空格）
//   stats                统计（total 总共 / done 已完成 / remaining 剩下 / percent 百分比）
//   TodoInput            待办输入框   TodoStats  待办统计   TodoList 待办列表
//   TodoItem             待办项（最深层，靠 useTodos 拿操作）
//   TodoLayout           待办布局（完全不认识 todos，只排版）
// ============================================================
// 对比 Day3 的 03-表单与待办列表.tsx：
//   Day3：所有 state 都在最外层一个组件里，所有子组件靠 props 收 state + 回调。
//   今天：state 收进 <TodoProvider>，任何深度的组件用 useTodos() 直接拿。
//
// 你要重点看的是"**没写什么**"：
//   - TodoItem 在最深层，但它不需要 through-传 toggleTodo
//   - Layout 组件完全不认识 todos，只是排版
//
// ⚠️ 一个设计取舍（面试常问）：
//   Context 更适合"低频变化"的数据（主题、用户、语言）。
//   待办列表每次输入都可能变 → 如果它挂在全局 Provider 上，
//   所有消费者都会跟着渲染。所以真实项目里，列表通常只在"这一块"用 Context，
//   或者干脆用 Zustand（Day8）。这里的写法是"演示 + 可接受"。

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

export type Todo = {
  id: number
  text: string
  done: boolean
}

type TodoSummary = {
  total: number
  done: number
  remaining: number
  percent: number
}

type TodoContextValue = {
  todos: Todo[]
  stats: TodoSummary
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  clearDone: () => void
}

const TodoContext = createContext<TodoContextValue | null>(null)

function useTodos(): TodoContextValue {
  const ctx = useContext(TodoContext)
  if (ctx === null) {
    throw new Error('useTodos 必须在 <TodoProvider> 内部使用')
  }
  return ctx
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: '复习 Day3 的不可变更新', done: true },
  { id: 2, text: '把 Context 的最小例子自己敲一遍', done: false },
  { id: 3, text: '想清楚：为什么待办不一定适合放 Context', done: false },
]

// ============================================================
// Provider：state + 操作 + 派生数据，全在这里
// ============================================================
function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS)
  const nextId = useRef(4)

  // ⚠️ 为什么不用 Date.now() 当 id？同一毫秒内连续加两条会撞 id（Day3 踩过）
  // ⚠️ 为什么 id 在 updater 外面算？因为 StrictMode 会**故意把 updater 调用两次**
  //    如果在里面 nextId.current++，id 会跳号。updater 必须是纯函数！
  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim() // trim() = 去掉首尾空格（' a ' → 'a'）
    if (trimmed === '') return
    const id = nextId.current++
    setTodos((prev) => [...prev, { id, text: trimmed, done: false }])
  }, [])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [])

  const removeTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  // 派生数据用 useMemo 算，不要存进 state（否则要手动同步，早晚不一致）
  const stats = useMemo<TodoSummary>(() => {
    const total = todos.length
    const done = todos.filter((t) => t.done).length
    return {
      total,
      done,
      remaining: total - done, // remaining = 还剩几条（remain = 剩下）
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    }
  }, [todos])

  // value 用 useMemo 稳住：只要 todos / stats / 四个函数没变，就不通知消费者
  const value = useMemo<TodoContextValue>(
    () => ({ todos, stats, addTodo, toggleTodo, removeTodo, clearDone }),
    [todos, stats, addTodo, toggleTodo, removeTodo, clearDone],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

// ============================================================
// 消费者：注意它们都没有 props
// ============================================================

function TodoInput() {
  const [text, setText] = useState('')
  const { addTodo } = useTodos()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addTodo(text)
        setText('') // 输入框自己的清空，父组件不用管
      }}
      style={{ marginBottom: 10 }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="写点什么，回车添加"
        style={{ padding: 6, width: 260, marginRight: 8 }}
      />
      <button className="btn" type="submit">
        添加
      </button>
    </form>
  )
}

function TodoStats() {
  const { stats, clearDone } = useTodos()

  return (
    <div className="card">
      <div style={{ marginBottom: 6 }}>
        共 <strong>{stats.total}</strong> 条，已完成 <strong>{stats.done}</strong> 条，还剩{' '}
        <strong>{stats.remaining}</strong> 条（{stats.percent}%）
      </div>
      {/* 进度条：宽度就是 percent，一个 style 搞定 */}
      <div style={{ background: '#eaeef2', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div
          style={{
            width: `${stats.percent}%`,
            height: '100%',
            background: '#1f883d',
            transition: 'width .2s',
          }}
        />
      </div>
      <button
        className="btn-ghost"
        onClick={clearDone}
        disabled={stats.done === 0}
        style={{ marginTop: 8 }}
      >
        清除已完成
      </button>
    </div>
  )
}

function TodoList() {
  const { todos } = useTodos()

  if (todos.length === 0) {
    return <p className="hint">列表是空的，上面加一条试试。</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </ul>
  )
}

// ⭐ 这个组件在树的最深处：它只需要 todo 的 id，就能自己拿到 toggle / remove
//    注意它唯一的 props 是 todo 本身（这是"渲染数据"，不是"操作函数"）
function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, removeTodo } = useTodos()

  return (
    <li className={todo.done ? 'card done' : 'card'} style={{ marginBottom: 6 }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</span>
      </label>
      <button className="btn-ghost" onClick={() => removeTodo(todo.id)} style={{ float: 'right' }}>
        删除
      </button>
    </li>
  )
}

// ============================================================
// Layout：完全不认识 todos，只负责排版 —— 这就是 Context 的价值
// ============================================================
function TodoLayout() {
  return (
    <div>
      <TodoInput />
      <TodoStats />
      <TodoList />
    </div>
  )
}

// ============================================================
// 展示区
// ============================================================
export default function TodoWithContext() {
  return (
    <div>
      <h3>用 Context 重写的待办（子组件零 props 钻地）</h3>
      <TodoProvider>
        <TodoLayout />
      </TodoProvider>
      <p className="hint">
        👆 TodoInput / TodoStats / TodoList / TodoItem 之间<strong>没有一个 props</strong>，
        数据全靠 useTodos()。
      </p>
    </div>
  )
}

/* ============================================================
 * 面试会问的三个问题
 * ============================================================
 * Q1: Context 是状态管理吗？
 *     A: 不是。它只是一个"传值管道"，本身不存状态 —— 状态还在 Provider 的 useState 里。
 *        Context 解决"怎么传"，不解决"存哪里"。
 *
 * Q2: Context 的缺点？
 *     A: (1) 值一变，所有消费者全渲染，无法细粒度订阅；
 *        (2) 它把"依赖关系"藏起来了：看一个组件不知道它依赖哪个 Provider，
 *            复用组件时容易忘包 Provider（所以才要 useTodos 那个报错）；
 *        (3) 状态分散后，数据流不像 props 那么直观。
 *
 * Q3: 那什么时候用 Context，什么时候上 Zustand？
 *     A: 低频值（主题/用户/语言）→ Context 足够；
 *        高频值（列表、表单、实时数据）+ 需要细粒度订阅 → Zustand。
 *        判断标准：这个东西"变一下会不会让一大片组件白渲染"。
 * ============================================================ */
