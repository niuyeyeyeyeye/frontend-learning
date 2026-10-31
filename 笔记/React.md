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



## useState方法

声明：`const[值，改值的函数（set值）]=useState(初始值)`

改值必须要用useState本身的函数，单独改变值不会重渲染组件，会把函数的参数给react的state，state会再次创建一个新值

### setXXX()

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

## useEffect方法

useEffect(()=>{...return 清理函数}，依赖数组)

### 使用方向

用`window.innerWidth`可以查看浏览器宽度，包括滚动条和边框以内的区域



### 依赖数组

依赖数组包含useEffect用过的引用，用过就必须放进依赖数组，变量被改变时就会重新执行useEffect

`依赖数组是浅比较，只是比较值`

### 清理函数

清理函数是前一个参数的返回值，用来清理定时器、监听器，清理函数在第二次useEffect之前执行

### 注意事项

- useEffect清理函数只做销毁和作废，不做修改



- 如果在useEffect中旧定时器没有加清除函数，那后续再加清理函数无法清理旧定时器，就只能靠刷新页面来清除



- SSR状态下useEffect不会在服务器上执行，SSR环境没有window，所以window通常放在useEffect中

## useRef方法

useRef方法会返回一个盒子，盒子的值存在current属性中，盒子在组件渲染时保持不变

### DOM和ref属性

ref属性指定DOM的ref盒子

### useRef的两种重载

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

## Context管道通讯

### createContext

创建一个管道

### useContext

管道中的值一般在父组件中返回`<TodoContext.Provider value={value}>{children}</TodoContext.Provider>`传递

取用管道中的值



## 条件渲染&&

{0&& <p>有 {count} 条数据</p>}0这个假值会被渲染