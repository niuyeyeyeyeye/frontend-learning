// ============================================================
// Day5：用 TS 改写旧练习（DOM / 异步 / 防抖节流）
// ============================================================
// 【今天的目标】
// 把你在 day6 写的 JS 练习（搜索防抖 + localStorage 历史记录）改成 TS。
// 改完你会真正体会到：类型系统到底帮你挡掉了多少运行时错误。
//
// 【这个文件怎么用】
// DOM 代码必须在浏览器里才有 document，所以**不要指望 node 能跑它**。
// 正确用法：在 VS Code 里打开，看类型提示和报错（鼠标悬停看类型）。
// 只有最后一节（防抖节流）是可运行的，用 `node dist\day5-改写旧练习\讲解.js` 看输出。
// ============================================================

// ============================================================
// 1. DOM 操作是 TS 里最容易踩坑的地方（三个坑）
// ============================================================
// 坑 ①：querySelector 找不到元素时返回 null → 后续所有操作都"可能是 null"
// 坑 ②：querySelector 返回的是 Element（很宽泛的类），没有 .value / .placeholder
// 坑 ③：事件回调里的 e.target 是 EventTarget，没有 .dataset / .value

// ---------- 写法 A：老实判断（最安全，但啰嗦） ----------
function setupA(): string | null {
  const el = document.querySelector('#todoInput')
  if (el === null) return null                    // ① 先排掉 null
  // 但 el 的类型还是 Element，没有 value
  // el.value = ''                                // ❌ 报错：Property 'value' does not exist on type 'Element'
  const input = el as HTMLInputElement            // ② 用断言"告诉" TS（不推荐首选）
  input.value = ''
  return input.value
}

// ---------- 写法 B：用 querySelector 的泛型参数 ----------
function setupB(): string | null {
  // querySelector 是个泛型函数！可以指定返回的元素类型
  const input = document.querySelector<HTMLInputElement>('#todoInput')
  if (input === null) return null
  input.value = ''                                // ✅ 现在有 value 了
  return input.value
}

// ============================================================
// 2. ⭐ 最佳实践：一个 $ 辅助函数（真实项目里到处都是）
// ============================================================
// 把"找不到就报错"封装起来，后面就再也不用写 if (=== null) 了。
// 用到了 Day4 学的泛型约束 <T extends HTMLElement>。

function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector)
  if (el === null) {
    // 快速失败：一开始就报错，而不是让 null 传到后面变成更难查的 bug
    throw new Error('找不到元素：' + selector)
  }
  return el
}

function setupC(): void {
  const input = $<HTMLInputElement>('#todoInput')
  const list = $<HTMLUListElement>('#todoList')
  const form = $<HTMLFormElement>('#myForm')

  input.value = 'hello'              // ✅ 有 value
  input.placeholder = '请输入...'     // ✅ 有 placeholder
  input.focus()                      // ✅ 有 focus()
  list.innerHTML = ''
  form.reset()

  // 常见元素类型名（记一下，编辑器会自动补全）
  // HTMLInputElement / HTMLButtonElement / HTMLUListElement / HTMLLIElement
  // HTMLFormElement / HTMLDivElement / HTMLImageElement / HTMLAnchorElement
}

// ============================================================
// 3. 事件类型：大部分时候不用手写
// ============================================================
function setupEvents(): void {
  const input = $<HTMLInputElement>('#todoInput')
  const list = $<HTMLUListElement>('#todoList')
  const form = $<HTMLFormElement>('#myForm')

  // ① 回调参数的类型可以自动推断（VS Code 里悬停 e 看类型）
  input.addEventListener('input', (e) => {
    // 这里的 e 是 Event（因为 'input' 事件映射的就是 Event）
    const target = e.target as HTMLInputElement     // 需要转成具体元素才能拿 value
    console.log('输入了：', target.value)
  })

  // ② 要用到具体属性时，显式标注事件类型（更清楚）
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') console.log('按下回车')
  })

  list.addEventListener('click', (e: MouseEvent) => {
    console.log('点了列表：', (e.target as HTMLElement).tagName)
  })

  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()             // ✅ 阻止表单默认提交
  })
}

