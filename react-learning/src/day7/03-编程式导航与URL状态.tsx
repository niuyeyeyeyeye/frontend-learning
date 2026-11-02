// ============================================================
// Day7-3：编程式导航 + 把状态放进 URL
// ============================================================
// 📖 本文件名字对照表
//   NavigateDemo    编程式导航演示（本页）
//   useNavigate     拿到 navigate 函数 → 用代码跳转
//   navigate(to)    跳到某个地址
//   navigate(-1)    后退一步（-2 后退两步；1 前进一步）
//   replace: true   替换当前历史记录（不留"上一步"）
//   useSearchParams 读写地址里 ? 后面的查询参数，用法像 useState
//   searchParams    URLSearchParams 对象（.get('q')）
//   setSearchParams 改查询参数（会自动跳转，不刷新）
//
// ⭐ 核心认知：**能用 URL 表达的状态，就不要藏在 useState 里。**
//    搜索词、页码、筛选条件、Tab —— 全放 URL：
//    刷新不丢、能分享、能后退、能用 <Link> 直达。

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

// ============================================================
// 一、useNavigate 的三种用法
// ============================================================
function NavigateIntroCard() {
  const navigate = useNavigate()

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>三种最常见的用法：</p>

      <p style={{ marginBottom: 6 }}>
        <strong>① 跳固定地址</strong>（提交成功后跳列表）：
      </p>
      <button className="btn" style={{ marginBottom: 12 }} onClick={() => navigate('/day7/users')}>
        navigate('/day7/users')
      </button>

      <p style={{ marginBottom: 6 }}>
        <strong>② 后退 / 前进</strong>（"返回"按钮，比 Link 更自然）：
      </p>
      <button className="btn-ghost" style={{ marginRight: 8 }} onClick={() => navigate(-1)}>
        navigate(-1) 后退
      </button>
      <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => navigate(1)}>
        navigate(1) 前进
      </button>

      <p style={{ marginBottom: 6 }}>
        <strong>③ replace：替换历史记录</strong>（登录后跳首页，用户按"后退"不该回到登录页）：
      </p>
      <button
        className="btn-ghost"
        onClick={() => navigate('/day7/basics', { replace: true })}
      >
        navigate('/day7/basics', {'{ replace: true }'})
      </button>

      <p className="hint">
        验证 replace：点上面那个按钮 → 到路由基础页 → 按<strong>浏览器后退</strong>。
        你会发现"回不到刚才这一页"（因为这一页被替换掉了）。这就是 replace 的用途。
      </p>
    </div>
  )
}

// ============================================================
// 二、把搜索词和页码放进 URL（真实项目里天天用）
// ============================================================
const ALL_ITEMS = Array.from({ length: 23 }, (_, i) => `条目 ${i + 1}`)
const PAGE_SIZE = 5

function UrlStateDemo() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ⭐ 读：全部从 URL 来（刷新页面也还在）
  const keyword = searchParams.get('q') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)

  // 输入框需要一个"即时"的值，否则打字会有延迟；提交/输入时再同步进 URL
  const [input, setInput] = useState(keyword)

  const filtered = ALL_ITEMS.filter((it) => it.includes(keyword.trim()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // ⭐ 写：setSearchParams 会改地址栏，同时触发重新渲染（不会刷新页面）
  const onKeywordChange = (next: string) => {
    setInput(next)
    const p = new URLSearchParams(searchParams)
    if (next.trim() === '') {
      p.delete('q')
    } else {
      p.set('q', next)
    }
    p.delete('page') // 搜索条件变了，页码回到第 1 页
    // 💡 用 replace：不然每敲一个字都会往历史记录里塞一条，用户按后退要按 10 次
    setSearchParams(p, { replace: true })
  }

  const goPage = (next: number) => {
    const p = new URLSearchParams(searchParams)
    if (next <= 1) {
      p.delete('page')
    } else {
      p.set('page', String(next))
    }
    // 💡 翻页用 push（不加 replace）：用户按后退能回到上一页，符合直觉
    setSearchParams(p)
  }

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        搜索框 + 分页，<strong>状态全在 URL 里</strong>。地址现在是：{' '}
        <code>
          /day7/navigate{keyword ? `?q=${keyword}` : ''}
          {safePage > 1 ? `${keyword ? '&' : '?'}page=${safePage}` : ''}
        </code>
      </p>

      <input
        value={input}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="输入「1」「2」试试（只有 23 条数据）"
        style={{ padding: 6, width: 240, marginBottom: 8 }}
      />

      <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
        {pageItems.length === 0 && <li style={{ color: '#8b949e' }}>（没有匹配的条目）</li>}
        {pageItems.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn-ghost" disabled={safePage <= 1} onClick={() => goPage(safePage - 1)}>
          ← 上一页
        </button>
        <span style={{ fontSize: 13, color: '#57606a' }}>
          第 {safePage} / {totalPages} 页（共 {filtered.length} 条）
        </span>
        <button
          className="btn-ghost"
          disabled={safePage >= totalPages}
          onClick={() => goPage(safePage + 1)}
        >
          下一页 →
        </button>
      </div>

      <p className="hint">
        👆 <strong>验证三件事</strong>：① 搜索 + 翻页后按 F5 刷新，条件还在；
        ② 把地址复制到新标签页打开，条件还在；③ 按浏览器后退，能回到上一页（因为翻页用的是 push）。
      </p>

      <p className="hint">
        ⚠️ 注意 <code>setSearchParams(p, {'{ replace: true }'})</code> 和{' '}
        <code>setSearchParams(p)</code> 的区别：<strong>打字用 replace，翻页用 push</strong>。
        这个细节没人教你，但你一上手就会发现不加 replace 的历史记录有多恶心。
      </p>
    </div>
  )
}

// ============================================================
// 三、什么时候用 navigate，什么时候用 Link？
// ============================================================
function WhenToUseWhat() {
  return (
    <div className="card">
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#57606a' }}>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>场景</th>
            <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>用哪个</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['导航栏 / 列表里的链接', '<Link> 或 <NavLink>'],
            ['提交表单成功后跳转', 'useNavigate（事件里跳）'],
            ['"返回上一页"按钮', 'navigate(-1)'],
            ['登录成功后跳首页（不想留登录页）', "navigate('/', { replace: true })"],
            ['搜索词 / 页码 / 筛选条件', 'useSearchParams'],
            ['需要用户能右键"在新标签页打开"', '只能用 <Link>（navigate 不行）'],
          ].map(([a, b]) => (
            <tr key={a}>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
              <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                <code>{b}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">
        最后一条是个很实际的判断标准：<strong>链接用 Link（可右键新开），动作/流程用 navigate。</strong>
      </p>
    </div>
  )
}

export default function NavigateDemo() {
  return (
    <div>
      <h2>1. useNavigate 的三种用法</h2>
      <NavigateIntroCard />

      <h2>2. 把状态放进 URL（搜索 + 分页）</h2>
      <UrlStateDemo />

      <h2>3. Link 还是 navigate？</h2>
      <WhenToUseWhat />

      <p className="hint">
        想回到列表看动态路由：<Link to="/day7/users">点这里</Link>
      </p>
    </div>
  )
}
