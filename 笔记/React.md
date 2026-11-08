# React学习

## JSX

JSX是在JS里的HTML语法，React可以编译

- JS表达式要写在{}中
- 属性用className，fontSize等驼峰命名
- 组件只能有一个根元素，多的用<></>括起来
- style属性要用两层{{}}包起来，外层是JSX，内层是对象的

### 条件渲染

~~~react
{/* ---------- 条件渲染 ---------- */}
      <h3>2. 条件渲染</h3>
      {/* 写法 A：三元（两个分支都要有内容） */}
      <p>{isLoggedIn ? '欢迎回来' : '请先登录'}</p>
      {/* 写法 B：&&（只在条件为真时显示） */}
      {isLoggedIn && <p>这段只在登录后显示</p>}
      {/* 写法 C：提前 return（组件里最常用） */}
      <p className="hint">写法 C：在组件函数里 if (!isLoggedIn) return null</p>
~~~

## 组件

返回JSX的函数，首字母大写，使用时像标签，严格模式下组件函数会被调用两次，来确保外部传入的props值没有被修改

### props

是组件外传入的值，组件只能查看不能修改

可以用解构赋默认值：

~~~react
interface ButtonProps {
  text: string
  variant?: 'primary' | 'ghost' // 字面量联合（Day1/Day3 学的）
  onClick?: () => void
}

function Button({ text, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={variant === 'primary' ? 'btn' : 'btn-ghost'} onClick={onClick}>
      {text}
    </button>
  )
}
~~~

### key

分辨元素的标识，如果元素没有删除修改可以用index

### children

组件标签夹住的内容

children的类型通常是`React.ReactNode`意思是"**任何能显示在屏幕上的东西**"

### 事件处理

onClick后面跟函数引用，如果跟函数调用会将返回值作为事件处理函数

#### 事件处理函数参数

- 箭头函数包一层
- bind调用
- 柯里化工厂

#### 阻止冒泡

事件要阻止冒泡，防止上层元素事件被触发

`e.stopPropagation()`

#### 阻止表单提交刷新页面

提交表单后页面DOM都会重新渲染，要用`e.preventDefault()`来阻止默认刷新



## hook

hook是以use开头的函数，只能放在顶层或自定义hook中，不能放在循环和判断中

### useState方法

声明：`const[值，改值的函数（set值）]=useState(初始值)`

改值必须要用useState本身的函数，单独改变值不会重渲染组件，会把函数的参数给react的state，state会再次创建一个新值

#### setXXX()

函数的参数如果是一个确定的值多次调用改变的是同一个旧值

~~~react
const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [activeCount, setActiveCount] = useState(0) // 当前有几个定时器在跑

  useEffect(() => {
    if (!running) return

    setActiveCount((c) => c + 1)
    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    // ⭐ 清理函数：组件卸载或下一次 effect 前执行
    return () => {
      clearInterval(id)
      setActiveCount((c) => c - 1)
    }
  }, [running]) // running 变化时：先清理旧定时器，再看是否新建

~~~



所以要**传一个函数作为参数，传递的函数的参数就是上一次的state值**

`传递值时useState会判断是否为函数，如果是函数就会首次调用后续不调用`

### useEffect方法

useEffect(()=>{...return 清理函数}，依赖数组)

#### 使用方向

用`window.innerWidth`可以查看浏览器宽度，包括滚动条和边框以内的区域

#### 依赖数组

依赖数组包含useEffect用过的引用，用过就必须放进依赖数组，变量被改变时就会重新执行useEffect，如果没有依赖数组就会随组件渲染`依赖数组是浅比较，只是比较值`

#### 清理函数

清理函数是前一个参数的返回值，用来清理定时器、监听器，清理函数在第二次useEffect之前执行

#### 注意事项

- useEffect清理函数只做销毁和作废，不做修改



- 如果在useEffect中旧定时器没有加清除函数，那后续再加清理函数无法清理旧定时器，就只能靠刷新页面来清除



- SSR状态下useEffect不会在服务器上执行，SSR环境没有window，所以window通常放在useEffect中

### useRef方法

useRef方法会返回一个盒子，盒子的值存在current属性中，盒子在组件渲染时保持不变

#### DOM和ref属性

ref属性指定DOM的ref盒子

#### useRef的两种重载

useRef中参数值会触发两种重载：

~~~typescript
// 重载 1
function useRef<T>(initialValue: T): MutableRefObject<T>;

// 重载 2
function useRef<T>(initialValue: T | null): RefObject<T>;
~~~

当参数为T属性时Ref返回可修改的MutableRefObject<T>属性

当参数为null时T又不包含null就会返回只读的RefObject<T>属性

但是都是只在编译阶段只读，react运行阶段可以赋值

### Context管道通讯

#### createContext

创建一个管道

#### useContext

管道中的值一般在父组件中返回`<TodoContext.Provider value={value}>{children}</TodoContext.Provider>`传递

取用管道中的值

### useNavigate方法

**返回一个函数，函数有一个`必选参数`和一个`options对象`作为参数，调用时会跳转到对应参数的地址，会显示所在页面**

`const navigate = useNavigate()`

- navigate(-1) 返回上一页
- navigate('url',{replace,state,preventScrollReset等})

`replace:true作用是下一页会覆盖本页的历史记录`

### useParams方法

返回一个对象，包含`router文件（路由）`写好的动态段key,字段的值是**字符串类型**，通常用来与当前URL的value配对返回

### useSearchParams方法

