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

返回JSX的函数，首字母大写，使用时像标签

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

改值必须要用useState本身的函数，单独改变值不会重渲染组件，会把函数的参数给react的state，state会再次创建一个值

### setXXX()

函数的参数如果是一个确定的值多次调用改变的是同一个旧值

所以要**传一个函数作为参数**

## 条件渲染&&

{0&& <p>有 {count} 条数据</p>}0这个假值会被渲染