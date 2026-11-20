// ============================================================
// 补课-3：表单 —— 受控/非受控 + ⭐ 中文输入法（IME）坑
// ============================================================
// 📖 名字对照
//   受控组件     value + onChange，值由 React 的 state 管
//   非受控组件   defaultValue + ref，值由 DOM 自己管
//   IME          输入法（拼音/五笔），中文输入必经
//   composition  输入法的"组字过程"（还没上屏的拼音）
//   isComposing  当前是否正在组字（isComposing === true 时别急着处理）
//
// ⭐ 一句话：**你天天打中文，而"每次 onChange 就处理"在中文输入法下是错的。**
//   因为打「苹果」会先产生 p→pi→pīng→苹果 一串事件，其中前面全是拼音字母。

import { useRef, useState } from 'react'

const FRUITS = ['苹果', '香蕉', '橙子', '西瓜', '葡萄']

// ============================================================
// 一、受控 vs 非受控
// ============================================================
function ControlledDemo() {
  const [value, setValue] = useState('React')
  const inputRef = useRef<HTMLInputElement>(null)
  const [readBack, setReadBack] = useState('')

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 1：受控与非受控</h3>

      <p style={{ margin: '0 0 4px' }}>
        <strong>受控</strong>（value + onChange，值住在 state 里）：
      </p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: 4, width: 200 }}
      />
      <span style={{ marginLeft: 8, color: '#8b949e', fontSize: 13 }}>
        state = <code>{value}</code>
      </span>

      <p style={{ margin: '12px 0 4px' }}>
        <strong>非受控</strong>（defaultValue + ref，值住在 DOM 里）：
      </p>
      <input
        ref={inputRef}
        defaultValue="DOM 自己管"
        style={{ padding: 4, width: 200 }}
      />
      <button
        className="btn-ghost"
        style={{ marginLeft: 8 }}
        onClick={() => setReadBack(inputRef.current?.value ?? '')}
      >
        读 ref 的值
      </button>
      {readBack !== '' && <code style={{ marginLeft: 8 }}>{readBack}</code>}

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, marginTop: 12 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#57606a' }}>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}></th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>受控</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>非受控</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['值存在哪', 'React state', 'DOM 节点'],
            ['改值靠', 'onChange → setState', '用户输入 / ref.current.value'],
            ['能做即时校验/格式化', '✅ 可以', '❌ 不方便'],
            ['每次输入都重渲染', '✅ 会', '❌ 不会（大表单更快）'],
            ['典型场景', '搜索、实时校验、联动', '文件上传、超大表单、交给第三方库'],
          ].map(([a, b, c]) => (
            <tr key={a}>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{b}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>文件上传只能用非受控</strong>（<code>&lt;input type="file"&gt;</code> 的 value 是只读的，
        你没法"给它设一个文件"）。
      </p>
    </div>
  )
}

// ============================================================
// 二、⭐ 中文输入法坑：同一个搜索框，两种写法
// ============================================================
// 打「苹果」时的事件顺序（简化）：
//   compositionstart
//   input 'p' → input 'pi' → input 'pin' → ...   ← 这些是拼音，不是汉字！
//   compositionend → input '苹果'                ← 这才是用户想要的
//
// ❌ 朴素写法：每次 input 都拿 value 去过滤 → 拼音字母也在搜 → 列表闪、清空
// ✅ 修复写法：组字期间只更新"输入框显示"，等 compositionend 才更新"关键词"

function NaiveSearch() {
  const [keyword, setKeyword] = useState('')
  const list = FRUITS.filter((f) => f.includes(keyword))

  return (
    <div className="card" style={{ borderColor: '#cf222e' }}>
      <strong style={{ color: '#cf222e' }}>❌ 朴素写法</strong>
      <p style={{ margin: '6px 0' }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="用中文输入法打「苹果」"
          style={{ padding: 4, width: 220 }}
        />
      </p>
      <p style={{ margin: 0, fontSize: 13 }}>
        关键词：<code>{keyword || '（空）'}</code>　结果：
        <strong>{list.length}</strong> 个 {list.join('、')}
      </p>
    </div>
  )
}

function FixedSearch() {
  const [keyword, setKeyword] = useState('') // 只用它过滤
  const [draft, setDraft] = useState('') // 输入框里显示的内容（含拼音过程）
  const composing = useRef(false)

  const list = FRUITS.filter((f) => f.includes(keyword))

  return (
    <div className="card" style={{ borderColor: '#1f883d' }}>
      <strong style={{ color: '#1f883d' }}>✅ 加了 composition 处理</strong>
      <p style={{ margin: '6px 0' }}>
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            // ⭐ 组字过程中不动关键词，等上屏再说
            if (!composing.current) setKeyword(e.target.value)
          }}
          onCompositionStart={() => {
            composing.current = true
          }}
          onCompositionEnd={(e) => {
            composing.current = false
            setKeyword(e.currentTarget.value) // 上屏后用最终值
          }}
          placeholder="用中文输入法打「苹果」"
          style={{ padding: 4, width: 220 }}
        />
      </p>
      <p style={{ margin: 0, fontSize: 13 }}>
        关键词：<code>{keyword || '（空）'}</code>　结果：
        <strong>{list.length}</strong> 个 {list.join('、')}
      </p>
    </div>
  )
}

