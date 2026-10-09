// ============================================================
// Day2：对象建模 —— interface 与 type
// ============================================================
// 运行方式：
//   ① npm run check                                     → 只检查类型
//   ② npm run build  然后  node dist\day2-对象建模\讲解.js  → 看输出
//
// 【为什么今天这节最重要】
// 前端 80% 的 TS 代码在干一件事：**描述"后端返回的数据长什么样"**。
// 学会这个，你才能给 React 的 props 标类型（10 月底就要用）。
// ============================================================

// ============================================================
// 1. 场景：一个真实的后端返回值
// ============================================================
// 后端返回的 JSON 大概长这样：
//   { "id": 1, "name": "小明", "email": "a@b.com", "avatar": null }
// 用 interface 把这个"形状"写下来，编辑器就会在你写错字段时立刻提示。

interface User {
  id: number
  name: string
  email: string
}

const u1: User = { id: 1, name: '小明', email: 'a@b.com' }

// 试试把下面这行的注释去掉：少写一个 email 会怎样？
// const u2: User = { id: 2, name: '小红' }

console.log('=== 1. 第一个接口 ===')
console.log(u1)

// ============================================================
// 2. 可选属性 ? 和只读属性 readonly
// ============================================================
interface Article {
  readonly id: number      // 只读：创建之后不能再改（相当于常量属性）
  title: string
  summary?: string         // 可选：这个属性可以不存在
}

const a1: Article = { id: 1, title: 'TypeScript 入门' }             // ✅ 不给 summary
const a2: Article = { id: 2, title: 'CSS 进阶', summary: '布局' }    // ✅ 给了也行

// a1.id = 99        // ❌ 试试去掉注释：只读属性不能改

console.log('=== 2. 可选与只读 ===')
console.log(a1, a2)

// ============================================================
// 3. 嵌套对象 + 对象数组
// ============================================================
interface Address {
  city: string
  detail: string
}

interface Profile {
  name: string
  age: number
  address: Address        // 嵌套：属性的类型本身是个对象
  tags: string[]          // 数组
  friends: User[]         // 对象数组
}

const me: Profile = {
  name: '小明',
  age: 18,
  address: { city: '武汉', detail: '光谷' },
  tags: ['前端', 'TS'],
  friends: [u1],
}

console.log('=== 3. 嵌套与数组 ===')
console.log(me.name, me.address.city, me.tags[0], me.friends[0].name)

// ============================================================
// 4. 在接口里描述"方法"
// ============================================================
interface Calculator {
  add(a: number, b: number): number
  reset(): void
}

const calc: Calculator = {
  add: (a, b) => a + b,      // 参数类型不用再写，TS 会自动推断
  reset() {
    console.log('[Calculator] 已重置')
  },
}

console.log('=== 4. 接口里的方法 ===')
console.log('add(2, 3) =', calc.add(2, 3))
calc.reset()

// ============================================================
// 5. 函数类型：用 type 给"函数"起别名
// ============================================================
type Formatter = (value: number) => string

const priceFormatter: Formatter = (v) => '¥' + v.toFixed(2)   // v 自动推断为 number

console.log('=== 5. 函数类型别名 ===')
console.log(priceFormatter(19.9))

// ============================================================
// 6. 描述"键不确定"的对象：索引签名 / Record
// ============================================================
// 场景：成绩表，科目名是不确定的
interface ScoreMap {
  [subject: string]: number
}
const scores: ScoreMap = { 语文: 90, 数学: 88 }

// 更常用的写法是内置工具类型 Record<键类型, 值类型>
const scores2: Record<string, number> = { 英语: 95, 物理: 82 }

console.log('=== 6. 索引签名与 Record ===')
console.log(scores['语文'], scores2['英语'])

// ============================================================
// 7. type：别名、联合、交叉
// ============================================================
type ID = string | number                      // 别名（联合）
type Status = 'todo' | 'doing' | 'done'        // 字面量联合
type WithTime = { createdAt: string; updatedAt: string }

// 交叉类型 & ：把两个类型"合并"
type ArticleWithTime = Article & WithTime
const a3: ArticleWithTime = {
  id: 3,
  title: '交叉类型演示',
  createdAt: '2026-10-09',
  updatedAt: '2026-10-09',
}

function printId(id: ID): void {
  console.log('ID:', id)
}

console.log('=== 7. type 与交叉类型 ===')
console.log(a3)
printId(101)
printId('A-101')

// ============================================================
// 8. interface 继承（extends）
// ============================================================
interface BaseEntity {
  id: number
  createdAt: string
}

interface Product extends BaseEntity {   // Product 拥有 BaseEntity 的全部属性
  name: string
  price: number
}

const prod: Product = {
  id: 10,
  createdAt: '2026-10-09',
  name: '机械键盘',
  price: 299,
}

console.log('=== 8. 接口继承 ===')
console.log(prod)

// ============================================================
// 9. 实战：给"API 响应"建模（这一步直接通向 React）
// ============================================================
// 后端返回的统一格式：{ code, message, data }
// <T> 是泛型占位符 —— Day3 会专门讲，今天先混个眼熟

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface UserListData {
  list: User[]
  total: number
}

const response: ApiResponse<UserListData> = {
  code: 0,
  message: 'ok',
  data: {
    list: [u1, { id: 5, name: '小红', email: 'b@b.com' }],
    total: 2,
  },
}

console.log('=== 9. API 响应建模 ===')
console.log('状态：', response.message)
console.log('用户数：', response.data.total)
console.log('第一个用户：', response.data.list[0].name)
// 👉 试着写一个不存在的字段，比如 response.data.list[0].nickname，看编辑器怎么提示

// ============================================================
// 10. interface 和 type 怎么选？（面试常问）
// ============================================================
// 【相同点】都能描述对象形状，大多数场景可以互换
//
// 【不同点】
//   interface：
//     ✅ 可以"声明合并"（同名接口自动合并，适合给第三方库扩展类型）
//     ✅ 用 extends 继承，语义更清晰
//     ❌ 不能定义联合类型、也不能给"基本类型"起别名
//   type：
//     ✅ 能定义联合类型 `type A = 'x' | 'y'`
//     ✅ 能起别名 `type ID = string | number`
//     ✅ 能用交叉 `&` 组合
//     ❌ 不能声明合并；重复定义会直接报错
//
// 【实践建议】
//   • 描述"对象/数据结构" → 用 interface（业界主流，React 项目里 props 大多用 interface）
//   • 联合类型 / 字面量 / 别名 / 组合 → 用 type
//   · 别纠结，团队用哪个你就跟着用哪个

// ============================================================
// 11. 今天要记住的 5 句话
// ============================================================
// ① interface 描述对象形状：属性名: 类型，一行一个（不用逗号也行）
// ② ? 可选、readonly 只读、[] 数组、& 交叉、extends 继承
// ③ Record<string, T> 描述"键不固定"的字典
// ④ 描述对象用 interface，联合/别名用 type
// ⑤ 给 API 返回值建模 = 给未来所有 bug 提前上保险

export {}   // 让这个文件成为独立模块
