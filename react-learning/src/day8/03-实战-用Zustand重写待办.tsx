// ============================================================
// Day8-3：实战 —— 用 Zustand 重写待办（对比 Day6 的 Context 版）
// ============================================================
// 📖 本文件名字对照表
//   TodoWithZustand   用 Zustand 写的待办（本页 /day8/todo）
//   useTodoStore      全局待办 store（在 store/todoStore.ts）
//   todoStats         派生数据（从 todos 算出来的统计）
//   persist           持久化中间件（自动存 localStorage，刷新不丢）
//
// ⭐ 对比 Day6 那版，你要注意"**没写什么**"：
//   - 没有 TodoProvider
//   - 没有 useTodos() 自定义 hook + 报错
//   - 没有 useMemo 稳住 value
//   - 没有 useCallback
//   因为 store 自己就是"稳定的引用"，天然没这些问题。

import { useState } from 'react'
import { todoStats, useTodoStore } from './store/todoStore'

// ============================================================
// 输入框：只管自己的输入，加待办交给 store
// ============================================================
function TodoInput() {
  const [text, setText] = useState('')
  const addTodo = useTodoStore((s) => s.addTodo)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addTodo(text)
        setText('')
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

// ============================================================
// 统计：⭐ 只订 todos，别的字段怎么变都跟它没关系
// ============================================================
function TodoStats() {
  const todos = useTodoStore((s) => s.todos)
  const clearDone = useTodoStore((s) => s.clearDone)
  const stats = todoStats(todos)

  return (
    <div className="card">
      <div style={{ marginBottom: 6 }}>
        共 <strong>{stats.total}</strong> 条，已完成 <strong>{stats.done}</strong> 条，还剩{' '}
        <strong>{stats.remaining}</strong> 条（{stats.percent}%）
      </div>
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

// ============================================================
// 列表项：零 props，直接从 store 拿操作
// ============================================================
function TodoList() {
  const todos = useTodoStore((s) => s.todos)

  if (todos.length === 0) {
    return <p className="hint">列表是空的，上面加一条试试。</p>
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((t) => (
        <TodoItem key={t.id} id={t.id} text={t.text} done={t.done} />
      ))}
    </ul>
  )
}

function TodoItem({ id, text, done }: { id: number; text: string; done: boolean }) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo)
  const removeTodo = useTodoStore((s) => s.removeTodo)

  return (
    <li className={done ? 'card done' : 'card'} style={{ marginBottom: 6 }}>
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={done} onChange={() => toggleTodo(id)} />
        <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
      </label>
      <button className="btn-ghost" onClick={() => removeTodo(id)} style={{ float: 'right' }}>
        删除
      </button>
    </li>
  )
}

// ============================================================
// 页面
// ============================================================
export default function TodoWithZustand() {
  const resetStore = () => {
    // 演示用：把持久化的数据也一起清掉，回到初始状态
    useTodoStore.setState({
      todos: [
        { id: 1, text: '把 Day6 的 Context 版待办读懂', done: true },
        { id: 2, text: '用 Zustand 再写一遍（不写 Provider）', done: false },
        { id: 3, text: '切到别的页面再回来，看数据还在不在', done: false },
      ],
      nextId: 4,
    })
  }

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>动手验这四件事</h3>
        <ol style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>加几条待办 → 切到「1. 基础用法」→ 回来，<strong>数据还在</strong>（store 不随组件卸载）</li>
          <li>看顶部「全局待办 N 条」也在同步变化（跨页面共享同一份数据）</li>
          <li>
            <strong>按 F5 刷新整个页面</strong> → 数据还在（<code>persist</code> 存了 localStorage；
            Day6 的 Context 版刷新就没了）
          </li>
          <li>打开 F12 → Application → Local Storage → 找 <code>day8-todos</code>，能看到 JSON</li>
        </ol>
        <button className="btn-ghost" onClick={resetStore}>
          重置成初始数据
        </button>
      </div>

      <TodoInput />
      <TodoStats />
      <TodoList />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>和 Day6 的 Context 版对比</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}></th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Day6 Context 版</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>今天 Zustand 版</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['要写 Provider 吗', '要：<TodoProvider>', '不用'],
              ['要给 value 做优化吗', '要：useMemo + useCallback', '不用'],
              ['忘了包 Provider 会怎样', '运行时抛错（要靠自定义 hook 报）', '不可能忘，根本没 Provider'],
              ['切路由后状态', '跟着 Provider 卸载 → 丢', '保留'],
              ['刷新页面后', '丢（除非自己写 localStorage）', '保持（persist）'],
              ['只订一个字段', '做不到', '能做到'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <strong>{c}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ============================================================
 * persist 的三个细节（面试会问）
 * ============================================================
 * 1. name 是什么？
 *    → localStorage 的 key。同一个 key 的 store 共享一份数据。
 *
 * 2. partialize 干什么？
 *    → 只挑要存的部分。函数（addTodo 这种）不能序列化，必须排除。
 *      不写 partialize 的话，zustand 会自动跳过函数，但显式写更清楚。
 *
 * 3. 存的是明文，别放敏感信息
 *    → localStorage 用户随时能改、任何脚本都能读。token / 手机号别往里放。
 *
 * 还有一个坑：**持久化会"记住"旧数据**。
 *    你把 store 结构改了（比如字段改名），浏览器里存的老 JSON 还在 →
 *    可能出现"字段是 undefined"的怪 bug。排查第一步：清 localStorage。
 *    所以真实项目要加版本号：{ name: 'x', version: 1, migrate: (old) => ... }
 * ============================================================ */