// 【常用事件类型速查】
// click / dblclick / mousemove → MouseEvent
// keydown / keyup / keypress   → KeyboardEvent
// input / change               → Event（想拿 value 就断言 target）
// submit                       → SubmitEvent
// scroll                       → Event
// focus / blur                 → FocusEvent

// ============================================================
// 4. e.target 的三种处理方式
// ============================================================
function handleTarget(e: MouseEvent): void {
  // 方式一：断言（短，但"你保证"）
  const t1 = e.target as HTMLElement
  console.log(t1.tagName)

  // 方式二：用 instanceof 判断（安全，推荐）
  if (e.target instanceof HTMLElement) {
    console.log(e.target.tagName)          // ← 这里自动收窄成 HTMLElement（Day3 学的）
  }

  // 方式三：配合 closest 找祖先元素（事件委托里最常用）
  const li = (e.target as HTMLElement).closest('li')
  if (li !== null) console.log('所在的 li：', li.textContent)
}

// ============================================================
// 5. ⚠️ dataset 的类型是 string | undefined（很多人栽这里）
// ============================================================
function handleDataset(e: MouseEvent): number | null {
  const target = e.target as HTMLElement
  const index = target.dataset.index        // 类型是 string | undefined（不是 number！）
  if (index === undefined) return null
  return Number(index)                      // 必须手动转数字
}
// 【为什么】HTML 属性都是字符串，所以 data-index="3" 取出来是 '3' 而不是 3

// ============================================================
// 6. 定时器的类型：number | null
// ============================================================
let timer: number | null = null          // 浏览器里 setTimeout 返回 number
function startTimer(): void {
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(() => { timer = null }, 1000)
}

// 【进阶】如果代码要在 Node 里也能跑，用 ReturnType 更通用（Day4 学的）
let timer2: ReturnType<typeof setTimeout> | null = null
function startTimer2(): void {
  if (timer2 !== null) clearTimeout(timer2)
  timer2 = setTimeout(() => { timer2 = null }, 1000)
}
// 浏览器里是 number，Node 里是 NodeJS.Timeout —— ReturnType 两种情况都对 ✅

// 【为什么必须主动标注？】不标注的话：
//     let timer = null        // ← TS 会尝试 "evolving any"（放宽推断）
//   · 在**同一个函数内**赋值和读取，它不报错（TS 能顺着赋值推出类型）
//   · 但一旦**跨函数**读写，它推不出来了，就报：
//        error TS7034: Variable 'timer' implicitly has type 'any' in some locations...
//        error TS7005: Variable 'timer' implicitly has an 'any' type.
//   · 更糟的是：这段时间它就是 any，**等于没有类型保护**。
//   所以：**定时器变量一律主动标注**。这条我特意实测验证过（练习 5 就是这个坑）。

// ============================================================
// 7. 把 localStorage 封装成泛型工具（Day6 的 JS 版升级）
// ============================================================
interface Todo {
  id: number
  text: string
  done: boolean
}

const storage = {
  // ⭐ 泛型方法：调用时自动推断 T
  get<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    try {
      return JSON.parse(raw) as T     // JSON.parse 返回 any，必须断言成 T
    } catch {
      return defaultValue
    }
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
}

function useStorage(): void {
  // 调用时 T 自动推断：todos 的类型是 Todo[]
  const todos = storage.get<Todo[]>('todos', [])
  todos.push({ id: 1, text: '学 TS', done: false })

  storage.set('todos', todos)         // ✅ 类型对得上
  storage.set('todos', '字符串')       // ⚠️ 这行【不会报错】！原因见下面 7.1（重要局限）

  const theme = storage.get<string>('theme', 'light')
  console.log(todos.length, theme)
}

// ============================================================
// 7.1 ⚠️ 泛型的局限：它管不住「key 和 value 的对应关系」
// ============================================================
// 上面 `storage.set('todos', '字符串')` 是**合法代码**（我实测确认过）。
// 原因：
//     set<T>(key: string, value: T)
// 传入 '字符串' 时，T 被推断成 string；而 key 只是个普通 string，
// **两者之间没有任何关系**，所以 TS 无从判断"todos 这个 key 应该配 Todo[]"。
//
// 一句话：**泛型只能表达"参数之间的关系"**。key 和 value 没建立关系 → 就管不住。
//
// 【怎么才能真正拦住】把「key → 类型」的对应关系写进类型里：
// 用一个「映射表」接口 + keyof + 索引访问类型（Day4 学的东西正好凑一起）

