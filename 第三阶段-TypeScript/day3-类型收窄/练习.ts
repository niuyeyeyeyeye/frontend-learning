// ============================================================
// Day3 练习：让 `npm run check` 没有任何输出
// ============================================================
// 规则：先自己改 → `npm run check` → 卡 20 分钟看最下面的答案
// 这个文件一开始有 10 个类型错误
// ============================================================

// ------------------------------------------------------------
// 练习 1：联合类型没先判断，直接用某一侧的方法
// 目标：先判断 typeof，再分别处理
// ------------------------------------------------------------
function size(value: string | number): number {
  if(typeof value === 'string')return value.length
  return value
}

// ------------------------------------------------------------
// 练习 2：可选属性没有安全访问
// 目标：用可选链解决（address 可能不存在）
// ------------------------------------------------------------
interface Employee {
  name: string
  address?: {
    city: string
  }
}
function getCity(e: Employee): string {
  return e.address?.city ?? '没有城市'
}

// ------------------------------------------------------------
// 练习 3：可能是 null 的值直接用了
// 目标：用可选链 + 空值合并，写成一行返回
// 要求：nickname 为 null/undefined 时返回 '匿名用户'
// ------------------------------------------------------------
function showNickname(nickname: string | null | undefined): string {
  return nickname ?? '匿名用户'
}

// ------------------------------------------------------------
// 练习 4：unknown 类型直接用
// 目标：判断它是不是 Error 实例（用 instanceof），是就返回 message，否则返回 '未知错误'
// ------------------------------------------------------------
function errorMessage(e: unknown): string {
  if(e instanceof Error)return e.message
  return '未知错误'
}

// ------------------------------------------------------------
// 练习 5：可辨识联合没有收窄
// 目标：用 ok 判断，分别在两个分支里返回正确内容
// ------------------------------------------------------------
interface Ok {
  ok: true
  value: number
}
interface Err {
  ok: false
  reason: string
}
function unwrap(r: Ok | Err): string {
  if(r.ok) return r.value.toString()
  return r.reason
}

// ------------------------------------------------------------
// 练习 6：用 in 收窄
// 目标：判断有没有 fly 属性，分别调用
// ------------------------------------------------------------
interface Bird {
  fly: () => string
}
interface Fish {
  swim: () => string
}
function move(animal: Bird | Fish): string {
  if('swim' in animal)return animal.swim()
  return animal.fly()
}

// ------------------------------------------------------------
// 练习 7：数组判断缺失
// 目标：用 Array.isArray 收窄 —— 是数组就取第一项，是字符串就按逗号切分取第一段
// ------------------------------------------------------------
function firstItem(value: string | string[]): string {
  if(Array.isArray(value))return value[0]
  return value.split(',')[0]
}

// ------------------------------------------------------------
// 练习 8：类型守卫缺失（unknown 想当对象用）
// 目标：写一个 isPoint(v): v is { x: number; y: number } 守卫，并在这个函数里用它
// ------------------------------------------------------------
interface Point {
  x: number
  y: number
}
function isPoint(v: unknown):v is Point{
  return (
  typeof v ==='object'&&
  v !==null&&
  'x' in v &&
  'y' in v)
}
function sumOfPoint(v: unknown): number | null {
  if(isPoint(v))return v.x + v.y
  return null
}

// ------------------------------------------------------------
// 让练习代码被使用（不用改）
// ------------------------------------------------------------
console.log(size('abc'), getCity({ name: 'a' }), showNickname(null))
console.log(errorMessage(new Error('x')), unwrap({ ok: true, value: 1 }))
console.log(move({ fly: () => '飞' }), firstItem(['a']), sumOfPoint({ x: 1, y: 2 }))

export {}

// ============================================================
// 答案（卡住 20 分钟后再看，看完请合上重写一遍）
// ============================================================
//
// 练习 1：
//   function size(value: string | number): number {
//     if (typeof value === 'string') return value.length
//     return String(value).length          // 或者用别的方式处理 number
//   }
//
// 练习 2：
//   return e.address?.city ?? '未知城市'
//
// 练习 3：
//   return nickname ?? '匿名用户'
//
// 练习 4：
//   if (e instanceof Error) return e.message
//   return '未知错误'
//
// 练习 5：
//   if (r.ok) return '值：' + r.value
//   return '错误：' + r.reason
//
// 练习 6：
//   if ('fly' in animal) return animal.fly()
//   return animal.swim()
//
// 练习 7：
//   function firstItem(value: string | string[]): string {
//     if (Array.isArray(value)) return value[0]
//     return value.split(',')[0]
//   }
//
// 练习 8：
//   function isPoint(v: unknown): v is Point {
//     return typeof v === 'object' && v !== null && 'x' in v && 'y' in v
//   }
//   function sumOfPoint(v: unknown): number {
//     if (!isPoint(v)) return 0
//     return v.x + v.y
//   }
//
// ============================================================
// 【两道"不报错但逻辑错"的思考题】（tsc 查不出来，靠你自己想）
// ============================================================
// 思考题 A：
//   function show(count: number | null) {
//     if (count) return '共 ' + count + ' 条'
//     return '无数据'
//   }
//   show(0) 会返回什么？为什么这可能是个 bug？该怎么改？
//
// 思考题 B：
//   const timeout = userInput || 3000
//   如果 userInput 是 0，结果是什么？应该用哪个运算符？