**返回一个元组，有两个返回值，第一个返回值是一个`URLSearchParams`对象，只包括URL查询字符串部分，也就是`?`后，第二个返回值是函数，接收两个参数，可以更新当前URL查询字符串部分**



函数的第一个参数：

- 字符串：`setSearchParams("?tab=1")`
- 对象：`setSearchParams({ tab: "1" })`
- 数组（支持多值）：`setSearchParams({ brand: ["nike", "reebok"] })`
- `URLSearchParams` 实例：`setSearchParams(new URLSearchParams("?tab=1"))`

还可以接收第二个可选参数：类型和useNavigate方法的第二个参数相同

### useLocation方法

读取当前URL后返回一个对象，包含：

| `pathname` | `"/settings/profile"` | 路径部分                                    |
| ---------- | --------------------- | ------------------------------------------- |
| `search`   | `"?tab=security"`     | 查询字符串，**带 ?**                        |
| `hash`     | `"#password"`         | 锚点，**带 #**                              |
| `state`    | `null` 或你传的对象   | `navigate(..., { state })` 传过来的隐式数据 |
| `key`      | `"abc123"`            | 这条历史记录的唯一标识                      |

## create方法

是Zustand的入口，创建一个store，state是参数，有selector方法可以单独取需要的字段，selector方法具体就是

通常用`create()(initializer)`来调用，因为不柯里化前面的类型和initializer的类型不匹配报错会很难读

### initializer 函数

create接收一个**initializer 函数**，这个**initializer 函数**负责接收`set/get`方法和返回初始state

`initializer(set, get, api)`

set和get可以省略，set返回一个对象，get返回字段

### store

store包括一份`state`和

- useBearStore.getState()
- useBearStore.setState()
- useBearStore.subscribe()

#### setState()/getState()方法

不会触发渲染，只是拿到`store的state`快照

### selector函数

用来获取`state`依赖部分，只有绑定的部分变化会触发渲染，也就是组件渲染只监听订阅部分的字段变化

`state=>state.字段`

- 只订阅单个字段时单独返回字段即可
- 返回多个字段时可分别返回
- 可返回一个对象或数组，再进行解构，同时返回性能略微差些，但是代码可读性更好，使用useShallow进行浅比较，不然每次和新创建的数组或对象深比较都会触发渲染

### persist持久化

将状态保存到浏览器存储中，来保证数据不会轻易丢失

将initializer初始化函数作为第一个参数，第二个参数必须包含name的对象，也就是在本地存储的键名

- **partialize**：要求部分持久化的字段
- **storage**：存储内容的方式

~~~ react
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}


export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: INITIAL_TODOS,
      nextId: 4,

      addTodo: (text) => {
        const trimmed = text.trim()
        if (trimmed === '') return
        const id = get().nextId // ⭐ get() 读当前状态（不在 set 里也能读）
        set((s) => ({
          todos: [...s.todos, { id, text: trimmed, done: false }], // 不可变更新，Day3 的老规矩
          nextId: s.nextId + 1,
        }))
      },

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),

      removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),

      clearDone: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
    }),
    {
      name: 'day8-todos', // localStorage 的 key
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.localStorage,
      ),
      // 只存数据，不存函数
      partialize: (s) => ({ todos: s.todos, nextId: s.nextId }),
    },
  ),
)
~~~

`本地存储会保留旧数据，如果字段被改了，旧数据覆盖新数据可能会覆盖不到，所以要加上版本号，并且开始要清旧数据，比如version + migrate`

## Link组件

## NavLink组件



## 条件渲染&&

{0&& <p>有 {count} 条数据</p>}0这个假值会被渲染

---

## ⏳ 提前出现 / 正式讲解在后面（2026-11-05 加）

> **为什么加这一节**：有些 API 会提前出现在某天的代码里，但正式讲解在后面几天。
> 我以前的心理是"感觉是后面的内容，就不记了" → 一周后完全想不起来见过。
>
> **判断标准要改：**
> - ❌ 旧：这属于哪天？→ 不是今天的 → 不记
> - ✅ 新：**它出现在我今天要读懂的代码里吗？** → 是 → 记一行（不要求懂）
>
> **不要求懂，只要求留一行。20 秒的事。**

| API / 概念 | 第一次见到 | 现在能说的（一句话） | 还不懂什么 | 正式讲 |
|---|---|---|---|---|
| `useMemo` | Day6 `02-Context入门`（稳住 Provider 的 value） | 把一个值缓存起来，依赖不变就不重算 | 什么时候该用/不该用；为什么依赖里塞新函数就失效 | Day10 |
| `useCallback` | Day6 `03-实战-用Context重写待办`（包 addTodo 等） | 和 useMemo 一伙的，专门稳住**函数**的引用 | 同上 | Day10 |
| `Children` | Day6 `04-练习.tsx` 的 import 里（我抄进去的，**从来没用过**） | —— | 它是什么、干什么用 | 待查（其实很少用） |

### 记录模板（复制这一行，改掉内容）

```
| `xxx` | Day? 文件名 | 一句话 | 一句话 | Day? |
```

### 已经正式讲过的（对照用，别再重复记）

| API | 哪天讲的 |
|---|---|
| `useState` `useEffect` `useRef` | Day2 / Day4 / Day5 |
| `createContext` `useContext` | Day6 |
| `Link` `NavLink` `Outlet` `useParams` `useNavigate` `useSearchParams` `useLocation` | Day7 |
| `create` `useShallow` `persist` | Day8 |
| `useMemo` `useCallback` `React.memo` `lazy` `Suspense` | **Day10（还没讲）** |
