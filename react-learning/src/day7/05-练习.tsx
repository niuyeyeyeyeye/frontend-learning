// ============================================================
// Day7-5：你的练习
// ============================================================
// 📖 本文件名字对照表
//   PracticeDay7   今天的练习页（/day7/practice）
//   ARTICLES       文章数据（练习用的假数据，不用改）
//   ArticleList    文章列表页（练习 2）
//   ArticleDetail  文章详情页（练习 2、3）
//   useParams      取 :id
//   useSearchParams 读写 ?q=
//   useNavigate    代码跳转
//
// 规则：补完 TODO → 保存 → 浏览器看效果
// 每个练习 20~25 分钟，超时看文件底部参考答案，隔一晚闭卷重写

import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

// 练习用数据：不要改
export const ARTICLES = [
  { id: 1, title: '为什么 React 要"数据往下、事件往上"', tag: 'react', body: '单向数据流让 bug 好查……' },
  { id: 2, title: 'Context 不是状态管理', tag: 'react', body: '它只是传值管道……' },
  { id: 3, title: '防抖和节流到底差在哪', tag: 'js', body: '防抖是等停手，节流是限频率……' },
  { id: 4, title: '快慢指针为什么能找到环入口', tag: 'algorithm', body: 'a = (n-1)L + (L-b) ……' },
  { id: 5, title: 'SPA 为什么需要路由', tag: 'react', body: '一个 index.html 服务所有地址……' },
  { id: 6, title: '把状态放进 URL 的三个好处', tag: 'react', body: '刷新不丢、能分享、能后退……' },
]

// ============================================================
// 练习 1 ⭐：加一个"关于"页面（全流程：文件 + 路由 + 导航）
// ============================================================
// 已经做好一半：src/pages/About.tsx 建好了，路由 /about 也配好了（去 router.tsx 看）。
// 你要做两件事：
//   TODO 1-a：打开 src/pages/About.tsx，把内容换成你自己的介绍
//   TODO 1-b：打开 src/layouts/RootLayout.tsx，在 NAV_ITEMS 里加一条
//             { to: '/about', label: '关于', end: false }
//             → 加完顶部导航就多一项，而且会自动高亮
// ============================================================

// ============================================================
// 练习 2 ⭐⭐：文章列表 → 详情（动态路由）
// ============================================================
// 路由已配好：
//   /day7/articles         → ArticleList
//   /day7/articles/:id     → ArticleDetail
//
// 要求：
//   a) ArticleList：把 ARTICLES 渲染成列表，每条是 <Link to={`/day7/articles/${a.id}`}>
//   b) ArticleDetail：
//      - 用 useParams() 取 id（字符串！）
//      - 找到对应文章就显示标题和正文
//      - 找不到（比如 /day7/articles/999）就显示"文章不存在" + 回列表的按钮
//      - 加一个"← 返回"按钮，用 navigate(-1)（不是 Link，体会一下区别）
// ============================================================

export function ArticleList() {
  // TODO 2-a：把 ARTICLES 渲染成链接列表

  const [searchParams,setSearchParams]=useSearchParams()

  const keyDown = searchParams.get('q')??''

  const [input,setInput]=useState(keyDown)
  const page = Math.max(1,Number(searchParams.get('page'))||1)

  const filtered = ARTICLES.filter((n)=>n.title.toLowerCase().includes(input.trim().toLowerCase()))
  const totalPage=Math.max(1,Math.ceil(filtered.length/3))
  const safePage=Math.min(page,totalPage)
  const pageItems=filtered.slice((safePage-1)*3,safePage*3)

  const keyDownChange =(next:string)=>{
    setInput(next)
    const p=new URLSearchParams(searchParams)
    if(next.trim()===''){
      p.delete('q')
    }else{
      p.set('q',next.trim())
    }
    p.delete('page')
    setSearchParams(p,{replace:true})
  }

  const nextPage=(next:number)=>{
    const p=new URLSearchParams(searchParams)
    if(next<=1){
      p.delete('page')
    }else{
      p.set('page',String(next))
    }
    setSearchParams(p)
  }

  return (
    <div>
      <h2>文章列表</h2>
      <input
      placeholder='搜索'
      value={input}
      onChange={(e)=>keyDownChange(e.target.value)}
      ></input>
      <div className="card">
        <p className="hint" style={{ marginTop: 0 }}>
          TODO 2-a：还没写。目标是 6 条链接，点进 /day7/articles/:id。
        </p>
        {pageItems.map((item)=>(
          <div key={item.id}>
            <Link to={`/day7/articles/${item.id}`}>{item.title}</Link>
            <span>{item.tag}</span>
          </div>
          ))}
          <button
          onClick={()=>nextPage(safePage-1)}
          disabled={safePage<=1}
          >上一页</button>
          <span>第{safePage}页/共{totalPage}页</span>
          <button
          onClick={()=>nextPage(safePage+1)}
          disabled={safePage>=totalPage}
          >
            下一页
            </button>
      </div>
    </div>
  )
}

