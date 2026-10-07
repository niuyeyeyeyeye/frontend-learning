> ###### JavaScript权威网站：[MDN Web Docs](https://developer.mozilla.org/zh-CN/)

# javascript笔记

## JavaScript组成

### ECMAScript

js核心语法

### web api

DOM：操作文档（比如点击按钮弹出一个东西）

BOM：操作浏览器（比如刷新页面、跳转链接）

## 书写位置

### 行内（内联）

在标签内部

```html
<button onclick="alert('逗你玩')">
    点击月薪过万
</button>
```

> vue会使用

### 内部

写在</body>上方（原因：等页面加载完再执行 JS，不然可能找不到元素）

### 外部

通过script引入到HTML中，也要写在</body>上方

> script标签内部写代码会被忽略

## 注释与结束符

### 注释

单行注释：

//

多行注释：

/*    */

### 结束符



以英文;结尾，JavaScript中可省略不写，但是不写分号可能引起bug

```javascript
let a = 1
let b = 2
[a, b] = [b, a]
```

这一段会被判定为：

let a = 1

let b = 2[a, b] = [b, a]

导致报错

## 输入输出语句

### 输出语句

document.write('')直接写到网页上（很少用，会覆盖页面）

控制台输出：

console.log('')打印到浏览器控制台（调试专用，最常用）

弹框输出：

alert('')

> alert和prompt会跳过页面渲染先被执行

### 输入语句

prompt('')

## 变量

### 变量

是存储数据的容器

### 变量的声明与赋值

```javascript
    //1.声明一个年龄变量
    // let age
    //2.赋值
    // age = 18
    //3.变量初始化
    // let age = 18
    let age,uname
```

> 不建议一行同时声明`多个`变量

### let和var的区别

var：可以先使用再声明，可以多次声明一个变量(旧的声明方式，现在基本不用了)

- var声明的变量是全局作用域和当前函数作用域
- let声明的变量是当前作用域

~~~ javascript
for (var i = 0; i < 3; i++) {
      setTimeout(function () {
        console.log('var 版本：', i)   // 输出 3 3 3
      }, 0)
    }

    for (let j = 0; j < 3; j++) {
      setTimeout(function () {
        console.log('let 版本：', j)   // 输出 0 1 2
      }, 0)
    }

    // 原因：
    // var 是函数作用域，整个循环只有 1 个 i；循环先跑完（i 变成 3），
    //     定时器才执行，所以三个回调看到的都是同一个 i = 3
    // let 是块级作用域，每轮循环都会创建一个新的 j，
    //     三个回调各自记住自己那一轮的 j ✅
~~~



## 常量

```javascript
const PI = 3.14
```

使用const关键字

不允许更改，声明必须赋值

## 基本数据类型

### 数字类型

number：JavaScript中数字类型为number

NaN：计算错误

#### toLocaleString()

