// ============================================================
// 报错示例 04：泛型与工具类型的常见错误（这个文件故意是错的，别改）
// ============================================================
// 【怎么运行】
//   npx tsc --ignoreConfig --strict --noEmit day4-泛型与工具类型\报错示例.ts
// ============================================================

// ---------- 错误 1：用了 T 但没声明 ----------
// error TS2304: Cannot find name 'T'.
function wrap(value: T): T[] {
  return [value]
}

// ---------- 错误 2：泛型接口没传类型参数 ----------
// error TS2314: Generic type 'ApiResponse<T>' requires 1 type argument(s).
interface ApiResponse<T> {
  code: number
  data: T
}
const r1: ApiResponse = { code: 0, data: {} }

// ---------- 错误 3：Record 少传类型参数 ----------
// error TS2314: Generic type 'Record<K, V>' requires 2 type argument(s).
const m: Record<string> = { a: 1 }

// ---------- 错误 4：泛型约束没满足 ----------
// error TS2345: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
longest(1, 2)

// ---------- 错误 5：keyof 约束失败 ----------
// error TS2345: Argument of type '"nope"' is not assignable to parameter of type '"id" | "name"'.
const u = { id: 1, name: 'x' }
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
getProp(u, 'nope')

// ---------- 错误 6：工具类型的键写错了（用 Pick 才会报错） ----------
// error TS2344: Type '"nope"' does not satisfy the constraint 'keyof User'.
interface User {
  id: number
  name: string
}
type Bad = Pick<User, 'nope'>

// ⚠️ 【重要反差】Omit 传错键名**不会报错**（我实测验证过）：
//     type AlsoBad = Omit<User, 'nope'>     // 编译通过！只是把 User 原样抄了一边
//  原因：Omit 的定义是 Omit<T, K extends keyof any>，约束是"任意字符串"，不是"T 的属性名"。
//  结论：**想校验键名用 Pick；用 Omit 时自己要核对属性名拼写。**

// ---------- 错误 7：泛型函数返回值类型不符 ----------
// error TS2322: Type 'T' is not assignable to type 'T[]'.
function toArray<T>(value: T): T[] {
  return value
}

// ---------- 错误 8：ReturnType 用在了不是函数的地方 ----------
// error TS2344: Type 'string' does not satisfy the constraint '(...args: any) => any'.
type IdType = ReturnType<string>

// ============================================================
// 【补充：一个"不报错但泛型没意义"的写法】
//   function log<T>(msg: T): void { console.log(msg) }
//   —— T 只出现一次，没有建立任何关联，等价于 log(msg: unknown)
//      泛型的价值在于"把进去的类型和出来的类型关联起来"
// ============================================================