export function ArticleDetail() {
  const navigate = useNavigate()
  // TODO 2-b：用 useParams 取 id，找到文章，处理"找不到"
  const params = useParams()
  const titleId =params.id


  const index=ARTICLES.findIndex((n)=>String(n.id)===titleId)
  const prev=ARTICLES[index-1]
  const cur=ARTICLES[index]
  const next=ARTICLES[index+1]

  if(cur===undefined){
    return (<div>
      <p>文章不存在</p>
      <div><button
      onClick={()=>navigate(-1)}
      >
        返回</button></div>
        </div>
        )
      }
  return (
    <div>
      <h2>{cur.title}</h2>
      <div className="card">
        <p className="hint" style={{ marginTop: 0 }}>
          TODO 2-b：还没写。现在地址里的 id 是 <code>{String(params.id)}</code>。
          <br />
          {cur.body}
        </p>
        {prev&&<Link to={`/day7/articles/${prev.id}`}>上一篇</Link>}
        <span>第{index+1}篇/共{ARTICLES.length}篇</span>
        {next&&<Link to={`/day7/articles/${next.id}`}>下一篇</Link>}

        <div>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          ← 返回（navigate(-1)）
        </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// 练习 3 ⭐⭐⭐（挑战）：把搜索词放进 URL + 上一篇/下一篇
// ============================================================
// 这一题把今天学的两件事合起来用。
//
// 要求：
//   a) ArticleList 顶部加一个搜索框，关键词放进 URL 的 ?q=
//      （地址应该是 /day7/articles?q=react，刷新后还能过滤）
//      ⚠️ 注意：这个列表页在 /day7/articles，而它的路由是独立的一条，
//         `?q=` 是加在这条地址上的，不影响 :id 那条。
//   b) ArticleDetail 底部加"← 上一篇 / 下一篇 →"，
//      用当前 id ±1 找到相邻文章，用 <Link> 跳过去；
//      第一篇不显示"上一篇"，最后一篇不显示"下一篇"。
//   c) 显示"第 3 / 6 篇"，让用户知道自己在哪里。
// ============================================================

function SearchHint() {
  // 这个组件只是提示，你可以在 ArticleList 里参考
  const [searchParams] = useSearchParams()
  const [typed, setTyped] = useState('')
  void setTyped
  return (
  <div>
    <p className="hint">
      练习 3 目标：让地址变成 <code>/day7/articles?q={typed || 'react'}</code>；
      当前 URL 的 q = <code>{searchParams.get('q') ?? '（空）'}</code>
    </p>
  </div>
  )
}

// ============================================================
// 展示区（不用改）
// ============================================================
export default function PracticeDay7() {
  return (
    <div>
      <SearchHint />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>三个练习</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>#</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>做什么</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>难度</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>改哪个文件</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', '加一个"关于"页面（内容 + 导航）', '⭐', 'pages/About.tsx、layouts/RootLayout.tsx'],
              ['2', '文章列表 → 详情（useParams + 找不到处理）', '⭐⭐', '本文件 ArticleList / ArticleDetail'],
              ['3', '搜索词进 URL + 上一篇/下一篇', '⭐⭐⭐', '本文件'],
            ].map(([no, what, level, file]) => (
              <tr key={no}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{no}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{what}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{level}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>
                  <code>{file}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginBottom: 0 }}>
          做完练习 2 就能去这里看：<Link to="/day7/articles">/day7/articles</Link>
          {'　'}
          <Link to="/day7/articles/2">/day7/articles/2</Link>
          {'　'}
          <Link to="/day7/articles/999">/day7/articles/999（应该显示"不存在"）</Link>
        </p>
      </div>
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：不用看答案，直接改两个文件。
 *   其中 RootLayout.tsx 的 NAV_ITEMS 改成：
 *     { to: '/', label: '首页', end: true },
 *     { to: '/about', label: '关于', end: false },      ← 新加的
 *     { to: '/day7', label: 'Day7 路由', end: false },
 *     { to: '/archive', label: 'Day1~6 归档', end: false },
 *
 * 练习 2：
 *   export function ArticleList() {
 *     return (
 *       <div>
 *         <h2>文章列表</h2>
 *         <div className="card">
 *           {ARTICLES.map((a) => (
 *             <div key={a.id} style={{ padding: '6px 0', borderBottom: '1px solid #f6f8fa' }}>
 *               <Link to={`/day7/articles/${a.id}`}>{a.title}</Link>
 *               <span className="tag" style={{ marginLeft: 8 }}>{a.tag}</span>
 *             </div>
 *           ))}
 *         </div>
 *       </div>
 *     )
 *   }
 *
 *   export function ArticleDetail() {
 *     const { id } = useParams()
 *     const navigate = useNavigate()
 *     const article = ARTICLES.find((a) => String(a.id) === id)
 *
 *     if (!article) {
 *       return (
 *         <div className="card">
 *           <p>文章不存在（id = {String(id)}）</p>
 *           <button className="btn" onClick={() => navigate('/day7/articles')}>回列表</button>
 *         </div>
 *       )
 *     }
 *
 *     return (
 *       <div>
 *         <h2>{article.title}</h2>
 *         <div className="card">
 *           <p>{article.body}</p>
 *           <button className="btn-ghost" onClick={() => navigate(-1)}>← 返回</button>
 *         </div>
 *       </div>
 *     )
 *   }
 *
 * 练习 3：
 *   // a) 列表页加搜索（关键词进 URL）
 *   export function ArticleList() {
 *     const [searchParams, setSearchParams] = useSearchParams()
 *     const q = searchParams.get('q') ?? ''
 *     const list = ARTICLES.filter(
 *       (a) => a.title.includes(q) || a.tag.includes(q),
 *     )
 *     return (
 *       <div>
 *         <h2>文章列表</h2>
 *         <input
 *           value={q}
 *           onChange={(e) => {
 *             const p = new URLSearchParams(searchParams)
 *             if (e.target.value) p.set('q', e.target.value)
 *             else p.delete('q')
 *             setSearchParams(p, { replace: true })   // 打字用 replace！
 *           }}
 *           placeholder="搜标题或标签（试试 react / js）"
 *         />
 *         {list.map((a) => (
 *           <div key={a.id}>
 *             <Link to={`/day7/articles/${a.id}`}>{a.title}</Link>
 *           </div>
 *         ))}
 *       </div>
 *     )
 *   }
 *
 *   // b) 详情页加上一篇/下一篇
 *   const index = ARTICLES.findIndex((a) => a.id === article.id)
 *   const prev = ARTICLES[index - 1]
 *   const next = ARTICLES[index + 1]
 *   ...
 *   {prev && <Link to={`/day7/articles/${prev.id}`}>← {prev.title}</Link>}
 *   <span>第 {index + 1} / {ARTICLES.length} 篇</span>
 *   {next && <Link to={`/day7/articles/${next.id}`}>{next.title} →</Link>}
 *
 *   ⚠️ 注意练习 3-a 的一个坑：
 *      input 的 value 直接绑 searchParams.get('q') 会导致"中文输入法打字时
 *      光标乱跳/丢字"（因为 setSearchParams 是异步的）。
 *      所以真实项目里要像 day7/03 那个例子一样：input 用本地 state，再同步进 URL。
 *      你练习时先用简单版跑通，再去 03 那个文件看"正确版"。
 *
 * 【三个自问】
 * 1. 详情页为什么用 navigate(-1) 而不是 Link 回列表？
 *    答：navigate(-1) 回的是"用户来的那一页"，可能是列表、可能是搜索结果的第 2 页；
 *       Link 只能回死地址。用户从哪儿来回哪儿去，体验才对。
 *
 * 2. 为什么 /day7/articles/999 要单独处理？
 *    答：地址是用户能随便改的。不处理就是白屏 / 报错，处理了才是正常产品。
 *
 * 3. 搜索结果为什么放 URL 而不是 useState？
 *    答：刷新不丢、能分享给别人、能后退。放 useState 就只能自己一个人在当前页面用。
 * ============================================================ */
