// ============================================================
// Day6 实战：一个「类型安全的数据层」（可运行）
// ============================================================
// 运行：npm run build  然后  node dist\day6-综合实战与收尾\实战-类型安全的数据层.js
//
// 【今天这份代码的意义】
// 它把 Day1~Day5 学的东西全部用上了：
//   Day2 对象建模 → 数据模型
//   Day3 类型收窄 → 处理"找不到 / 两种结果"
//   Day4 泛型与工具类型 → Omit / Partial / keyof / 索引访问
//   Day5 存储封装 + 异步 → 类型安全的持久化 + 接口两种结果
// 而且它**在 Node 里就能跑**（因为把存储抽象成了接口，没直接依赖 localStorage）
// ============================================================

// ============================================================
// 1. 数据模型（Day2：对象建模 + Day4：工具类型）
// ============================================================
interface Todo {
  id: number
  text: string
  done: boolean
}

// 新增时不需要 id（后端/数据层自己生成）→ 用 Omit 去掉
type CreateTodoInput = Omit<Todo, 'id'>
// 更新时每个字段都可选（只传要改的）→ 用 Partial
type UpdateTodoInput = Partial<Omit<Todo, 'id'>>

// 筛选条件用字面量联合（Day1/Day3），而不是随便传个字符串
type Filter = 'all' | 'active' | 'done'

// ============================================================
// 2. 抽象存储：为什么要多写这一层？
// ============================================================
// 直接在代码里用 localStorage 会有两个问题：
//   ① Node 里跑不了（没有 localStorage）→ 没法写测试
//   ② 想换成别的存储（IndexedDB、内存）就得改一堆代码
// 所以先定义一个"存储该长什么样"的接口，具体用哪个实现可以换 —— 这叫依赖注入。

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

// 内存版实现（Node 里用、测试也用）
class MemoryStorage implements StorageLike {
  private data = new Map<string, string>()

  getItem(key: string): string | null {
    return this.data.get(key) ?? null      // Day3：用 ?? 而不是 ||（虽然这里等价，但习惯更好）
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }
}

// 浏览器里想用 localStorage，只要包一层就行（它本来就符合这个接口）：
// const browserStorage: StorageLike = {
//   getItem: (k) => localStorage.getItem(k),
//   setItem: (k, v) => localStorage.setItem(k, v),
// }

// ============================================================
// 3. 类型安全的存储封装（Day5 第 7.1 节的进阶做法）
// ============================================================
// 「映射表」把"哪个 key 存什么类型"写进类型里
type StorageSchema = {
  todos: Todo[]
}

function createStorage(storage: StorageLike) {
  return {
    // K 必须是 StorageSchema 的键；返回值就是"这个键对应的类型"
    get<K extends keyof StorageSchema>(key: K, defaultValue: StorageSchema[K]): StorageSchema[K] {
      const raw = storage.getItem(String(key))
      if (raw === null) return defaultValue
      try {
        return JSON.parse(raw) as StorageSchema[K]
      } catch {
        return defaultValue
      }
    },
    set<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
      storage.setItem(String(key), JSON.stringify(value))
    },
  }
}

// ============================================================
// 4. 数据层本体
// ============================================================
class TodoStore {
  private todos: Todo[] = []
  private nextId = 1
  // 用 ReturnType 拿到 createStorage 返回的类型（Day4 学的）
  private storage: ReturnType<typeof createStorage>

  // 存储从外面传进来（依赖注入）——这样多个 store 可以共用一个存储，也方便测试
  constructor(initial: Todo[] = [], storage: StorageLike = new MemoryStorage()) {
    this.todos = initial
    // 下一个 id = 现有最大 id + 1（避免重复）
    this.nextId = initial.reduce((max, t) => Math.max(max, t.id), 0) + 1
    this.storage = createStorage(storage)
  }

  // 新增：参数类型是 CreateTodoInput（不用传 id）
  add(input: CreateTodoInput): Todo {
    const todo: Todo = { id: this.nextId++, ...input }
    this.todos = [...this.todos, todo]      // 不可变更新：造新数组，不改原数组
    this.save()
    return todo
  }

  // 更新：找不到就返回 null（Day3：明确处理"没有"这种情况）
  update(id: number, patch: UpdateTodoInput): Todo | null {
    const index = this.todos.findIndex((t) => t.id === id)
    if (index === -1) return null

    const current = this.todos[index]
    if (current === undefined) return null          // strict 下的额外保护
    const updated: Todo = { ...current, ...patch }

    this.todos = this.todos.map((t, i) => (i === index ? updated : t))
    this.save()
    return updated
  }

  // 删除：返回"有没有删掉"
  remove(id: number): boolean {
    const before = this.todos.length
    this.todos = this.todos.filter((t) => t.id !== id)
    const removed = this.todos.length < before
    if (removed) this.save()
    return removed
  }

