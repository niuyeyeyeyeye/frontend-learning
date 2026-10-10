// ============================================================
// Day3：类型收窄与安全访问
// ============================================================
// 运行：npm run build  然后  node dist\day3-类型收窄\讲解.js
//
// 【今天解决的真实问题】
// 后端返回的数据经常是"可能为 null"、"可能是数组也可能是字符串"，
// 直接拿来用就会崩。今天学的就是**怎么安全地处理这些情况**。
// ============================================================

// ============================================================
// 1. 什么是"类型收窄"（narrowing）
// ============================================================
// 当一个变量是"联合类型"（可能是 A 也可能是 B）时，
// TS 要求你先判断，才允许你用某一侧的方法。
// 判断之后变量类型"变小"了 —— 这个过程就叫收窄。

console.log('=== 1. typeof 收窄 ===')

function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()      // ← 这个分支里 value 已被收窄成 string
  }
  return value.toFixed(2)           // ← 这个分支里 value 是 number
}
console.log(format('abc'), '|', format(3.14159))

// 支持的 typeof 结果：'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function' | 'symbol' | 'bigint'

// ============================================================
// 2. 字面量收窄（用 === 比较固定值）
// ============================================================
console.log('=== 2. 字面量收窄 ===')

type Status = 'todo' | 'doing' | 'done'

function statusLabel(s: Status): string {
  if (s === 'todo') return '待办'
  if (s === 'doing') return '进行中'
  return '已完成'                    // ← 排除前两种后，这里只剩 'done'
}
console.log(statusLabel('todo'), statusLabel('doing'), statusLabel('done'))

// 【可辨识联合】—— 前端最常用的模式：
// 每个类型都有一个"标签属性"，用它来区分到底是哪一种
interface SuccessResult {
  ok: true
  data: string[]
}
interface FailResult {
  ok: false
  error: string
}
type Result = SuccessResult | FailResult

function handleResult(r: Result): string {
  if (r.ok) {
    return '成功，共 ' + r.data.length + ' 条'    // ← 收窄成 SuccessResult
  }
  return '失败：' + r.error                        // ← 收窄成 FailResult
}
console.log(handleResult({ ok: true, data: ['a', 'b'] }))
console.log(handleResult({ ok: false, error: '网络错误' }))

// ============================================================
// 3. 用 in 判断"有没有某个属性"
// ============================================================
console.log('=== 3. in 收窄 ===')

interface Cat {
  meow: () => string
}
interface Dog {
  bark: () => string
}

function speak(pet: Cat | Dog): string {
  if ('meow' in pet) return pet.meow()   // ← 有 meow 就是猫
  return pet.bark()
}
console.log(speak({ meow: () => '喵～' }), speak({ bark: () => '汪！' }))

// ============================================================
// 4. 用 instanceof 判断"是哪个类的实例"
// ============================================================
console.log('=== 4. instanceof 收窄 ===')

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function describeError(e: unknown): string {
  if (e instanceof ApiError) return '接口错误（' + e.status + '）：' + e.message
  if (e instanceof Error) return '其他错误：' + e.message
  return '未知错误'
}
console.log(describeError(new ApiError(404, '找不到')))
console.log(describeError(new Error('普通错误')))
console.log(describeError('一个字符串'))

// ============================================================
// 5. 数组判断：Array.isArray
// ============================================================
console.log('=== 5. 数组收窄 ===')

function joinAll(value: string | string[]): string {
  if (Array.isArray(value)) return value.join('、')   // ← 收窄成数组
  return value
}
console.log(joinAll(['前端', 'TS']), '|', joinAll('单个字符串'))

// ============================================================
// 6. ⚠️ 真值收窄的坑（很多人踩）
// ============================================================
console.log('=== 6. 真值收窄的坑 ===')

function showCount(count: number | null): string {
  // ❌ 错误写法：if (count) —— count 为 0 时会被当成"假值"，逻辑就错了
  // ✅ 正确写法：明确判断 count !== null
  if (count !== null) {
    return '共 ' + count + ' 条'
  }
  return '数据不存在'
}
console.log(showCount(0))     // 共 0 条（如果写成 if (count)，这里会输出"数据不存在"）
console.log(showCount(null))

// 【记住】真值判断会把这些当成"假"：0、''、false、null、undefined、NaN
// 所以只有当你**确实想**把这些都排除时，才用 if (x)

// ============================================================
// 7. 可选链 ?.（安全的"取属性"）
// ============================================================
console.log('=== 7. 可选链 ===')

interface Company {
  name: string
  address?: {
    city?: string
  }
}

const c1: Company = { name: 'A 公司' }
const c2: Company = { name: 'B 公司', address: { city: '武汉' } }

// 不用可选链：c1.address.city 会直接报错（address 可能是 undefined）
console.log(c1.address?.city)                 // undefined（不报错）
console.log(c2.address?.city)                 // 武汉
console.log(c1.address?.city ?? '未知城市')    // 未知城市

