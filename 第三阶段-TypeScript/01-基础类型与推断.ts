// ============================================================
// Day1：基础类型与类型推断
// 运行方式：
//   ① npm run check                                    → 只检查类型
//   ② npm run build  然后  node dist/01-基础类型与推断.js  → 看运行结果
// ============================================================

// ============================================================
// 1. 为什么需要类型：先看 JS 的坑
// ============================================================
// 在 JS 里，这种错误只有"运行时"才暴露：
//   function getPrice(product) { return product.price * product.count }
//   getPrice({ price: 10 })     // 得到 NaN —— 不报错，只是悄悄算错
// TS 会在你写代码时就拦下来。这就是 TS 的全部价值。

console.log('=== 1. 准备开始 ===')

// ============================================================
// 2. 基础类型标注：变量名: 类型
// ============================================================
const userName: string = '小明'
const age: number = 18
const isStudent: boolean = true

console.log('=== 2. 基础类型 ===')
console.log(userName, age, isStudent)

// 数组：两种写法完全等价
const tags: string[] = ['前端', '实习']
const scores: Array<number> = [90, 85]
console.log(tags, scores)

// 对象：写清每个属性的类型
const user: { name: string; age: number } = { name: '小红', age: 20 }
console.log(user)

// 元组：长度和类型都固定的数组（知道即可，实际用得少）
const point: [number, number] = [3, 4]
console.log('坐标：', point)

// ============================================================
// 3. 类型推断 —— 重点！不用处处写类型
// ============================================================
// TS 能自己"看"出类型，所以大部分时候不用标注：
const city = '武汉'          // 推断为 string
const total = 0              // 推断为 number
const numbers = [1, 2, 3]    // 推断为 number[]

console.log('=== 3. 类型推断 ===')
console.log(city, total, numbers)
// 👉 把鼠标悬停在变量名上，编辑器会显示推断出的类型 —— 这是学 TS 最快的方法

// 【什么时候必须手写类型？】
// ① 函数参数（TS 推不出来）—— 最常见的场景
// ② 变量先声明、后赋值
let result: string
result = 'ok'
console.log('先声明后赋值：', result)

// ③ 想主动"限制"取值范围的时候（字面量类型）
let status: 'todo' | 'doing' | 'done' = 'todo'
status = 'doing'
console.log('状态：', status)
// status = 'finished'   // ❌ 试试把这行的注释去掉，看 TS 怎么拦你

// ============================================================
// 4. 函数类型：参数类型 + 返回值类型
// ============================================================
function add(a: number, b: number): number {
  return a + b
}
console.log('=== 4. 函数类型 ===')
console.log('add(2, 3) =', add(2, 3))

// 返回值类型通常可以省略（TS 会推断出来）
function double(x: number) {
  return x * 2
}
console.log('double(5) =', double(5))

// 没有返回值 → void
function log(msg: string): void {
  console.log('[日志]', msg)
}
log('函数类型演示')

// 可选参数（用 ?）和默认值
function greet(name: string, title?: string): string {
  return title ? title + ' ' + name : name
}
console.log(greet('小明'))
console.log(greet('小明', '同学'))

function repeat(text: string, times: number = 2): string {
  return text.repeat(times)
}
console.log('默认参数：', repeat('哈'), repeat('哈', 3))

// 箭头函数的类型：写在变量上（或参数上，也可以都写）
const toUpper = (s: string): string => s.toUpperCase()
console.log('箭头函数：', toUpper('abc'))

// ============================================================
// 5. strict 模式下的 null / undefined（我们的 tsconfig 开了 strict）
// ============================================================
// 含义：可能是 null 的值，用之前必须先判断

function firstChar(text: string | null): string {
  if (text === null) return '（空）'   // ← 不处理 null，下一行就会报错
  return text.charAt(0)
}
console.log('=== 5. null 处理 ===')
console.log(firstChar('hello'), '|', firstChar(null))

// ============================================================
// 6. any 和 unknown：请永远别用 any
// ============================================================
// any = 关掉类型检查（用了它，TS 就白装了）
// unknown = "我不知道是什么类型，但用之前必须检查"（安全）
console.log('=== 6. any vs unknown ===')

const dataAny: any = 'hello'
try {
  dataAny.notExistMethod()   // 编译不报错！但运行时会炸
} catch (e) {
  console.log('💥 any 的代价：编译期不报错，运行时才崩 —— ' + (e as Error).message)
}

const dataUnknown: unknown = 'hello'
if (typeof dataUnknown === 'string') {
  console.log('unknown 收窄后可以用：', dataUnknown.toUpperCase())
}
// dataUnknown.toUpperCase()   // ❌ 去掉注释试试：不判断就报错（这才是保护你）

// ============================================================
// 7. 联合类型 + 类型别名（为第 2 天的"建模"铺垫）
// ============================================================
type TodoStatus = 'todo' | 'doing' | 'done'   // type 用来给类型起别名

function describe(s: TodoStatus): string {
  if (s === 'todo') return '待办'
  if (s === 'doing') return '进行中'
  return '已完成'
}
console.log('=== 7. 联合类型与别名 ===')
console.log(describe('todo'), describe('doing'), describe('done'))

// 联合类型：可能是几种类型之一
function printId(id: number | string): void {
  console.log('ID:', id)
}
printId(101)
printId('A-102')

// ============================================================
// 8. 今天要记住的 5 句话
// ============================================================
// ① 写法是  变量名: 类型      函数写法  (参数: 类型): 返回值类型
// ② 能推断出来就不用写；函数参数必须写
// ③ 数组 string[]，对象 { name: string; age: number }
// ④ 别用 any；不确定就用 unknown + 判断
// ⑤ 类型不对 = 编译报错 = 提前发现 bug。这就是 TS 的意义

export {}   // 让这个文件成为独立模块，变量不会和其他 .ts 文件冲突
