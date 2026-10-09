// ============================================================
// Day2 练习：把类型修对，让 `npm run check` 没有任何输出
// ============================================================
// 规则同 Day1：先自己改 → `npm run check` → 卡 20 分钟看最下面的答案
// 这个文件一开始有 8 个类型错误（跑一次 check 就知道数量和位置）
// ============================================================

interface User {
  id: number
  name: string
  email: string
}

// ------------------------------------------------------------
// 练习 1：对象少了一个必需属性
// 目标：让 user1 合法（补上缺的属性）
// ------------------------------------------------------------
const user1: User = { id: 1, name: '小明',email:'qq.com' }

// ------------------------------------------------------------
// 练习 2：属性名拼错了
// 目标：改正拼写错误
// ------------------------------------------------------------
interface Article {
  id: number
  title: string
  summary?: string
}
const article1: Article = { id: 1, title: 'TypeScript 入门' }

// ------------------------------------------------------------
// 练习 3：给只读属性赋值了
// 目标：这行代码本身是错的，把不该有的赋值删掉（或改成合法写法）
// ------------------------------------------------------------
interface Config {
  readonly apiBase: string
  timeout: number
}
const config: Config = { apiBase: 'https://api.example.com', timeout: 5000 }

// ------------------------------------------------------------
// 练习 4：可选属性没判断就直接用
// 目标：summary 可能是 undefined，先判断再取 length
// ------------------------------------------------------------
function getSummaryLength(a: Article): number {
  if(a.summary){
  return a.summary.length
}
return 0
}

// ------------------------------------------------------------
// 练习 5：函数类型不匹配
// 目标：让这个函数的参数类型符合 Formatter 的要求
// ------------------------------------------------------------
type Formatter = (value: number) => string
const formatId: Formatter = (value) => 'ID-' + value

// ------------------------------------------------------------
// 练习 6：嵌套对象的属性类型错了
// 目标：让 zipCode 符合类型定义（邮编通常是字符串）
// ------------------------------------------------------------
interface Address {
  city: string
  zipCode: string
}
const addr: Address = { city: '武汉', zipCode: '430000' }

// ------------------------------------------------------------
// 练习 7：数组里的对象元素类型不对
// 目标：修好第二个元素的 text
// ------------------------------------------------------------
interface Todo {
  id: number
  text: string
}
const todos: Todo[] = [
  { id: 1, text: '学 TS' },
  { id: 2, text: '42' },
]

// ------------------------------------------------------------
// 练习 8（进阶）：用 Record 描述字典，但值类型写错了
// 目标：让每个科目的分数都是 number
// ------------------------------------------------------------
const scores: Record<string, number> = {
  语文: 90,
  数学: 88,
}

// ------------------------------------------------------------
// 让练习代码被使用（这行不用改）
// ------------------------------------------------------------
console.log(user1, article1, config.timeout, getSummaryLength(article1))
console.log(formatId(1), addr, todos, scores)

export {}

// ============================================================
// 答案（卡住 20 分钟后再看，看完请合上重写一遍）
// ============================================================
//
// 练习 1：补上 email
//   const user1: User = { id: 1, name: '小明', email: 'a@b.com' }
//
// 练习 2：titl → title
//   const article1: Article = { id: 1, title: 'TypeScript 入门' }
//
// 练习 3：删掉那一行赋值
//   （readonly 是"只读"，想改值应该在创建对象时就定好；
//     如果确实需要可变，就把 readonly 去掉——但先想清楚设计意图）
//
// 练习 4：先判断再取
//   function getSummaryLength(a: Article): number {
//     if (a.summary === undefined) return 0
//     return a.summary.length
//   }
//   （也可以写 a.summary?.length ?? 0，这叫可选链 + 空值合并，Day3 会讲）
//
// 练习 5：参数类型改成 number（因为 Formatter 要求 number）
//   const formatId: Formatter = (value: number) => 'ID-' + value
//
// 练习 6：zipCode 改成字符串
//   const addr: Address = { city: '武汉', zipCode: '430000' }
//   （真实项目里邮编、手机号、身份证号都建议用 string —— 数字会丢前导零）
//
// 练习 7：text 改成字符串
//   { id: 2, text: '写练习' }
//
// 练习 8：'88' → 88
//   const scores: Record<string, number> = { 语文: 90, 数学: 88 }
//
// 【做完后想一件事】
// 练习 6 为什么邮编要用 string 而不是 number？
// （提示：写成 number，'043000' 会变成 43000，前导零丢了）