将数字转换成字符串类型(Date对象也有同名方法，但作用不同）

~~~ JavaScript
// 1. 转成美元货币格式
(123456).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// 结果：$123,456.00

// 2. 转成人民币格式
(123456).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
// 结果：¥123,456.00

// 3. 限制小数点后几位（很适合显示评分）
(3.1415926).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// 结果：3.14
~~~



### 字符类型

string：单引号、双引号、反引号包裹的叫字符串，推荐使用`单引号`，引号嵌套必须用`不同`的引号

- 字符相连：

```javascript
console.log('我今年18'+'岁了')
```



- 模板字符串：模板字符串外面用反引号包裹，里面用${}包裹变量

```JavaScript
let age = 18
document.write(`我今年${age}岁了`)
```

常见字符串方法：

#### trim()

去除字符串**两端**的空白字符（空格、换行、制表符），返回新字符串（不改变原串）

#### toLowerCase()

将字符串所有字符转换为小写。不改变原串，返回一个新的小写字符串。

#### toUpperCase()

将字符串所有字符转换为大写。不改变原串，返回一个新的大写字符串。

### 布尔类型

boolean:只有true和false两个值，true false 是布尔型字面量

### undefined

未定义类型，声明一个变量为未赋值就是 undefined

### null

null： 空类型 表示一个空值

### 数据类型检测

typeof后面加上数据类型

```JavaScript
typeof 数据类型
```

## 类型转换

### 隐式转换

`除了加号`以外的算术运算符都会把数据转换成数据类型

加号两边只要有字符串就会把另一个变成字符串类型

console.log(+'123')可以转换成Number类型



**隐式转换**（JS 自动帮你转）：

- +号两边只要有字符串，就变成字符串拼接：'1' + 2 → '12'
- 其他运算符（- * /）会把字符串转成数字：'6' - 2 → 4
- +号放一个字符串前面可以转数字：+'123' → 123

### 显式转换

```JavaScript
let str = '123'
    console.log(Number(str))
    console.log(Number('niuyeye'))
    // let num =Number(prompt('请输入你的年薪'))
    let num = +prompt('请输入你的年薪')
    // console.log(Number(num))
    console.log(num)
    console.log(parseInt('12px'))//12
       console.log(parseInt('12.345'))//12
    console.log(parseInt('12px345'))//12
    console.log(parseFloat('12px'))//12
    console.log(parseFloat('12.345'))//12.345
    console.log(parseFloat('12px345'))//12
```

**显式转换**（你主动去转）：

- Number('123') → 123，Number('abc') → NaN
- parseInt('12px') → 12（只取整数部分，碰到非数字就停）
- parseFloat('12.34px') → 12.34（保留小数）

## 函数

### 基本语法

function 函数名(形参){

函数体

}

函数名(实参)；

`函数调用必须有括号，可以没有参数`

### return返回值

- return把函数计算结果交出去
- 没有return函数默认返回undefined
- return后面的代码不执行

### 形参和实参

形参：定义函数时括号里的变量（占位符），可以给形参一个默认值

实参：调用函数时传进去的具体值



### 动态参数arguments

`arguments`是函数内部的伪数组变量，保存传递的所有实参

### 作用域

- 函数内部声明的变量（let/const），外面访问不到
- 函数内部可以访问外面声明的变量

### 箭头函数

基本语法：

(参数)=>{函数体}

- 只有一个参数时括号可省略：x => x * 2
- 没有参数时括号不能省：() => console.log('hi')

简便写法：

函数名=(参数)=>返回值

`只有一行 return 语句时，`{}` 和 `return` 可省略`

### `...`剩余参数

**把调用时传进来的所有实参，收集成一个真正的数组**

```javascript
function fn(...args) {
  console.log(args)
}

fn(1, 2, 3)      // [1, 2, 3]
fn('a', 'b')     // ['a', 'b']
fn()             // []
fn(1)            // [1]
```

### Date()函数

`Date(参数)直接调用会忽略内部参数`



想让Date()正确读取时间戳需要将Date()作为构造函数创建对象调用

`new Date(参数)`

toLocaleString()方法：

必须使用`new Date(参数).toLocaleString()`

与数字同名方法不同，会将Date对象的时间转换成字符串类型

## 高阶函数

### 回调函数（函数作为参数）

把函数A当作参数传给函数B，A就是回调函数

### 函数作为返回值

函数可以返回另一个函数

### 闭包

- 内层函数可以访问外层函数的变量，即使外层函数已经执行完毕
- 外层函数的变量在内层函数执行完毕前不会被释放

### 递归

- 函数调用自身
- 必须有终止条件，否则会无限循环导致栈溢出

### 匿名函数

没有函数名，一般在表达式部分，`普通匿名函数this跟具名函数完全一样`，`箭头函数this指向外层`

### 构造函数

专门用来创建和初始化对象的函数，是一种调用方式，用new调用

~~~ javascript
function Person(name) {
  this.name = name;
}

const p = new Person('Tom');
~~~



### this

`this的值在调用时才确定`



- 普通函数调用：执行时this指向外层window或指向undefined（**是否严格模式**）
- 对象方法调用：this指向调用的对象
- 构造函数：指向即将被创建的实例对象
- 箭头函数：指向外层函数

### call/apply/bind方法

都能够改变函数内this的指向

- `call`：立刻调用函数，并指向this，参数一个一个传入，用逗号隔开

```JavaScript
function showTask(prefix, suffix) {
  console.log(prefix + this.taskContent + suffix);
}

const myTask = { taskContent: '学习JS' };

// 把 showTask 里的 this 强行指向 myTask，并传入参数 '【' 和 '】'
showTask.call(myTask, '【', '】'); 
// 立即输出: 【学习JS】
```

- `apply`：立刻调用函数，并指向this，参数打包成数组传入

```JavaScript
function showTask(prefix, suffix) {
  console.log(prefix + this.taskContent + suffix);
}

const myTask = { taskContent: '学习JS' };

// 把 this 指向 myTask，但参数必须放在数组里
showTask.apply(myTask, ['【', '】']); 
// 立即输出: 【学习JS】
```

`bind`：延迟调用函数，返回一个this永久绑定的新函数

```JavaScript
function showTask(prefix, suffix) {
  console.log(prefix + this.taskContent + suffix);
}

const myTask = { taskContent: '学习JS' };

// 1. 绑定 this，但此时并不执行
const boundShow = showTask.bind(myTask, '【', '】');

// 2. 以后想什么时候执行，就什么时候执行
boundShow(); // 输出: 【学习JS】
```



### IIFE

函数定义后就直接调用，是一种写代码的模式。

~~~JavaScript
(function () {
  console.log('我会立刻执行')
})()
//外层括号让函数变成表达式
//后面的 () 才是真正的函数调用
~~~



## 对象

### 创建方式

const/let 对象名 = {

属性：属性值，

...

}

### 添删改查

- 查看

  `console.log(对象.属性)；`

  ​

  `变量 = 属性值；`
  `console.log(对象名[变量名])；`
  ​

- 添加
  `对象名.新属性名 = 新属性值；`

  `对象名.新方法名 = function(){函数体}`

- 修改
  `对象名.属性 = 新的属性名；`
  ​

- 删除

  `delete 对象.属性；`

### 对象方法

对象里的函数叫方法，要调用方法外的属性需要用this关键字

​

​    const/let 对象名 = {

​              // 方法1：传统写法

​              方法名 : function() {

​            console.log(this.属性）

​        }

​

​              // 方法2：ES6 简写（推荐）

​              方法名() {

​            console.log( this.属性)

​              }

},

### this关键字

- 指向调用它的那个对象
- 同一个函数谁调用this就是谁

### 对象的遍历

第一种

for (变量 in 对象){

​    console.log(变量 + '：' + 对象[变量]);

}

第二种

// Object.keys() 获取所有属性名组成数组
        变量 = Object.keys(对象)

        console.log('所有属性名：', keys)

​    // Object.values() 获取所有值组成数组

​        变量 = Object.values(对象)

​        console.log('所有值：', values)

### 对象的解构

#### 普通解构

const/let {变量，变量，...} = 对象

**相当于没有更改名字的重命名写法**

`变量名必须与属性名相同`

#### 重命名解构

const/let {属性:变量，...} = 对象



#### 解构默认值

const/let {变量=默认值，...} = 对象

#### 函数参数解构

**解构以后调用函数可以无视顺序传参**



格式：

function 函数名({ 属性, ... }) {

​      console.log(属性)

​    }

   函数名(对象)；



```JavaScript
function printUser({ nickname = '匿名', level = 0 } = {}) {
}
printUser(); // ✅ 完美运行，输出 '匿名', 0
```



### JavaScript内部对象方法

#### Object.keys()

**将对象的属性名提取出来，组装成一个数组并返回的内置方法**



#### Object.values()

**将对象的属性值提取出来，组装成一个数组并返回的内置方法**



#### Object.assign()

**把后面的对象属性加到第一个对象里面，重复的属性会覆盖第一个对象的属性值**

通常用法

Object.assign({}, 对象名, 对象名)



#### `...`展开运算符

**返回一个新对象**

用法：

{ ...对象名, ...对象名 }

## 数组

### 数组解构

#### 基础用法

const/let [变量,...] = [元素1,...]

#### 跳过某个元素（用逗号占位）

const/let [变量,,变量] = [元素1,元素2,元素3]

#### 剩余元素收集

```JavaScript
const [a, ...rest] = [1, 2, 3, 4];
console.log(a);    // 1
console.log(rest); // [2, 3, 4]
```

### 数组方法

#### push()

在数组后面插入一个元素

#### pop()

删除数组末尾的元素

#### unshift()

在数组前面插入一个元素

#### shift

删除数组的第一个元素

#### splice

splice(索引，要删除的元素数量，添加的元素,......)

从起始索引开始删除指定个数的元素，然后在该位置插入后续传入的元素

**会返回删除的元素组成的数组**

#### forEach

遍历数组，没有返回值

forEach((当前元素, 索引, 数组本身) => {
    // 对每个元素执行操作
    // 没有返回值，回调的return不影响原数组
    // return不能保留或剔除元素
})

`必须传递函数`

#### map

遍历数组，返回一个新数组

map(当前元素，当前索引，数组本身的地址) => {
    // 必须返回一个值
    // 顶替掉原来数组对应位置的元素
    // 数组长度不变
})

`必须传递函数`

#### filter（过滤）

filter((当前元素, 索引, 数组本身) => {
    // 必须返回 true 或 false
    // 返回 true → 该元素被保留
    // 返回 false → 该元素被剔除
})

**必须传递函数，返回一个新数组**

#### find

find（(当前元素, 索引, 数组本身) => {

// 找到数组中第一个符合的元素并返回元素本身，没找到返回undefined

})

