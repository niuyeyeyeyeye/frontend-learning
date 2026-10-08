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