// 可选链的三种形式
const list: string[] | null = null
console.log(list?.[0])                        // 数组下标：undefined

// 调用"可能不存在的函数"——React 里 props.onClick?.() 就是这个写法
interface Handlers {
  onClick?: () => string
}
const handlers: Handlers = {}
console.log(handlers.onClick?.())             // undefined（不会报错）

// ============================================================
// 8. ⭐ 空值合并 ??（和 || 的关键区别，面试常问）
// ============================================================
console.log('=== 8. ?? vs || ===')

const zero: number | null = 0
console.log('0 || 100 =', zero || 100)   // 100  ❌ 0 被当成假值，不是我们想要的
console.log('0 ?? 100 =', zero ?? 100)   // 0    ✅ 只有 null/undefined 才用默认值

const emptyText = ''
console.log("'' || '默认' =", emptyText || '默认')   // 默认 ❌
console.log("'' ?? '默认' =", emptyText ?? '默认')   // ''   ✅

// 【一句话记住】
//   ||  处理"假值"（0、''、false 也算）
//   ??  只处理 null / undefined
// 给"可能是 0 或空字符串"的数据设默认值，必须用 ??

// 逻辑赋值（用得少，知道即可）
let config: { timeout?: number } = {}
config.timeout ??= 5000        // 等价于 config.timeout = config.timeout ?? 5000
console.log('timeout =', config.timeout)

// ============================================================
// 9. 类型断言 as（"我保证它是这个类型"）
// ============================================================
console.log('=== 9. as 的两面性 ===')

// ✅ 合理场景：JSON.parse 返回 any，需要告诉 TS 结构
const rawJson = '{"name":"小明","age":18}'
const parsed = JSON.parse(rawJson) as { name: string; age: number }
console.log(parsed.name, parsed.age)

// ❌ 危险场景：as 不是"转换"，它不做任何检查
const notANumber = '5' as unknown as number   // 强行骗过 TS
// console.log(notANumber.toFixed(2))         // 编译通过，运行时报错！

// 【结论】as 是"你向 TS 保证"，而不是"TS 帮你检查"。
//   能用类型守卫/判断解决的，就别用 as；
//   用 as 之前先问自己："如果它其实不是这个类型，运行时会怎样？"

// ============================================================
// 10. 非空断言 !（比 as 更危险，慎用）
// ============================================================
console.log('=== 10. 非空断言 ! ===')

const map = new Map<string, number>()
map.set('a', 1)

// Map.get 的返回类型是 number | undefined
const value = map.get('a')!
console.log('用 ! 断言后可以直接用：', value.toFixed(2))

// 【为什么慎用】如果 key 不存在，这里会直接崩（运行时才炸）。
// 更好的写法：
const safeValue = map.get('b')
console.log('安全写法：', safeValue === undefined ? '没有这个 key' : safeValue.toFixed(2))

// ============================================================
// 11. 自定义类型守卫（v is T）—— 处理接口数据的正解
// ============================================================
console.log('=== 11. 类型守卫 ===')

interface User {
  id: number
  name: string
}

// 返回值写成 "v is User"，调用方就能收窄
function isUser(v: unknown): v is User {
  return (
    typeof v === 'object' &&
    v !== null &&
    'id' in v &&
    'name' in v
  )
}

function printUser(data: unknown): string {
  if (isUser(data)) {
    return '用户：' + data.name + '（id=' + data.id + '）'   // ← 收窄成 User
  }
  return '数据格式不正确'
}

console.log(printUser({ id: 1, name: '小明' }))
console.log(printUser({ id: 1 }))
console.log(printUser('我不是对象'))

// ============================================================
// 12. 实战：处理"接口可能返回 null"的数据
// ============================================================
console.log('=== 12. 实战 ===')

interface ApiUser {
  id: number
  name: string
  avatar?: string | null
}

// 用可选链 + 空值合并，一行搞定所有"可能是空"的情况
function displayName(data: ApiUser | null): string {
  return data?.name ?? '加载中…'
}
function displayAvatar(data: ApiUser | null): string {
  return data?.avatar ?? '（无头像）'
}

console.log(displayName(null), displayAvatar(null))
console.log(displayName({ id: 1, name: '小明' }), displayAvatar({ id: 1, name: '小明', avatar: null }))
console.log(displayName({ id: 2, name: '小红', avatar: 'a.png' }), displayAvatar({ id: 2, name: '小红', avatar: 'a.png' }))

// ============================================================
// 13. 今天要记住的 5 句话
// ============================================================
// ① 联合类型必须先"收窄"才能用某一侧的方法（typeof / === / in / instanceof / isArray）
// ② 真值判断 if (x) 会误伤 0、''、false —— 该用 !== null 就用 !== null
// ③ ?. 安全取属性；?? 只对 null/undefined 生效（和 || 的区别是面试常问）
// ④ as 和 ! 都是"你向 TS 保证"，不是检查 —— 能不用就不用
// ⑤ 处理接口数据用"类型守卫函数（v is T）"，别用 as 糊过去

export {}
