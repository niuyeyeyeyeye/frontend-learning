// ============================================================
// Day4：泛型与工具类型
// ============================================================
// 运行：npm run build  然后  node dist\day4-泛型与工具类型\讲解.js
//
// 【一句话理解泛型】
// 泛型 = **类型的参数**。函数可以接收"值"作为参数，泛型让函数也能接收"类型"作为参数，
// 这样同一个函数既能处理各种类型，又不会丢掉类型信息。
// ============================================================

// ============================================================
// 1. 为什么需要泛型：先看不用泛型的痛苦
// ============================================================
console.log('=== 1. 没有泛型会怎样 ===')

// 场景：写一个"取数组第一项"的函数
// 写法 A：用 any —— 能跑，但类型信息全丢了
function firstAny(arr: any[]): any {
  return arr[0]
}
const bad = firstAny([1, 2, 3])
// bad 是 any：写 bad.toFixed() 不报错，但如果传的是字符串数组，运行时就会崩

// 写法 B：用泛型 —— 保留类型
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const num = first([1, 2, 3])        // 推断出 number | undefined
const str = first(['a', 'b'])       // 推断出 string | undefined
console.log(num, str)
// 👉 把鼠标悬停在 num 上，会看到类型是 number | undefined（对比 bad 的 any）

// 调用时也可以手动指定类型（一般不写，TS 会推断）
const num2 = first<number>([4, 5, 6])
console.log(num2)

// ============================================================
// 2. 多个类型参数
// ============================================================
console.log('=== 2. 多个类型参数 ===')

function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value]
}
console.log(pair('age', 18))
console.log(pair(1, { name: '小明' }))

// ============================================================
// 3. 泛型约束 extends：限制"能传什么类型"
// ============================================================
console.log('=== 3. 泛型约束 ===')

// T 必须"有 length 属性"
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}
console.log(longest('hello', 'hi'))       // 字符串有 length
console.log(longest([1, 2, 3], [1]))      // 数组也有 length
// longest(1, 2)   // ❌ 去掉注释：number 没有 length，TS 会拦下来

// ⭐ 最常用的约束：K extends keyof T（K 必须是 T 的属性名）
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: '小明', age: 18 }
console.log(getProp(user, 'name'))    // 返回 string
console.log(getProp(user, 'age'))     // 返回 number
// getProp(user, 'nope')              // ❌ 'nope' 不是 user 的属性名

// ============================================================
// 4. 泛型接口 / 泛型别名（真实场景：API 响应）
// ============================================================
console.log('=== 4. 泛型接口 ===')

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface UserItem {
  id: number
  name: string
}

const res1: ApiResponse<UserItem> = {
  code: 0,
  message: 'ok',
  data: { id: 1, name: '小明' },
}

const res2: ApiResponse<UserItem[]> = {
  code: 0,
  message: 'ok',
  data: [{ id: 1, name: '小明' }],
}

console.log(res1.data.name, '|', res2.data.length)
// 👉 同一个 ApiResponse，data 的类型由你指定 —— 这就是泛型的价值

// 泛型别名
type Pair<A, B> = [A, B]
const p1: Pair<string, number> = ['age', 18]
console.log(p1)

// 泛型默认值（不传就用默认）
interface ApiResult<T = unknown> {
  code: number
  data: T
}
const r: ApiResult = { code: 0, data: '随便什么' }   // 不写类型参数，T 就是 unknown
console.log(r.code)

// ============================================================
// 5. 工具类型：TS 内置的"类型加工厂"（实际开发天天用）
// ============================================================
console.log('=== 5. 工具类型 ===')

interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

// ① Omit<T, K>：去掉几个属性 —— 最常用！
//    场景：新增用户时，id 和创建时间是后端生成的，前端不该传
type CreateUserInput = Omit<User, 'id' | 'createdAt'>
const newUser: CreateUserInput = { name: '小明', email: 'a@b.com' }
console.log('新增用户要传的字段：', newUser)

// ② Pick<T, K>：只挑几个属性 —— 场景：列表只显示部分字段
type UserBrief = Pick<User, 'id' | 'name'>
const brief: UserBrief = { id: 1, name: '小明' }
console.log('列表项：', brief)

// ③ Partial<T>：全部变成可选 —— 场景：更新接口（只传要改的字段）
type UpdateUserInput = Partial<Omit<User, 'id'>>
const patch: UpdateUserInput = { name: '小红' }    // 只传 name 就行
console.log('更新时传的字段：', patch)

// ④ Required<T>：全部变成必填
type StrictUser = Required<User>

// ⑤ Readonly<T>：全部变成只读
const frozen: Readonly<User> = { id: 1, name: 'a', email: 'b', createdAt: 'c' }
// frozen.name = 'x'    // ❌ 去掉注释：只读，不能改

// ⑥ Record<K, V>：描述字典
const userMap: Record<string, User> = {
  u1: { id: 1, name: 'a', email: 'b', createdAt: 'c' },
}
console.log('字典的键：', Object.keys(userMap))

// ⑦ ReturnType / Parameters：从已有函数"提取"类型（写库或封装时用）
function makeId(): string {
  return 'id-' + Date.now()
}
type IdType = ReturnType<typeof makeId>          // string

function sendRequest(url: string, retry: number): void {}
type Args = Parameters<typeof sendRequest>       // [url: string, retry: number]
console.log('提取出来的类型只用于类型检查，不会打印')

// ============================================================
// 6. 实战：用泛型封装"请求"（真实项目里就是这么写的）
// ============================================================
console.log('=== 6. 实战：泛型 request ===')

function mockRequest<T>(data: T): Promise<ApiResponse<T>> {
  return Promise.resolve({ code: 0, message: 'ok', data })
}

async function main(): Promise<void> {
  const result = await mockRequest({ id: 1, name: '小明', email: 'a@b.com' })
  // result.data 有完整类型，写 result.data.nam 会立刻报错
  console.log('请求到的名字：', result.data.name)
}
main()

// ============================================================
// 7. ⚠️ 什么时候【不要】用泛型（这条比语法重要）
// ============================================================
// ❌ 反例：类型参数只出现一次，等于没加
//      function log<T>(msg: T): void { console.log(msg) }
//      —— T 没建立任何关联，直接用 unknown 或具体类型就行
//
// ✅ 判断标准：**类型参数至少要在两个地方出现**（比如参数和返回值），
//    这样才能"把进来的类型和出去的类型关联起来"。
//    例如 first<T>(arr: T[]): T | undefined —— T 出现在参数和返回值里 ✅
//
// ✅ 另一个标准：多个调用方要共用同一份逻辑，但类型不同（数组第一项、请求封装、状态容器）

// ============================================================
// 8. 预告：React 里到处都是泛型（10 月底你就会用到）
// ============================================================
// useState<string>('')                    指定状态类型
// useState<User | null>(null)             状态可能是 null
// useRef<HTMLInputElement>(null)          指定 ref 的元素类型
// Array<number> 和 number[]               完全等价（前者就是泛型写法）

// ============================================================
// 9. 今天要记住的 5 句话
// ============================================================
// ① 泛型 = 类型的参数：<T> 写在函数名/接口名后面
// ② 约束用 extends：<T extends { length: number }>、<K extends keyof T>
// ③ 用泛型的信号：类型参数在**至少两个地方**出现，用来建立"进出关联"
// ④ 工具类型记 4 个就够：Omit（去掉）、Pick（挑选）、Partial（全可选）、Record（字典）
// ⑤ 别为了炫技写泛型；能用具体类型就用具体类型

export {}