function ImeDemo() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 2：⭐ 同一个搜索框，两种写法</h3>
      <p style={{ marginTop: 0 }}>
        在<strong>两个输入框里都用中文输入法打「苹果」</strong>，注意打拼音的过程中：
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        <NaiveSearch />
        <FixedSearch />
      </div>
      <p className="hint" style={{ marginBottom: 0 }}>
        👆 上面那个：<strong>每敲一个拼音字母，列表就清空/乱跳</strong>（因为 p、pi、pin 都不匹配任何水果）。
        <br />
        下面那个：<strong>拼音期间列表不动，上屏成「苹果」才过滤</strong>。
        <br />
        ⚠️ 更严重的版本：如果你在 <code>onChange</code> 里做"只允许数字"这类<strong>格式化</strong>，
        拼音字母会被立刻删掉 → <strong>输入法直接卡死，汉字打不出来</strong>。
      </p>
    </div>
  )
}

// ============================================================
// 三、更省事的写法（React 19 + 现代浏览器）
// ============================================================
function SimpleImeFix() {
  const [keyword, setKeyword] = useState('')
  const list = FRUITS.filter((f) => f.includes(keyword))

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>实验 3：一行版修复</h3>
      <p style={{ marginTop: 0 }}>
        如果你不想记 composition 两个事件，浏览器在 input 事件上给了 <code>isComposing</code>：
      </p>
      <pre
        style={{
          background: '#f6f8fa',
          padding: 10,
          borderRadius: 6,
          fontSize: 12.5,
          overflowX: 'auto',
          margin: '8px 0',
        }}
      >{`onChange={(e) => {
  setDraft(e.target.value)
  if (!(e.nativeEvent as InputEvent).isComposing) {
    setKeyword(e.target.value)      // 只在"不在组字"时更新关键词
  }
}}`}</pre>
      <p style={{ margin: '6px 0' }}>
        <input
          value={keyword}
          onChange={(e) => {
            const composing = (e.nativeEvent as InputEvent).isComposing === true
            if (!composing) setKeyword(e.target.value)
          }}
          placeholder="打「苹果」试试（这版没维护 draft，只演示判断）"
          style={{ padding: 4, width: 260 }}
        />
      </p>
      <p style={{ margin: 0, fontSize: 13 }}>
        关键词：<code>{keyword || '（空）'}</code>　结果：<strong>{list.length}</strong> 个
      </p>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>两版的取舍</strong>：composition 事件版兼容性最好（老浏览器也行）；
        <code>isComposing</code> 版更短，但需要浏览器支持。
        真实项目里通常用后者 + 一个成熟表单库（react-hook-form）兜底。
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function FormAndIme() {
  return (
    <div>
      <h2>1. 受控与非受控</h2>
      <ControlledDemo />

      <h2>2. ⭐ 中文输入法：每次 onChange 就处理是错的</h2>
      <ImeDemo />

      <h2>3. 一行版修复 + 取舍</h2>
      <SimpleImeFix />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>顺手带上：表单的 4 个小坑</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>坑</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>正确做法</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['提交后页面刷新', 'onSubmit 里 e.preventDefault()'],
              ['点 label 没反应', '<label htmlFor="phone"> + <input id="phone">'],
              ['每次输入就报错，很烦', '先"碰过"再校验（onBlur 之后才显示错误）'],
              ['回车不提交', '用真正的 <form> + <button type="submit">，别手写 onClick'],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>
                  <code>{b}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⏱ 10 分钟动手</h3>
        <p style={{ marginTop: 0 }}>
          打开 <code>src/day5/03-实战-搜索防抖.tsx</code>（你那个防抖搜索框），给它加上 IME 处理：
        </p>
        <ol style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9, fontSize: 14 }}>
          <li>
            加一个 <code>composing = useRef(false)</code>
          </li>
          <li>
            输入框上挂 <code>onCompositionStart</code> / <code>onCompositionEnd</code>
          </li>
          <li>
            在 <code>onChange</code> 里：<strong>组字期间不更新防抖的源头值</strong>
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>验证标准</strong>：用中文输入法打「苹果」时，
          <strong>打拼音的过程中不触发搜索请求</strong>（看控制台 / 结果列表），上屏后才搜一次。
          <br />
          注意它本来就有防抖（300ms），所以"闪"的问题不明显 —— 但请求次数会变少。
        </p>
      </div>
    </div>
  )
}
