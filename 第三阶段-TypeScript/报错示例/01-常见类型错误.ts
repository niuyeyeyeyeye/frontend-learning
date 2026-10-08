// ============================================================
// 报错示例：常见类型错误长什么样（这个文件故意是错的，别去修它）
// ============================================================
// 【怎么运行】
//   npx tsc --ignoreConfig --strict --noEmit 报错示例\01-常见类型错误.ts
//
// 【为什么必须加 --ignoreConfig】
//   TS 7 里如果"命令行指定了文件"、同时目录里又有 tsconfig.json，
//   它会直接报错 TS5112（提示你两者不能同时用）。加 --ignoreConfig 就不加载配置文件。
//   —— 这一点本身就是个知识点：**TS 的报错信息写得很清楚，它会告诉你该怎么修。**
//
// 【目的】让你亲眼看到 TS 怎么在"写代码时"就拦下错误。
// ============================================================

// ---------- 错误 1：类型不匹配（最常见） ----------
// error TS2322: Type 'string' is not assignable to type 'number'.
let userAge: number = '18'

// ---------- 错误 2：函数参数没写类型 ----------
// error TS7006: Parameter 'a' implicitly has an 'any' type.
// error TS7006: Parameter 'b' implicitly has an 'any' type.
function sum(a, b) {
  return a + b
}

// ---------- 错误 3：访问不存在的属性 ----------
// error TS2339: Property 'stock' does not exist on type '{ name: string; price: number; }'.
const item: { name: string; price: number } = { name: '键盘', price: 299 }
console.log(item.stock)

// ---------- 错误 4：参数类型传错 ----------
// error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
function double(x: number): number {
  return x * 2
}
double('5')

// ---------- 错误 5：可能是 null 就直接用（strict 空值检查） ----------
// error TS18047: 'text' is possibly 'null'.
function upper(text: string | null): string {
  return text.toUpperCase()
}

// ---------- 错误 6：函数有分支没返回值 ----------
// error TS2366: Function lacks ending return statement and return type does not include 'undefined'.
function pick(flag: boolean): string {
  if (flag) {
    return 'yes'
  }
}

// ---------- 错误 7：数组元素类型不对 ----------
// error TS2322: Type 'boolean' is not assignable to type 'number'.
const nums: number[] = [1, 2, true]

// ---------- 错误 8：调用了不存在的函数（any 的坑，这个【不报错】！） ----------
// 说明：这里不会报错，但运行时一定崩 —— 所以禁用 any
const anything: any = 'hello'
anything.thisFunctionDoesNotExist()

// ============================================================
// 【重点观察】
// 错误 1~7 都是"编译期"就拦住了（一共 8 条报错，因为错误 2 有两个参数）；
// 错误 8 因为用了 any，编译期完全放行，只有运行时才炸。
//
// 这就是为什么我们说：**写 any 等于关掉 TypeScript。**
// ============================================================