#### findIndex

findIndex（(当前元素, 索引, 数组本身) => {
    // 返回 truthy 或 falsy
})

**找到数组中第一个符合的元素并返回该元素的索引，没找到返回-1**

#### reduce

reduce((累积器, 当前元素, 索引, 数组本身) => {
    // 必须 return 一个新值，作为下一次循环的“累积器”
}, 初始值);

| 应用场景            | 代码示例（核心逻辑）                                                                            | 结果                           |
| --------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| **数组转对象**（统计次数） | ['a','b','a'].reduce((obj, v) => { obj[v] = (obj[v] \| | 0) + 1;  return obj; }, {})   |
| **数组去重**        | `[1,2,2,3].reduce((arr, v) => { if(!arr.includes(v)) arr.push(v); return arr; }, [])` | `[1, 2, 3]`                  |
| **数组展平**（多维变一维） | `[[1,2],[3,4]].reduce((arr, v) => arr.concat(v), [])`                                 | `[1, 2, 3, 4]`               |
| **对象属性聚合**      | 把商品列表按类别归类等复杂逻辑。                                                                      | （复杂对象）                       |

#### some

some()判断是否有一个元素满足条件，满足返回true，不满足返回false

#### every

every()判断是否所有元素都满足条件，满足返回true，不满足返回false

