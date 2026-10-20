// ============================================================
// Day1-2：组件与 props
// ============================================================
// 组件 = 一个返回 JSX 的函数（首字母必须大写，React 靠这个区分"组件"和"HTML 标签"）
// props = 父组件传给子组件的数据（只读，子组件不能改）

import type { ReactNode } from 'react'

// ------------------------------------------------------------
// ① 最简单的组件：没有 props
// ------------------------------------------------------------
function Hello() {
  return <p>你好，我是一个组件</p>
}

// ------------------------------------------------------------
// ② 带 props 的组件：用 interface 描述 props 的形状（Day2 学的对象建模！）
// ------------------------------------------------------------
interface UserCardProps {
  name: string
  age: number
  tags?: string[] // 可选属性（Day2 学的 ?）
}

function UserCard({ name, age, tags }: UserCardProps) {
  return (
    <div className="card">
      <strong>{name}</strong>
      <span className="hint">　{age} 岁</span>
      <div style={{ marginTop: 6 }}>
        {tags?.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// ③ props 默认值：用解构赋默认值（TS 会推断出类型）
// ------------------------------------------------------------
interface ButtonProps {
  text: string
  variant?: 'primary' | 'ghost' // 字面量联合（Day1/Day3 学的）
  onClick?: () => void
}

function Button({ text, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={variant === 'primary' ? 'btn' : 'btn-ghost'} onClick={onClick}>
      {text}
    </button>
  )
}

// ------------------------------------------------------------
// ④ children：组件"夹层"里的内容（像 HTML 标签一样用）
// ------------------------------------------------------------
interface PanelProps {
  title: string
  children: ReactNode // 任意可渲染内容
}

function Panel({ title, children }: PanelProps) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </div>
  )
}

// ------------------------------------------------------------
// ⑤ 组件组合：把小组件拼成大组件
// ------------------------------------------------------------
interface Todo {
  id: number
  text: string
  done: boolean
}

const todoList: Todo[] = [
  { id: 1, text: '学 JSX', done: true },
  { id: 2, text: '学 props', done: false },
  { id: 3, text: '写组件', done: false },
]

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <div className={`card ${todo.done ? 'done' : ''}`}>
      {todo.done ? '✅' : '⬜'} {todo.text}
    </div>
  )
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// ⑥ 组合起来展示
// ------------------------------------------------------------
function ComponentsProps() {
  return (
    <div>
      <h3>1. 最简单的组件</h3>
      <Hello />

      <h3>2. 带 props 的组件</h3>
      <UserCard name="小明" age={18} tags={['前端', 'TS']} />
      {/* 没有 tags 也能用（因为它是可选的） */}
      <UserCard name="小红" age={20} />

      <h3>3. props 默认值 + 字面量联合</h3>
      <p>
        <Button text="主要按钮" />
        {'　'}
        <Button text="次要按钮" variant="ghost" />
        {'　'}
        <Button text="点我弹提示" onClick={() => alert('props 传了函数！')} />
      </p>
      <p className="hint">variant 只能是 'primary' 或 'ghost'，写别的 TS 会报错</p>

      <h3>4. children</h3>
      <Panel title="我是标题">
        <p>我是夹在标签中间的内容（children）</p>
        <Button text="里面的按钮" variant="ghost" />
      </Panel>

      <h3>5. 组件组合</h3>
      <TodoList todos={todoList} />
      <p className="hint">
        TodoList 里用了 TodoItem —— 小组件拼成小组件，再拼成页面，这就是 React 的组织方式
      </p>
    </div>
  )
}

export default ComponentsProps
