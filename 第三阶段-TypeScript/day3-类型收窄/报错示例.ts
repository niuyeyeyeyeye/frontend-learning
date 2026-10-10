// ============================================================
// 报错示例 03：类型收窄相关的常见错误（这个文件故意是错的，别改）
// ============================================================
// 【怎么运行】
//   npx tsc --ignoreConfig --strict --noEmit day3-类型收窄\报错示例.ts
// ============================================================

// ---------- 错误 1：联合类型没收窄就用某一侧的方法 ----------
// error TS2339: Property 'length' does not exist on type 'string | number'.
function size(value: string | number) {
  return value.length
}

// ---------- 错误 2：unknown 直接用 ----------
// error TS18046: 'e' is of type 'unknown'.
function msg(e: unknown) {
  return e.message
}

// ---------- 错误 3：可选属性没安全访问 ----------
// error TS18048: 'obj.address' is possibly 'undefined'.
interface Person {
  name: string
  address?: { city: string }
}
function city(p: Person) {
  return p.address.city
}

// ---------- 错误 4：可能是 null 直接用 ----------
// error TS18047: 'text' is possibly 'null'.
function upper(text: string | null) {
  return text.toUpperCase()
}

// ---------- 错误 5：as 断言"跨类型转换"（TS 会阻止你） ----------
// error TS2352: Conversion of type 'string' to type 'number' may be a mistake...
const n = '5' as number

// ---------- 错误 6：比较了两个永远不可能相等的类型 ----------
// error TS2367: This comparison appears to be unintentional because the types 'number' and 'string' have no overlap.
function check(id: number) {
  if (id === '1') return 'yes'
  return 'no'
}

// ---------- 错误 7：可辨识联合没用标签属性收窄 ----------
// error TS2339: Property 'data' does not exist on type 'Ok | Err'.
interface Ok {
  ok: true
  data: string
}
interface Err {
  ok: false
  error: string
}
function pick(r: Ok | Err) {
  return r.data.length
}

// ============================================================
// 【补充：两个"不报错但很危险"的写法】
// ============================================================
// ① 用 as any 消灭报错（TS 完全放行，运行时才炸）
//      const x = ({} as any).foo.bar      // 编译通过，运行时 TypeError
//
// ② 用 ! 非空断言（同上）
//      const el = document.querySelector('#nope')!   // 编译通过，运行时 null
//
// 记住：**as 和 ! 不是"让 TS 通过"，而是"你向 TS 保证"**。
// 保证错了，代价在运行时。
// ============================================================