  // 切换完成状态
  toggle(id: number): Todo | null {
    const todo = this.todos.find((t) => t.id === id)
    if (todo === undefined) return null
    return this.update(id, { done: !todo.done })
  }

  // 查询：filter 的类型是联合类型，不用猜"传什么字符串"
  list(filter: Filter = 'all'): Todo[] {
    switch (filter) {
      case 'active':
        return this.todos.filter((t) => !t.done)
      case 'done':
        return this.todos.filter((t) => t.done)
      case 'all':
        return [...this.todos]        // 返回副本，防止外部直接改内部状态
    }
  }

  stats(): { total: number; done: number; active: number } {
    const done = this.todos.filter((t) => t.done).length
    return { total: this.todos.length, done, active: this.todos.length - done }
  }

  // 从存储里恢复
  load(): Todo[] {
    this.todos = this.storage.get('todos', [])
    this.nextId = this.todos.reduce((max, t) => Math.max(max, t.id), 0) + 1
    return this.list()
  }

  //         删除所有已完成的待办，返回删除的条数
  clearDone():number{
    const active = this.list('active')
    const num = this.list('done').length
    this.todos =active
    this.save()
    return num
  }
  //         按文本模糊查找（不区分大小写），空关键词返回全部
  
  search(keyword: string): Todo[]{
    const input = keyword.toLowerCase().trim()
    if(input.length===0){
      return this.list()
    }
    const result = this.list().filter(n=>{
      return n.text.toLowerCase().includes(input)
    })
    return result
  }

  private save(): void {
    this.storage.set('todos', this.todos)      // 类型对得上 —— todos 必须是 Todo[]
  }
}

// ============================================================
// 5. ⭐ 用 never 做「穷举检查」（面试常问）
// ============================================================
// 如果以后给 Filter 加了新值（比如 'important'），下面这个函数会**立刻报错**，
// 提醒你去补处理逻辑。这是 never 最有价值的用法。

function assertNever(value: never): never {
  throw new Error('有未处理的情况：' + JSON.stringify(value))
}

function filterLabel(filter: Filter): string {
  switch (filter) {
    case 'all':
      return '全部'
    case 'active':
      return '未完成'
    case 'done':
      return '已完成'
    default:
      return assertNever(filter)     // 走到这里说明所有情况都处理完了（filter 是 never）
  }
}

// ============================================================
// 6. 异步 + 可辨识联合（Day3 + Day5：接口的两种结果）
// ============================================================
// 真实接口成功和失败返回的结构不同 → 类型上也应该区分开

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
  | { status: 'loading'}

async function fetchTodos(store: TodoStore, shouldFail = false): Promise<ApiResult<Todo[]>> {
  await new Promise<void>((resolve) => setTimeout(resolve, 10))   // 模拟网络延迟
  if (shouldFail) return { ok: false, error: '网络错误' }
  return { ok: true, data: store.list() }
}

function formatResult<T>(r: ApiResult<T>): string{
  if('status' in r){
    return '加载中'
  }else if(r.ok){
    return '加载成功'
  }
  return '失败'+r.error
}

// ============================================================
// 7. 跑起来看看
// ============================================================
function print(todos: Todo[]): void {
  if (todos.length === 0) {
    console.log('  （空）')
    return
  }
  for (const t of todos) {
    console.log('  [' + (t.done ? 'x' : ' ') + '] ' + t.id + '. ' + t.text)
  }
}

async function main(): Promise<void> {
  // 关键：先把"存储"建出来，两个 store 共用它，才能演示"关掉再打开还能恢复"
  const sharedStorage = new MemoryStorage()
  const store = new TodoStore([], sharedStorage)

  console.log('=== 新增 ===')
  store.add({ text: '学 TypeScript', done: false })
  store.add({ text: '写练习', done: false })
  const third = store.add({ text: '复习算法', done: false })
  print(store.list())

  console.log('=== 修改 / 切换完成 ===')
  store.update(1, { text: '学 TypeScript（已改名）' })     // 只传要改的字段（Partial）
  store.toggle(third.id)
  print(store.list())

  console.log('=== 筛选 ===')
  console.log('  未完成：', store.list('active').map((t) => t.text))
  console.log('  已完成：', store.list('done').map((t) => t.text))
  console.log('  统计：', store.stats())

  console.log('=== 删除 ===')
  console.log('  删除 id=2：', store.remove(2))
  console.log('  删除不存在的 id=99：', store.remove(99))
  print(store.list())

  console.log('=== 持久化：新建一个 store，从同一份存储里恢复 ===')
  const store2 = new TodoStore([], sharedStorage)     // 模拟"关掉页面重新打开"
  store2.load()
  print(store2.list())

  console.log('=== 异步结果（成功） ===')
  const r1 = await fetchTodos(store)
  if('status' in r1){
    console.log('加载中')
  }else if (r1.ok) {
    console.log('  拿到 ' + r1.data.length + ' 条')        // ← 收窄成 { ok: true, data }
  } else {
    console.log('  失败：' + r1.error)
  }

  console.log('=== 异步结果（失败） ===')
  const r2 = await fetchTodos(store, true)
  if('status' in r2){
    console.log('加载中')
  }else if (r2.ok) {
    console.log('  拿到 ' + r2.data.length + ' 条')
  } else {
    console.log('  失败：' + r2.error)                      // ← 收窄成 { ok: false, error }
  }

  console.log('=== 穷举检查 ===')
  console.log(' ', filterLabel('all'), filterLabel('active'), filterLabel('done'))
}