#### sort

```javascript
[3, 1, 10, 2].sort((a, b) => a - b)
```

数组排序，返回值为负数或0不变位置，为正数则交换，最后会改变原数组

**必须写比较函数，否则会比较字符串的Unicode**

#### concat

连接多个数组，返回一个新数组

#### join

['a', 'b'].join(',')

参数为分隔符

**将数组变成字符串，用分隔符号间隔，返回一个字符串**

#### slice

`[].slice(start,end)`**不包含end**

截取数组的两个索引之间的元素，返回一个新数组，原数组不改变

### `...`展开运算符

`[...arr1, ...arr2,...arr3]`

返回一个新数组

## DOM操作

### 主要作用

将页面各个标签认作节点对象，用来操作文档内容

### 查询获取元素

`document.querySelector('选择器')/元素.querySelector('选择器')`**返回匹配的第一个元素**

`document.querySelectorAll('选择器')/元素.querySelectorAll('选择器')`**返回匹配的所有元素（NodeList）**

### 创建与插入节点

一个节点往往创建后还要插入

#### 创建

`document.createElement('标签名')`

`document.createTextNode('文本')`

#### 插入

作为子元素插入：

- `父节点.appendChild(子节点)`**（末尾插入）**
- `父节点.prepend(子节点)`**（开头插入）**
- `父节点.insertBefore(子节点，reference)`**（在指定参考节点前）**

平级插入：

- `目标节点.before(新节点)`**（节点之前）**
- `目标节点.after(新节点)`**（节点之后）**

