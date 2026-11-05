// ============================================================
// todoStore.ts：待办的全局状态（Day6 用 Context 写的那套，改成 Zustand）
// ============================================================
// 📖 本文件名字对照表
//   todoStore      待办的 store（模块级单例，整个应用只有一份）
//   useTodoStore   读取 store 的 hook（组件里用）
//   persist        持久化中间件（自动存 localStorage）
//   createJSONStorage  把 localStorage 包装成 zustand 认识的 storage
//   noopStorage    空 storage（SSR / 测试环境没有 localStorage 时用）
//   getState       拿当前状态（不在组件里也能用）
//
// ⭐ 三个关键认知
//   1. store 是**模块级**的：`export const useTodoStore = create(...)`
//      → 它活在 React 之外，组件挂了它还在 → 所以切路由、换页面都不丢
//   2. **没有 Provider**。不需要 `<TodoProvider>` 包住谁，任何组件直接 import 就能用
//   3. **状态和操作放在同一个对象里**（todos 和 addTodo 在一起），不需要 reducer / dispatch

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Todo = {
  id: number
  text: string
  done: boolean
}

type TodoStore = {
  todos: Todo[]
  nextId: number
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  clearDone: () => void
}

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: '把 Day6 的 Context 版待办读懂', done: true },
  { id: 2, text: '用 Zustand 再写一遍（不写 Provider）', done: false },
  { id: 3, text: '切到别的页面再回来，看数据还在不在', done: false },
]

// SSR 安全：服务端没有 localStorage，用一个什么都不做的假 storage
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: INITIAL_TODOS,
      nextId: 4,

      addTodo: (text) => {
        const trimmed = text.trim()
        if (trimmed === '') return
        const id = get().nextId // ⭐ get() 读当前状态（不在 set 里也能读）
        set((s) => ({
          todos: [...s.todos, { id, text: trimmed, done: false }], // 不可变更新，Day3 的老规矩
          nextId: s.nextId + 1,
        }))
      },

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      clearDone: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
    }),
    {
      name: 'day8-todos', // localStorage 的 key
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.localStorage,
      ),
      // 只存数据，不存函数
      partialize: (s) => ({ todos: s.todos, nextId: s.nextId }),
    },
  ),
)

// 派生数据不要塞进 store（会要手动同步），用普通函数从 state 算
export function todoStats(todos: Todo[]) {
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  return { total, done, remaining: total - done, percent: total === 0 ? 0 : Math.round((done / total) * 100) }
}
