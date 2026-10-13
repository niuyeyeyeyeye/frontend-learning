// ============================================================
// Day5 练习：把这段「JS 风格的代码」改成正确的 TS
// ============================================================
// 场景：这是你之前用 JS 写的待办列表，现在原样搬到了 .ts 文件里。
// 规则：先自己改 → `npm run check` → 卡 20 分钟看最下面的答案
// 这个文件一开始有 11 行报错（对应 9 处问题，有几处会报两行）
// ============================================================

interface Todo {
  id: number
  text: string
  done: boolean
}

// ------------------------------------------------------------
// 练习 1：querySelector 返回的类型太宽泛，它没有 value
// 目标：用 querySelector 的泛型参数指定成 HTMLInputElement
// ------------------------------------------------------------
function bindInput(): void {
  const input:HTMLInputElement | null = document.querySelector('#todoInput')
  if(input){
    input.value = 'hello'
  }
}

// ------------------------------------------------------------
// 练习 2：元素可能是 null
// 目标：先判断 null（或者用一个辅助函数）
// ------------------------------------------------------------
function $<T extends HTMLElement>(el:string):T|null{
  return document.querySelector<T>(el)
}
function bindButton(): void {
  const btn = $('#addBtn')
  if(btn){
    btn.textContent = '添加'
  }
}

// ------------------------------------------------------------
// 练习 3：函数参数没有类型
// 目标：给参数标注类型
// ------------------------------------------------------------
function renderTodo(todo:Todo):void {
  console.log(todo.text)
}

// ------------------------------------------------------------
// 练习 4：数组没有标注类型，跨函数使用时 TS 推不出来
// 目标：给它标注 Todo[]
// 提示：不标注的话在同作用域里"侥幸能过"，一旦跨函数就报
//       TS7034 / TS7005（implicitly has type 'any'）
// ------------------------------------------------------------
const todos:Todo[] = []
function addTodo(todo: Todo): void {
  todos.push(todo)
}

// ------------------------------------------------------------
// 练习 5：定时器变量没有标注类型，同样是跨函数读写出的问题
// 目标：标注成 ReturnType<typeof setTimeout> | null
// ------------------------------------------------------------
let debounceTimer:ReturnType<typeof setTimeout>|null = null
function schedule(): void {
  debounceTimer = setTimeout(() => {
    debounceTimer = null
  }, 300)
}
function hasPendingTimer(): boolean {
  return debounceTimer !== null
}

// ------------------------------------------------------------
// 练习 6：e.target 上没有 dataset（它是 EventTarget）
// 目标：先把它转成 HTMLElement 再取 dataset
// ------------------------------------------------------------
function handleListClick(e: MouseEvent): void {
  const index = (e.target as HTMLElement).dataset.index
  console.log(index)
}

// ------------------------------------------------------------
// 练习 7：事件类型标错了，Event 上没有 key
// 目标：改成正确的事件类型
// ------------------------------------------------------------
function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') console.log('按下回车')
}

// ------------------------------------------------------------
// 练习 8：对象字面量里 id 的类型不对
// 目标：让 id 符合 Todo 的定义
// ------------------------------------------------------------
const firstTodo: Todo = { id: 1, text: '写作业', done: false }

// ------------------------------------------------------------
// 练习 9：可选属性没处理（timeout 可能是 undefined）
// 目标：用 ?? 给一个默认值
// ------------------------------------------------------------
interface Options {
  timeout?: number
}
function setup(options: Options): number {
  return options.timeout??0 + 1000
}

// ------------------------------------------------------------
// 让练习代码被使用（不用改）
// ------------------------------------------------------------
console.log(todos.length, firstTodo, setup({}), renderTodo, bindInput, bindButton, handleListClick, handleKeydown, schedule, hasPendingTimer, addTodo)

export {}

// ============================================================
// 答案（卡住 20 分钟后再看，看完请合上重写一遍）
// ============================================================
//
// 练习 1：
//   const input = document.querySelector<HTMLInputElement>('#todoInput')
//   if (input === null) return
//   input.value = 'hello'
//   （更推荐：用 $ 辅助函数，见讲解第 2 节）
//
// 练习 2：
//   if (btn === null) return
//   btn.textContent = '添加'
//
// 练习 3：
//   function renderTodo(todo: Todo): void { console.log(todo.text) }
//
// 练习 4：
//   const todos: Todo[] = []
//   —— 不标注类型的 `const todos = []` 会被推断成 any[]（等于关掉检查），
//      而且跨函数使用时会直接报 TS7034/TS7005。
//
// 练习 5：
//   let debounceTimer: ReturnType<typeof setTimeout> | null = null
//   —— 顺便记住这个现象：`let x = null` 在**同一函数内**TS 不报错（叫 evolving any），
//      但跨函数读写就会报错，而且在那之前它一直是 any、没有类型保护。
//
// 练习 6：
//   const target = e.target as HTMLElement
//   const index = target.dataset.index
//   （更安全的写法：if (e.target instanceof HTMLElement) { ... }）
//
// 练习 7：
//   function handleKeydown(e: KeyboardEvent): void { ... }
//
// 练习 8：
//   const firstTodo: Todo = { id: 1, text: '写作业', done: false }
//
// 练习 9：
//   return (options.timeout ?? 0) + 1000
//
// ============================================================
// 【做完后想一件事】
// 这 9 处里，哪几处是"纯类型问题"（不改逻辑），哪几处是"真实 bug"
// （在 JS 里也会出错，只是不会报错）？
// 提示：练习 2/5/6/9 在 JS 里运行时会出问题，练习 1/3/4/7/8 只是类型标注问题。
// ============================================================