### 删除

- `节点.remove()`**(从页面上移除节点)**
- `父节点.removeChild(子节点)`**(父级操作)**

### 修改

#### 内容修改

- `element.textContent = '纯文本'`（推荐，无视HTML标签，性能好）。
- `element.innerText = '文本'`（会触发回流，注意与CSS样式联动）。
- `element.innerHTML = '<span>HTML</span>'`（解析标签，**注意XSS风险**）。

#### 属性修改

- 标准属性：`img.src = 'a.jpg'`，`input.value = '123'`，`checkbox.checked = true`。
- 自定义属性：`element.setAttribute('data-id', '5')`，`element.getAttribute('data-id')`。

#### 样式修改

行内样式：`element.style.color = 'red'`，`element.style.display = 'none'`

#### 类名修改

- `节点.classList.add('class')`
- `节点.classList.remove('class')`
- `节点.classList.toggle('class')`
- `节点.classList.contains('class')`

**仅接受类名**

- `节点.className = 'class'`

**接收字符串**

#### id修改

节点.id = '新id'

### DOM内置方法

#### matches

`element.matches('选择器全称')`

判断当前节点是否符合该选择器，并返回true/false

## 事件

### 事件监听（绑定事件/注册事件）

用程序检测是否有事件发生，事件一但触发就立即调用一个函数做出响应

常用`addEventListener('事件类型'，回调函数，是否使用捕获机制true/false)`

### 事件流

事件完整执行的流动路径

### 事件捕获

从DOM的根元素开始去执行对应的事件（从外到里）

格式：`addEventListener('事件类型'，回调函数，是否使用捕获机制true)`

### 事件冒泡

一个元素的事件触发时，同样的事件会在该事件的祖先元素中依次触发（从里到外）

格式：`addEventListener('事件类型'，回调函数，是否使用捕获机制false(可省略))`

阻止冒泡：`事件对象.stopPropagation()`,只能挡住同元素对应监听器

​            `事件对象.stopImmediatePropagation()`,可以挡住同元素的所有监听器

### 事件类型

#### 鼠标事件

| 事件              | 触发时机                | 待办里怎么用                  |
| --------------- | ------------------- | ----------------------- |
| **click**       | 单击元素（最常用）           | 点击“添加”按钮、点击“删除”按钮       |
| **dblclick**    | 双击元素                | 双击待办文字进行编辑（进阶功能）        |
| **mouseenter**  | 鼠标进入元素（不冒泡）         | 鼠标移入待办项时高亮背景            |
| **mouseleave**  | 鼠标离开元素（不冒泡）         | 鼠标移出时取消高亮               |
| **mouseover**   | 鼠标进入元素（**会冒泡**，易误触） | 不太推荐，用 `mouseenter` 更安全 |
| **contextmenu** | 鼠标**右键**点击          | 右键弹出自定义菜单               |

#### 键盘事件

| 事件          | 触发时机               | 待办里怎么用                   |
| ----------- | ------------------ | ------------------------ |
| **keydown** | 按下键盘**任意键**（包括功能键） | 在输入框按 `Enter` 直接添加（提升体验） |
| **keyup**   | 松开键盘按键             | 松开时触发展开搜索                |

#### 表单事件

| 事件         | 触发时机                     | 待办里怎么用        |
| ---------- | ------------------------ | ------------- |
| **submit** | 点击 `<form>` 里的提交按钮 / 按回车 | 拦截表单默认刷新行为    |
| **input**  | 输入框**内容变化时**（实时触发）       | 输入时动态显示剩余字数   |
| **change** | 内容变化后**失去焦点**时才触发        | 编辑完待办后，失焦保存修改 |
| **focus**  | 元素获得焦点（光标进入）             | 输入框自动清空提示文字   |
| **blur**   | 元素失去焦点（光标离开）             | 校验输入是否为空      |

### 事件对象

存储事件触发时的信息，通常命名为`event、ev、e`

function(e){

if(e.key ==='Enter')

alert('我按下了回车')

}



常见属性：

type                		事件类型

clientX/clientY        	获取光标相对于浏览器可见窗口左上角的位置

