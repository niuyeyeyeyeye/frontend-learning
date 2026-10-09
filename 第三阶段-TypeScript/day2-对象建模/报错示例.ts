// ============================================================
// 报错示例 02：接口与对象建模的常见错误（这个文件故意是错的，别改）
// ============================================================
// 【怎么运行】
//   npx tsc --ignoreConfig --strict --noEmit day2-对象建模\报错示例.ts
// ============================================================

// ---------- 错误 1：缺少必需的属性 ----------
// error TS2741: Property 'name' is missing in type '{ id: number; }' but required in type 'User'.
interface User {
  id: number
  name: string
}
const u1: User = { id: 1 }

// ---------- 错误 2：对象字面量里多写了属性 ----------
// error TS2353: Object literal may only specify known properties, and 'age' does not exist in type 'User'.
const u2: User = { id: 2, name: '小红', age: 18 }

// ---------- 错误 3：修改了只读属性 ----------
// error TS2540: Cannot assign to 'apiBase' because it is a read-only property.
interface Config {
  readonly apiBase: string
}
const cfg: Config = { apiBase: 'https://api.example.com' }
cfg.apiBase = 'https://test.example.com'

// ---------- 错误 4：可选属性没判断就用 ----------
// error TS18048: 'p.summary' is possibly 'undefined'.
interface Post {
  title: string
  summary?: string
}
function summaryLength(p: Post): number {
  return p.summary.length
}

// ---------- 错误 5：接口里同名属性的类型冲突 ----------
// error TS2717: Subsequent property declarations must have the same type.
interface Dup {
  id: number
}
interface Dup {
  id: string
}

// ---------- 错误 6：Record 的值类型不符 ----------
// error TS2322: Type 'string' is not assignable to type 'number'.
const scores: Record<string, number> = { 语文: 90, 数学: '88' }

// ---------- 错误 7：把对象赋给"联合类型"里不匹配的分支 ----------
// error TS2322: Type '{ id: number; }' is not assignable to type 'ID'.
type ID = string | number
const bad: ID = { id: 1 }

// ---------- 错误 8：属性名拼错（TS 会好心地猜你想写什么） ----------
// error TS2561: Object literal may only specify known properties, but 'titl' does not exist in type 'Article'.
//               Did you mean to write 'title'?
interface Article {
  id: number
  title: string
}
const art: Article = { id: 1, titl: 'TS 入门' }
// 👆 注意 "Did you mean to write 'title'?" —— **TS 的报错信息经常直接告诉你答案**，
//    遇到没见过的报错，先完整读一遍它写的话。

// ============================================================
// 【补充：两个不能写出来的错误（语法错误，写出来整个文件都跑不了）】
// ❌ interface 不能定义联合类型：
//      interface Status = 'todo' | 'doing'        // 语法错误
//      正确写法：type Status = 'todo' | 'doing'
//
// ❌ type 不能像接口那样"声明合并"（重复定义会报错）：
//      type A = { x: number }
//      type A = { y: number }                     // 报"重复标识符"
// ============================================================
