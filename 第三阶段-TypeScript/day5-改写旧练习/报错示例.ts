// ============================================================
// 报错示例 05：DOM 相关的常见类型错误（这个文件故意是错的，别改）
// ============================================================
// 【怎么运行】
//   npx tsc --ignoreConfig --strict --noEmit day5-改写旧练习\报错示例.ts
// ============================================================

// ---------- 错误 1：querySelector 返回 Element，没有 value ----------
const a = document.querySelector('#x')
a.value = ''

// ---------- 错误 2：可能是 null ----------
const b = document.querySelector<HTMLInputElement>('#y')
b.value = ''

// ---------- 错误 3：e.target 是 EventTarget，没有 dataset ----------
function h1(e: MouseEvent): void {
  console.log(e.target.dataset.index)
}

// ---------- 错误 4：Event 上没有 key ----------
function h2(e: Event): void {
  if (e.key === 'Enter') console.log('回车')
}

// ---------- 错误 5：定时器变量没标注类型，跨函数读写就报 ----------
// error TS7034: Variable 'timer' implicitly has type 'any' in some locations where its type cannot be determined.
// error TS7005: Variable 'timer' implicitly has an 'any' type.
let timer = null
function setTimer(): void {
  timer = setTimeout(() => {}, 100)
}
function readTimer(): boolean {
  return timer !== null
}
setTimer(); readTimer()
// 【注意】如果只用同一个函数（赋值和读取都在里面），TS 反而不报错
//（叫 "evolving any"）—— 但那时它也是 any，等于没有类型保护。
// 所以定时器变量一律主动标注：ReturnType<typeof setTimeout> | null

// ---------- 错误 6：dataset 取出来是 string，不能直接当 number ----------
function h3(e: MouseEvent): void {
  const target = e.target as HTMLElement
  const index: number = target.dataset.index
  console.log(index)
}

// ---------- 错误 7：事件处理器的事件类型不对 ----------
// error TS2769: No overload matches this call.（事件类型和 'click' 不匹配）
document.addEventListener('click', (e: KeyboardEvent) => {
  console.log(e.key)
})

// ---------- 错误 8：可选属性没处理 ----------
interface Cfg {
  timeout?: number
}
function wait(cfg: Cfg): number {
  return cfg.timeout + 1000
}

// ============================================================
// 【补充：两个"能编译通过但危险"的写法】
// ① 到处用 as 断言：
//      const btn = document.querySelector('#addBtn') as HTMLButtonElement
//      btn.textContent = 'x'      // 编译通过，但如果元素不存在 → 运行时 TypeError
//    —— as 不检查 null！所以要么先判断，要么用会"快速失败"的 $ 辅助函数。
//
// ② 到处用 ! 非空断言：
//      const input = document.querySelector<HTMLInputElement>('#x')!
//      input.value = ''
//    —— 同上，元素不存在时运行时崩。
//
// 正确姿势（讲解文件第 2 节）：
//      function $<T extends HTMLElement>(sel: string): T {
//        const el = document.querySelector<T>(sel)
//        if (el === null) throw new Error('找不到元素：' + sel)
//        return el
//      }
//    —— 出错就立刻报"找不到元素：xxx"，比在后头崩掉好查得多。
// ============================================================