offsetX/offsetY        	获取光标相当于当前DOM元素左上角的位置

key                    		用户按下的键盘键的值

target                		当前实际触发事件的元素

tagName           	 	标签名，对应大写字符串

preventDefault()    	拦截表单 submit刷新，拦截 contextmenu弹窗

stopPropagation()    阻止事件对象冒泡

e.target.value        	当前输入框的值

### 事件委托

有多个元素注册事件时，将事件委托给父元素的一种技巧

给父元素注册事件，当我们触发子元素，会冒泡到父元素身上触发对应事件



 `e.target`            		指定真正触发事件的元素

`e.currentTarget`        	绑定事件监听器的元素

## 异步

事件从上往下执行，遇到耗时操作跳过执行下一段代码，等结果出来后才回去执行

### 三大异步操作

#### 回调函数(会出现回调地狱)

~~~javascript
function getPrice() {
    getUser(function(user) {            // 第1层
        getOrders(user.id, function(orders) { // 第2层（缩进加深）
            getAmount(orders[0].id, function(amount) { // 第3层（缩进更深）
                console.log(amount);    // 第4层
            });
~~~

#### promise(对象)

```javascript
// 1. 创建（模拟点餐）
const myDish = new Promise((resolve, reject) => {
    // 这里放耗时操作（比如请求接口、读文件）
    let success = true; 

    if (success) {
        resolve("宫保鸡丁做好了"); // 成功 -> 触发 .then
    } else {
        reject("厨房着火了");      // 失败 -> 触发 .catch
    }
});

// 2. 消费（等待上菜）
myDish
    .then(result => console.log(result))   // 打印：宫保鸡丁做好了
    .catch(error => console.error(error))  // 打印：厨房着火了
    .finally(() => console.log("小票作废")); // 无论成功失败，最后都会执行（关掉 loading 动画常用）
```

promise对象内部结果值不能直接使用对象名访问调用，只能用`.then()`、`.catch()` 或 `await` 取出来

**resolve和reject是promise内部创建的两个函数，在执行new Promise时作为参数传入，后面必须手动调用，不然函数会一直等待**

#### async  await

`async`:声明一个函数是异步函数

`await`:在异步函数内部，执行到`await`时将会暂停当前异步函数，并返回一个promise给外部

- ES Module 支持在顶层直接使用 `await`

### 常用函数方法

#### setTimeout(计时器)

```JavaScript
setTimeout(回调函数,时间,回调函数的参数)
```

时间后面的参数会传给回调函数

#### setInterval



#### promise

```javascript
const myPromise = new Promise((resolve, reject) => {
    // 【执行阶段】这里写耗时操作（请求接口、读文件、定时器）
    // 例如： const result = doSomethingHeavy();

    if (/* 成功条件 */) {
        resolve(/* 成功时返回的数据 */);   // 触发 .then
    } else {
        reject(/* 失败原因 */);            // 触发 .catch
    }
});

myPromise
    .then((successData) => {
        // 【处理成功】拿到数据后的业务逻辑
        console.log('成功:', successData);
        return successData; // 可选：传递给下一个 .then
    })
    .catch((error) => {
        // 【处理失败】统一报错提示
        console.warn('失败:', error);
    })
    .finally(() => {
        // 【收尾工作】关闭 loading、释放资源等
    });
```

成功返回一个promise对象

#### then

接收promise成功时返回的值

~~~JavaScript
function getPrice() {
    return getUser()
        .then(user => getOrders(user.id))
        .then(orders => getAmount(orders[0].id))
        .then(amount => console.log(amount))
        .catch(error => console.log(error));
}
~~~



#### try{}catch{}

包住有风险的代码，防止整个程序崩溃

try内报错就会执行catch

#### fetch

网络请求工具，本身返回一个promise

```javascript
async function getUserData() {
    try {
        // 1. 发起请求（等待网络回应）
        const response = await fetch('https://api.example.com/user/123');

        // 2. 【关键步骤】手动判断 HTTP 状态码
        if (!response.ok) {
            // 如果状态码不是 2xx，手动抛出错误，跳转到 catch
            throw new Error(`HTTP错误！状态码：${response.status}`);
        }

        // 3. 解析 JSON 数据（这也是异步，需要 await）
        const data = await response.json();

        // 4. 正常使用数据
        console.log('用户数据：', data);
        return data;

    } catch (error) {
        // 这里既能抓住“断网”，也能抓住上面手动抛出的“404/500”
        console.error('请求彻底失败了：', error.message);
        // 可以给用户弹个提示，比如 “加载失败，请刷新重试”
    }
}

// 调用函数
getUserData();
```



## 模块化

### 创建方式和作用

在脚本中加入`type="module"`可以将脚本变成模块



- 脚本会进入严格模式（'use strict'）
- 有自己的作用域，var变量不会挂到 window 上
- 顶层this由window变成undefined
- 不阻塞 HTML 解析，异步执行模块
- 可以用 import / export 语法

### export导出

可以把一个模块的变量和函数暴露给其他模块

~~~ JavaScript
    // export const PI = 3.14              ← 具名导出
    // export function add(a, b) {}        ← 具名导出
    // export default function log() {}    ← 默认导出（一个模块只能一个）
    // export { a, b }                     ← 统一导出
~~~

### import导入

~~~JavaScript
    // import { add } from './utils.js'            ← 导入具名
    // import log from './utils.js'                ← 导入默认（名字随便起）
    // import log, { add } from './utils.js'       ← 默认 + 具名一起
    // import * as utils from './utils.js'         ← 全部导入，用 utils.add() 调用
    // import { add as plus } from './utils.js'    ← 改名
~~~

- import 建议写在文件最顶部（会被提升，不能放在 if 里）


- 变量可以有多个名字
- 同一个模块被 import 多次，只会执行一次（单例）
- 想按条件加载，用动态导入：const m = await import('./utils.js')

`可以同时具名和改名，变量或函数可以拥有多个名字`

#### 默认导入

写在前面，逗号隔开

~~~JavaScript
import log, { add, multiply, subtract, formatPrice, PI, discount} from './utils.js'
~~~



#### 具名导入

~~~JavaScript
import { add } from './utils.js' 
~~~



#### 改名导入

~~~JavaScript
import { value, value as v2, value as v3 } from './module.js';
//可以多个名字导入
~~~

## 原型链

每个对象都有一个向上的原型链，对象继承链上的方法和属性，最顶端是null

### Object.prototype原型对象

所有对象共享Object.prototype原型对象

**上面存放着对象用的方法，会被几乎所有普通对象继承**

### Functionn.prototype原型对象

所有函数对象共享Functionn.prototype原型对象，Functionn.prototype的原型是Object.prototype。

**Functionn.prototype上存放着函数的方法，例如**

- `call`
- `apply`
- `bind`
- `toString`

### 对象方法

#### Object.getPrototypeOf()

获取对象的内部原型`[[Prototype]]`

旧时用`对象.__proto__`

#### prototype

`方法.prototype`

**函数属性,查看方法的原型对象**

#### constructor

`函数.prototype.constructor === 函数`

**函数的原型对象上的方法，用来指回函数本身**

~~~ javascript
Button.prototype = Object.create(Component.prototype)
Button.prototype.constructor = Button
~~~

**新赋值的对象Button.prototype的constructor没有了，需要重新指向**

#### hasOwnProperty

`对象.hasOwnProperty('属性')`

**查看对象有没有对应属性**

#### instanceof

`对象 instanceof 构造函数`

**查看对象的原型链上有没有构造函数的prototype属性，并返回true或false**

#### Object.create

`Object.create(proto, propertiesObject)`

**创建一个新对象对象的原型是proto**

- `proto`：新对象的原型，必须是一个对象或 `null`。
- `propertiesObject`：可选，属性描述符对象，用来定义新对象自己的属性。
- 返回值：创建出来的新对象。

~~~JavaScript
const proto = {
  say() {
    console.log('hello');
  }
};

const obj = Object.create(proto);

console.log(Object.getPrototypeOf(obj) === proto); // true
obj.say(); // hello
~~~

**创建一个新对象，并指定这个新对象的原型**

### new

`const 对象 = new 方法(参数)`

1. 创建一个新的空对象。
2. 把这个新对象的原型指向构造函数的 `prototype` 属性。
3. 把构造函数里的 `this` 绑定到这个新对象。
4. 执行构造函数内部的代码。
5. 如果构造函数返回一个对象，则返回这个对象；否则返回第 1 步创建的新对象。

### class语法

class声明的类有一个固定的constructor构造函数，不声明调用类时js也会生成一个constructor构造函数，类本质是函数，内部是严格模式，class语法就是构造函数+prototype的语法糖

**唯一正常调用方式：**`new 函数(参数)`

`子类不会继承constructor方法，但可以调用super()执行父类constructor`

#### 私有字段

由#开头，属于属性私有槽，不会被继承，必须先声明，只能声明它的类内部访问，外部访问会报错

#### 静态属性（静态字段）

由static关键字声明，挂在类上，会被子类继承，不属于任何实例，使用`类名.属性`调用

#### 实例方法

挂载在类的prototype上，被类的所有实例继承，通常用实例对象调用

#### get/set

- get

用get声明的方法可以直接用属性读取，读取时返回属性值

- set

set声明的方法可以直接用属性传值，不用写()，但只能传一个值

### 继承

子类的构造函数的原型变量的原型指向父类构造函数的原型，

子类构造函数对象的原型指向父类构造函数对象

`class 子类 extends 父类`

- 会继承挂在父类上的静态方法和实例方法
- 子类没有constructor会继承父类的constructor
- 子类要调用父类的构造函数内的实例需要先`super()`,否则使用this会报错

**原型链：**` 子类创建的实例对象 → 子类.prototype → 父类.prototype → Object.prototype → null`

#### this

this指向调用时的实例

#### super

- 调用父类构造函数后才可以this父类的实例
- 可以调用父类原型上的方法和属性

#### props不能改(约定)

`props代表外部传入，属于父类的数据，并且将要被子类继承，这样的数据js约定子类不该改变它们的值，但本质是普通数据`

## 异常和调试

### throw

抛出一个异常，会中断异常之后的js代码，直到错误被`try{}catch{}`接收，通常还与error对象连用

### error

一个构造函数，通常用来创建一个错误对象实例，参数有`message`和`options`

#### message

函数的第一个属性，一般为字符串，其他类型的值会被转化为字符串

#### name

错误类型名称，name属性在Error构造函数的prototype上，可以直接通过实例调用

### options

通常是一个对象，非对象传入会被函数忽略

#### cause

错误原因，如果options是对象，通过构造函数options参数传入cause属性，会直接将cause属性挂在错误对象上，直接用Error调用

#### stack

调试属性

~~~ JavaScript
function a() {
  return new Error('出错了');
}
function b() {
  return a();
}
console.log(b().stack);

Error: 出错了
    at a (file.js:2:10)
    at b (file.js:5:10)
    at <anonymous>:1:1
~~~

## localStorage本地存储

### setItem

以字符串形式存储到浏览器本地

`localStorage.setItem('键'，'值')`

**undefine也会变成字符串**

### getItem

 获取值

`localStorage.getItem(键)`

**获取不存在的键返回null**

### removeItem

删除

`localStorage.removeItem('键')`

### localStorage.clear()

清空全部本地存储

`localStorage.clear()`

### 存储对象

对象使用setItem直接存储会变成字符串，所以通常使用

`JSON.stringify`存`JSON.parse`取

**`	存储的对象不能超过5MB`**

#### JSON.stringify

将对象转换成JSON格式的字符串

`localStorage.setItem('键', JSON.stringify(对象))`

**注意：对象的self属性为自己时，此时为自引用，不能使用JSON.stringify，因为JSON.stringify是树状结构**

~~~javascript
const circular = { name: '自引用' }
    circular.self = circular
    try {
      JSON.stringify(circular)
    } catch (e) {
      console.log('循环引用序列化报错：', e.message)
    }
~~~



#### JSON.parse

将JSON格式的字符串转换成对象

~~~ JavaScript
const str = localStorage.getItem('user');
const user = JSON.parse(str);
~~~

### localStorage的遍历

~~~javascript
for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      console.log('  ' + key + ' = ' + localStorage.getItem(key))
    }
~~~

