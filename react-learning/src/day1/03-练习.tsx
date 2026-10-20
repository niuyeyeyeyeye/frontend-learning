// ============================================================
// Day1-3：你的练习
// ============================================================
// 规则：把每个组件里的 TODO 补完 → 保存 → 浏览器会自动刷新看到效果
// 卡 20 分钟看下面的答案注释
//
// 完成标准：4 个练习都能在页面上正确显示，且 `npm run check` 没有红波浪线

// ------------------------------------------------------------
// 练习 1：SkillTag —— 一个标签组件
// 要求：接收 label（必填）和 color（可选，默认 '#0969da'）
//       返回一个 <span className="tag">，文字用 label，颜色用 style 里的 color
// ------------------------------------------------------------
function SkillTag({ label, color = '#0969da' }: { label: string; color?: string }) {
  // TODO: 把下面这行换成真正的标签
  return <span className="tag" style={{color:color}}>{label}</span>
}

// ------------------------------------------------------------
// 练习 2：UserList —— 列表组件
// 要求：接收 users（User[]），用 map 渲染出一个卡片列表，每个卡片要有 key
//       每个卡片显示 name 和 age
// ------------------------------------------------------------
interface User {
  id: number
  name: string
  age: number
}

const users: User[] = [
  { id: 1, name: '小明', age: 18 },
  { id: 2, name: '小红', age: 20 },
  { id: 3, name: '小刚', age: 22 },
]

function UserList({ users }: { users: User[] }) {
  // TODO: 用 users.map 渲染列表，记得加 key
  return (
    <ul>{
    users.map((user)=>(
    <li key={user.id}>{`姓名：${user.name} 年龄：${user.age}`}</li> 
  ))
}</ul>
  )
}

// ------------------------------------------------------------
// 练习 3：Alert —— 带 children 的组件
// 要求：接收 type（'info' | 'warn' | 'error'）和 children
//       根据 type 显示不同的背景色（info 蓝 / warn 黄 / error 红）
// 提示：用对象映射颜色最简洁：const colors = { info: '#ddf4ff', ... }
// ------------------------------------------------------------
function Alert({ type, children }: { type: 'info' | 'warn' | 'error'; children: React.ReactNode }) {
  // TODO: 根据 type 选颜色，再把 children 渲染进去
  const colors ={
    info:'#ddf4ff',
    warn:'yellow',
    error:'red'
    
  }
  return <div style={{background:colors[type]??'#333'}}>{children}</div>
}

// ------------------------------------------------------------
// 练习 4：Stat —— 数据展示组件
// 要求：接收 label（string）、value（number）、unit（可选，默认 ''）
//       显示成 "label：value unit" 的形式，value 用大号字
// ------------------------------------------------------------
function Stat({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  // TODO
  return (<div>{label}：<strong style={{fontSize: '20px'}}>{value}</strong>{unit}</div>)
}

// ------------------------------------------------------------
// 下面是展示区（不用改）
// ------------------------------------------------------------
function Practice() {
  return (
    <div>
      <h3>练习 1：SkillTag</h3>
      <div>
        <SkillTag label="HTML" />
        <SkillTag label="CSS" color="#8250df" />
        <SkillTag label="TypeScript" color="#cf222e" />
      </div>

      <h3>练习 2：UserList</h3>
      <UserList users={users} />

      <h3>练习 3：Alert</h3>
      <Alert type="info">这是一条普通提示</Alert>
      <Alert type="warn">这是一条警告</Alert>
      <Alert type="error">这是一条错误</Alert>

      <h3>练习 4：Stat</h3>
      <div>
        <Stat label="已完成" value={12} />
        <Stat label="完成率" value={75} unit="%" />
      </div>
    </div>
  )
}

export default Practice

/* ============================================================
 * 参考答案（先自己写，写完再对照）
 * ============================================================
 *
 * 练习 1：
 *   function SkillTag({ label, color = '#0969da' }: { label: string; color?: string }) {
 *     return <span className="tag" style={{ color }}>{label}</span>
 *   }
 *
 * 练习 2：
 *   function UserList({ users }: { users: User[] }) {
 *     return (
 *       <div>
 *         {users.map((u) => (
 *           <div key={u.id} className="card">
 *             <strong>{u.name}</strong>　<span className="hint">{u.age} 岁</span>
 *           </div>
 *         ))}
 *       </div>
 *     )
 *   }
 *
 * 练习 3：
 *   function Alert({ type, children }: { type: 'info' | 'warn' | 'error'; children: React.ReactNode }) {
 *     const colors = {
 *       info: '#ddf4ff',
 *       warn: '#fff8c5',
 *       error: '#ffebe9',
 *     }
 *     return (
 *       <p style={{ background: colors[type], padding: '8px 12px', borderRadius: 6, marginBottom: 6 }}>
 *         {children}
 *       </p>
 *     )
 *   }
 *   ⭐ 注意 colors[type]：type 是字面量联合，TS 知道 colors 一定有这三个 key
 *
 * 练习 4：
 *   function Stat({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
 *     return (
 *       <span style={{ marginRight: 24 }}>
 *         {label}：<strong style={{ fontSize: 20 }}>{value}</strong>{unit}
 *       </span>
 *     )
 *   }
 * ============================================================ */