// 迷你断言助手：对比"实际值"和"期望值"
function expect(name: string, actual: unknown, wanted: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(wanted)
  console.log((ok ? '✅ ' : '❌ ') + name +
    (ok ? '' : '　实际：' + JSON.stringify(actual) + '　期望：' + JSON.stringify(wanted)))
}

// 用法（放在 main() 里，或者单独写个 test()）
function test(): void {
  const store = new TodoStore()
  store.add({ text: '学 TS', done: false })
  store.add({ text: '写练习', done: false })
  store.add({ text: '复习算法', done: true })
  store.add({ text: '复习数学', done: true })
  store.add({ text: 'Review Algorithm', done: false })   // ← 加英文数据（为了测大小写）

  expect('总数', store.stats().total, 5)                                    // ← 4 → 5
  expect('search("练习")', store.search('练习').map((t) => t.text), ['写练习'])
  expect('search("复习")', store.search('复习').map((t) => t.text), ['复习算法', '复习数学'])
  expect('search("") 返回全部', store.search('').length, 5)                 // ← 4 → 5

  // ⭐ 大小写不敏感（用同一份数据、三种写法，期望结果一样）
  expect('search("review") 全小写', store.search('review').map((t) => t.text), ['Review Algorithm'])
  expect('search("REVIEW") 全大写', store.search('REVIEW').map((t) => t.text), ['Review Algorithm'])
  expect('search("Algorithm") 混合大小写', store.search('Algorithm').map((t) => t.text), ['Review Algorithm'])
  expect('search("abc") 不存在的词返回空', store.search('abc'), [])          // ← 这条才是"期望 0"

  expect('clearDone 返回删除条数', store.clearDone(), 2)
  expect('clearDone 后剩余', store.list().map((t) => t.text), ['学 TS', '写练习', 'Review Algorithm'])  // ← 加上英文那条

  // 边界情况
  expect('删除不存在的 id', store.remove(999), false)
  expect('空数组 search', new TodoStore().search('x'), [])
}
test()

main()

// ============================================================
// 8. 你的练习（3 题，做完再看文件最底部的参考答案）
// ============================================================
// 练习 1：给 TodoStore 加 clearDone(): number
//         删除所有已完成的待办，返回删除的条数
//
// 练习 2：加 search(keyword: string): Todo[]
//         按文本模糊查找（不区分大小写），空关键词返回全部
//
// 练习 3：给 ApiResult 加第三种状态"加载中"：
//         type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string } | { status: 'loading' }
//         然后写一个 formatResult<T>(r: ApiResult<T>): string 把三种情况分别格式化成字符串
//         （体会：加了一种情况后，哪些地方会立刻报错提醒你补逻辑）

/* ============================================================
 * 参考答案（先自己写，写完再对照）
 * ============================================================
 *
 * 练习 1：
 *   clearDone(): number {
 *     const before = this.todos.length
 *     this.todos = this.todos.filter((t) => !t.done)
 *     const removed = before - this.todos.length
 *     if (removed > 0) this.save()
 *     return removed
 *   }
 *
 * 练习 2：
 *   search(keyword: string): Todo[] {
 *     const kw = keyword.trim().toLowerCase()
 *     if (kw === '') return this.list()
 *     return this.todos.filter((t) => t.text.toLowerCase().includes(kw))
 *   }
 *
 * 练习 3：
 *   type ApiResult<T> =
 *     | { status: 'loading' }
 *     | { ok: true; data: T }
 *     | { ok: false; error: string }
 *
 *   function formatResult<T>(r: ApiResult<T>): string {
 *     if ('status' in r) return '加载中...'          // 用 in 收窄（Day3）
 *     if (r.ok) return '成功'
 *     return '失败：' + r.error
 *   }
 *   —— 加了新情况后，如果某个 switch 没处理它，assertNever 会立刻报错。
 *      这就是可辨识联合 + never 的威力。
 * ============================================================ */

export {}
