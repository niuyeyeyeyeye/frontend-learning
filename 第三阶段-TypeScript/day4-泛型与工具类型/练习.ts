// ============================================================
// Day4 练习：让 `npm run check` 没有任何输出
// ============================================================
// 规则：先自己改 → `npm run check` → 卡 20 分钟看最下面的答案
// 这个文件一开始有 9 个类型错误
// ============================================================

// ------------------------------------------------------------
// 练习 1：泛型函数没有声明类型参数
// 目标：给函数补上 <T>，让返回类型和参数类型关联起来
// ------------------------------------------------------------
function wrapInArray<T>(value: T): T[] {
  return [value]
}

// ------------------------------------------------------------
// 练习 2：使用了泛型接口，但没传类型参数
// 目标：给 data 指定一个合适的类型参数（一个对象，含 id 和 title）
// ------------------------------------------------------------
interface ApiResponse<T> {
  code: number
  data: T
}
const postResponse: ApiResponse<{id:number,title:string}> = {
  code: 0,
  data: { id: 1, title: 'TS 学习笔记' },
}

// ------------------------------------------------------------
// 练习 3：泛型约束没满足（number 没有 length 属性）
// 目标：改调用方式，让传进去的值满足"有 length"这个约束
// ------------------------------------------------------------
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
const longer = longest('111', '22')

// ------------------------------------------------------------
// 练习 4：keyof 约束没满足
// 目标：把 'nope' 换成一个真实存在的属性名
// ------------------------------------------------------------
const user = { id: 1, name: '小明', age: 18 }
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
console.log(getProp(user, 'age'))

// ------------------------------------------------------------
// 练习 5：Pick 的第二个参数写错了（不是 User 的属性名）
// 目标：改成"只挑 id 和 name"，组成"列表项"类型
// ------------------------------------------------------------
interface User {
  id: number
  name: string
  email: string
  createdAt: string
}
type UserBrief = Pick<User, 'id' | 'name'>

// ------------------------------------------------------------
// 练习 6：泛型函数的返回值类型不对
// 目标：让返回值符合声明的类型（返回数组）
// ------------------------------------------------------------
function toArray<T>(value: T): T[] {
  return [value]
}

// ------------------------------------------------------------
// 练习 7：Record 少写了一个类型参数
// 目标：补全 Record 的两个类型参数（键是 string，值是 number）
// ------------------------------------------------------------
const scoreMap: Record<string,number> = {
  语文: 90,
}

// ------------------------------------------------------------
// 练习 8：Partial 里的字段类型写错了
// 目标：让 id 符合 User 里定义的 number 类型
// ------------------------------------------------------------
const partialUser: Partial<User> = {
  id: 1,
}

// ------------------------------------------------------------
// 让练习代码被使用（不用改）
// ------------------------------------------------------------
console.log(wrapInArray(1), postResponse.code, longer)
console.log(toArray('x'), scoreMap, partialUser)

export {}

// ============================================================
// 答案（卡住 20 分钟后再看，看完请合上重写一遍）
// ============================================================
//
// 练习 1：
//   function wrapInArray<T>(value: T): T[] { return [value] }
//
// 练习 2：
//   const postResponse: ApiResponse<{ id: number; title: string }> = {
//     code: 0, data: { id: 1, title: 'TS 学习笔记' },
//   }
//   （更规范的做法是先定义 interface Post { id: number; title: string }，再用 ApiResponse<Post>）
//
// 练习 3：
//   const longer = longest('hello', 'hi')     // 字符串有 length
//   或者 longest([1, 2, 3], [1])              // 数组也有 length
//
// 练习 4：
//   console.log(getProp(user, 'name'))        // 'name' 是 user 的属性名
//
// 练习 5：
//   type UserBrief = Pick<User, 'id' | 'name'>
//
//   ⚠️ 顺便记住一个坑（我实测时发现的）：
//      type A = Omit<User, 'nope'>     // ← 居然【不报错】！
//      因为 Omit 的约束写的是 K extends keyof any（任何字符串都行），
//      所以键名写错它只是"白写"，不会提醒你。
//      想检查键名对不对，用 Pick（它的约束是 K extends keyof T，会报错）。
//
// 练习 6：
//   function toArray<T>(value: T): T[] { return [value] }
//
// 练习 7：
//   const scoreMap: Record<string, number> = { 语文: 90 }
//
// 练习 8：
//   const partialUser: Partial<User> = { id: 1 }
//
// ============================================================
// 【一道"不报错但没意义"的思考题】
// ============================================================
// 下面这个函数用了泛型，但 tsc 完全不报错：
//
//   function log<T>(msg: T): void {
//     console.log(msg)
//   }
//
// 问题：这个泛型有用吗？为什么？
// 提示：看 T 出现了几次、有没有建立"进和出"的关联。
