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

是组件外传入的值，子组件只能查看不能修改

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

### children

组件标签夹住的内容