interface StorageSchema {
  todos: Todo[]        // 'todos' 这个 key 对应的类型是 Todo[]
  theme: string        // 'theme' 对应的类型是 string
}

const typedStorage = {
  // K 必须是 StorageSchema 的键；value 必须是"这个键对应的那个类型"
  get<K extends keyof StorageSchema>(key: K, defaultValue: StorageSchema[K]): StorageSchema[K] {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    try {
      return JSON.parse(raw) as StorageSchema[K]
    } catch {
      return defaultValue
    }
  },
  set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
}

function useTypedStorage(): void {
  const todos2 = typedStorage.get('todos', [])     // ✅ 自动推断出 Todo[]
  typedStorage.set('todos', todos2)                // ✅
  typedStorage.set('theme', 'dark')                // ✅
  // typedStorage.set('todos', '字符串')           // ❌ 现在报 TS2345（实测验证过）
  // typedStorage.set('name', 'x')                 // ❌ 'name' 不在 StorageSchema 里
  console.log(todos2.length)
}
// 👉 这就是真实项目里"类型安全的 storage"写法。它比纯泛型多做了一件事：
//    **把"哪个 key 存什么类型"写成了类型定义**，于是 TS 才有依据去检查。

// 【诚实提醒】`as T` 只是"你向 TS 保证"，它**不会校验运行时数据**。
// 后端返回的 JSON 如果结构不对，这里不会报错，要到用的时候才崩。
// 真正严谨的做法是配一个类型守卫（Day3 学的 isUser）或使用 zod 这类校验库。

// ============================================================
// 8. 防抖 / 节流的"专业类型标注"（这一节可以运行 ✅）
// ============================================================
// 泛型 A 代表"参数元组"，这样 debounce 出来的函数参数类型和原函数完全一致

function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: A): void => {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  interval = 300,
): (...args: A) => void {
  let last = 0
  return (...args: A): void => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

console.log('=== 8. 防抖节流（可运行部分）===')
const search = (keyword: string, page: number): void => {
  console.log('  真正搜索：', keyword, '第', page, '页')
}
const debouncedSearch = debounce(search, 100)

// 连续调用三次，只有最后一次生效
debouncedSearch('a', 1)
debouncedSearch('ab', 1)
debouncedSearch('abc', 1)
console.log('  连续触发了 3 次，等一下看真正执行几次 ↑')

// TS 会检查参数类型一致（这就是泛型 A 的作用）：
// debouncedSearch('abc')          // ❌ 少传一个参数
// debouncedSearch(123, 1)         // ❌ 第一个参数类型不对

const throttledLog = throttle((msg: string) => console.log('  节流：', msg), 200)
throttledLog('first')
throttledLog('second')            // 距离上一次不足 200ms → 被丢掉
console.log('  节流：第二次调用会被丢弃')

// ============================================================
// 9. JS → TS 对照表（改写时照这个换）
// ============================================================
// | JS 写法                                   | TS 写法                                              |
// |------------------------------------------|------------------------------------------------------|
// | const input = document.querySelector('#a')| const input = $<HTMLInputElement>('#a')              |
// | function render(todo) {}                  | function render(todo: Todo): void {}                  |
// | let timer = null                          | let timer: ReturnType<typeof setTimeout> || null = null|
// | e.target.dataset.index                    | (e.target as HTMLElement).dataset.index               |
// | e.key                                     | 回调参数标成 (e: KeyboardEvent)                        |
// | JSON.parse(raw)                           | JSON.parse(raw) as T（放在泛型封装里）                  |
// | const list = []                           | const list: Todo[] = []                               |

// ============================================================
// 10. 今天要记住的 5 句话
// ============================================================
// ① querySelector 返回 `Element | null` —— 用 $<T>() 辅助函数一次性解决
// ② 事件类型不用背：大部分能推断，需要具体属性时再标注（KeyboardEvent 等）
// ③ e.target 是 EventTarget：断言 / instanceof / closest 三种处理方式
// ④ dataset 出来的都是 string，用之前记得 Number()
// ⑤ 泛型管不住"哪个 key 配哪个类型" —— 要管就用「映射表 + keyof + T[K]」（见 7.1）

export {}
