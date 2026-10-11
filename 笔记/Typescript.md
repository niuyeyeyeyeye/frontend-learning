# Typescript

## 常用命令

### npm

用来运行**package.json**中的脚本命令，还有几个内置命令`install`、`run`、`init`、`publish`

### npx

npm的附带工具，用来找到并执行某个包提供的命令，本地没有就临时下载



### npm run

执行package.json中script里定义的脚本

## 类型声明

### 普通变量声明

声明时就要给出类型，不然报错

`const 变量:类型`

### 数组类型声明

`let arr:类型[] = []`

泛型写法：

`let arr:Array<类型> = []`

### 函数类型声明

#### 参数类型

参数也要单独设置类型，与普通变量相似

#### 返回值类型

在函数体的前面，大括号之前

或者可单独设置类型

`type Fn = (a: number) => string;`

### interface接口

`interface`是给**函数**和**对象**设置属性的，也叫起别名

- 普通属性：

~~~ typescript
interface 对象别名{
    属性名：属性类型
    属性名:[]类型					//数组
}
~~~

**有接口属性的对象属性名与接口一一对应，但是`可选属性？`可没有；只读属性不可赋值**

- 可读属性

~~~ typescript
interface 对象别名{
    readonly 属性名:属性类型	//不能赋值
}
~~~

- 可选属性：

~~~typescript
interface 对象别名{   
    属性名?:属性类型			//可选属性
}
~~~

- 方法属性：

~~~typescript
interface 对象别名{
    方法名(参数：类型):返回值类型方法	//方法
}
~~~



- 键不确定属性：

~~~typescript
interface 对象别名{
    [占位符：键的类型]：值的类型
}

const scores2: Record<string, number> = { 英语: 95, 物理: 82 }//常用
~~~

- 给函数起别名：

~~~ typescript
interface 函数别名{
    （参数：类型）：返回值类型；
}
~~~

#### interface继承

~~~typescript
interface BaseEntity {
  id: number
  createdAt: string
}

interface Product extends BaseEntity {   // Product 拥有 BaseEntity 的全部属性
  name: string
  price: number
}
~~~

子别名包括父别名的属性

### type工具

同接口，用来给函数、对象和普通变量起别名

-  用type给函数起别名

~~~typescript
type 函数别名 = (参数: 类型) => 返回值类型
~~~



- 合并两个类型(交叉类型)

~~~typescript
type 新别名 = 别名1 + 别名2
~~~

- 联合类型

~~~typescript
type 别名 = 类型1 | 类型2
~~~

- 字面量联合

~~~typescript
type Status = 'todo' | 'doing' | 'done'
~~~

字面量联合就是值只能是后面的三个

## 类型收窄

### 联合收窄

联合类型可以用typeof收窄

**typeof返回字符串**

`支持的 typeof 结果：'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function' | 'symbol' | 'bigint'`

### 字面量收窄

直接字符判断就行

**还可以给类型加上判断标签属性，用标签判断类型**

~~~ typescript
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
~~~

### in判断

**in通常用来判断对象和其原型链上有没有对应属性，属性要用单引号括起来**

`'key' in 对象`返回一个Boolean值

### instanceof判断

**instanceof用来查看构造函数的原型对象是否在某个对象及其原型链上**



判断错误示例：

~~~typescript
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
~~~

### 数组收窄

`通常用Array.isArray判断是否为数组`

### 真值收窄

通常要判断是否是0，0为真值，null为假值

## 安全取值

可选属性不能直接调用，通常要加以处理

### 可选链?.

可选属性不管存在与否直接调用会返回undefined，用undefined调用就会报错，这时候可以在可选属性后面加上?.来调用，这时就不会报错

~~~ typescript
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
~~~

### 空值合并??和||

~~~typescript
const zero: number | null = 0
console.log('0 || 100 =', zero || 100)   // 100  ❌ 0 被当成假值，不是我们想要的
console.log('0 ?? 100 =', zero ?? 100)   // 0    ✅ 只有 null/undefined 才用默认值
~~~

### 安全守卫

创建一个函数直接判断是否类型正确

~~~ typescript
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
~~~

**`v is User意味着如果返回值为true，v的类型就是User`**

## 断言

### 类型断言as

将一个值的类型告诉编译器

~~~ typescript
const rawJson = '{"name":"小明","age":18}'
const parsed = JSON.parse(rawJson) as { name: string; age: number }
console.log(parsed.name, parsed.age)
~~~

~~~typescript
// ❌ 危险场景：as 不是"转换"，它不做任何检查
const notANumber = '5' as unknown as number   // 强行骗过 TS
~~~

### 非空断言！

一个值有两种可能 的类型包括空或者undefined，此时直接使用这个值可能会报错，在这个值后面加上!才可以运行，但是前提是已经不可能为空

~~~ typescript
const map = new Map<string, number>()
map.set('a', 1)

// Map.get 的返回类型是 number | undefined
const value = map.get('a')!
console.log('用 ! 断言后可以直接用：', value.toFixed(2))

// 【为什么慎用】如果 key 不存在，这里会直接崩（运行时才炸）。
// 更好的写法：
const safeValue = map.get('b')
console.log('安全写法：', safeValue === undefined ? '没有这个 key' : safeValue.toFixed(2))
~~~

