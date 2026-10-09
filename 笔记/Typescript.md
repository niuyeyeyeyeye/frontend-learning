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

