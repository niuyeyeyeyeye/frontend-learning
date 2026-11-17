// ============================================================
// Day11-4：你的练习
// ============================================================
// 📖 本文件名字对照表
//   PracticeDay11  今天的练习页（/day11/practice）
//
// 今天的练习不是写 React，是**动配置**。做完你会发现自己已经能改工具链了。
// 三个练习都要动手改文件，页面上只是提示。

import { useState } from 'react'
import { Link } from 'react-router-dom'

// ============================================================
// 一块"会跟着 prettier 变化"的示例代码
// ============================================================
// 练习 1 做完（改成 jsxSingleQuote）之后，下面这段的**双引号属性**会被格式化成单引号。
// 你可以用 `npm run format:check` 前后对比这个文件的差异。
const MESSY_EXAMPLE = `const  a  =  {  x:1,  y:2 }
<button className="btn" onClick={() => go()}>点我</button>`

export default function PracticeDay11() {
  const [checked, setChecked] = useState<string[]>([])
  const toggle = (id: string) =>
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const tasks = [
    {
      id: 'p1',
      level: '⭐',
      title: '改 Prettier 配置，让 JSX 属性也用单引号',
      where: 'react-learning/.prettierrc',
      steps: [
        '在 .prettierrc 里加一行： "jsxSingleQuote": true',
        '运行 npm run format:check，看有多少文件从"合规"变成"不合规"',
        '运行 npx prettier --write src/day11 只格式化今天的文件',
        '再跑一次 format:check 确认它们变合规了',
      ],
      why: '体会"一个配置项影响全项目" + 学会用 --write 限定范围',
    },
    {
      id: 'p2',
      level: '⭐⭐',
      title: '新增一个环境变量 VITE_APP_TITLE 并真的用上',
      where: '.env.example、src/vite-env.d.ts、src/layouts/RootLayout.tsx',
      steps: [
        '在 .env.example 里加 VITE_APP_TITLE=React 学习',
        '复制一份：copy .env.example .env.local（这个文件不会进 git）',
        '在 src/vite-env.d.ts 里补 ImportMetaEnv 和 ImportMeta 声明',
        '在 RootLayout.tsx 里把写死的 "React 学习" 换成 {import.meta.env.VITE_APP_TITLE}',
        '重启 npm run dev（环境变量不重启不生效！），确认标题变了',
      ],
      why: '这是"配置驱动"的最基本形态；顺便踩一次"改 .env 要重启"的坑',
    },
    {
      id: 'p3',
      level: '⭐⭐⭐',
      title: '解释并验证 vercel.json 的 rewrites',
      where: 'react-learning/vercel.json（已建好）',
      steps: [
        '本地跑 npm run build && npm run preview',
        '在 preview 的地址后面手动输入 /day7/users/2 并**刷新**',
        '打开 dist 目录看看里面有没有 day7/users/2 这个文件（没有）',
        '回答：既然文件不存在，为什么页面还能显示？（答案在 03-构建与部署）',
        '把 vercel.json 里的 rewrites 删掉再 preview 一次，看会不会 404',
      ],
      why: 'SPA 部署的必考题；自己验证一次比看十遍文章强',
    },
  ]

  return (
    <div>
      <div className='card'>
        <h3 style={{ marginTop: 0 }}>三个练习（都要改文件，页面上没有 TODO）</h3>
        <p className='hint' style={{ marginTop: 0 }}>
          点标题可以进行勾选，进度会记在下面（不持久化，刷新就没了）。
        </p>

        {tasks.map((t) => (
          <div key={t.id} className='card' style={{ marginBottom: 10 }}>
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <input
                type='checkbox'
                checked={checked.includes(t.id)}
                onChange={() => toggle(t.id)}
                style={{ marginRight: 8 }}
              />
              <strong>
                {t.level} {t.title}
              </strong>
            </label>
            <p style={{ margin: '6px 0', color: '#57606a', fontSize: 13 }}>
              改这些文件：<code>{t.where}</code>
            </p>
            <ol style={{ margin: '0 0 6px', paddingLeft: 22, fontSize: 13, lineHeight: 1.9 }}>
              {t.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className='hint' style={{ marginBottom: 0 }}>
              为什么做这个：{t.why}
            </p>
          </div>
        ))}

        <p style={{ marginBottom: 0 }}>
          完成 {checked.length} / {tasks.length}
          {checked.length === tasks.length && (
            <strong style={{ color: '#1f883d' }}>　🎉 今天通了</strong>
          )}
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>练习 1 的对照参考</h3>
        <p style={{ marginTop: 0 }}>下面这段"脏代码"，跑 prettier 之后会变成什么样：</p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >
          {MESSY_EXAMPLE}
        </pre>
        <p className='hint' style={{ marginBottom: 0 }}>
          你不需要手改它 —— <code>npx prettier --write src/day11/04-练习.tsx</code> 会处理。
          这个常量只是为了让你有个"前后对比"的对象。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>做完之后该做的三件事</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <code>npm run check</code> → 0 错误
          </li>
          <li>
            <code>git add . && git commit -m "Day11: 工程化（prettier + env + 部署配置）"</code>
          </li>
          <li>
            记住这条链：<strong>check → build → preview → 推送 → Vercel 自动部署</strong>。
            这就是以后每次上线的动作。
          </li>
        </ol>
      </div>

      <p className='hint'>
        回 <Link to='/day11'>Day11 首页</Link>
      </p>
    </div>
  )
}

/* ============================================================
 * 参考答案 & 提示
 * ============================================================
 *
 * 练习 1：
 *   // .prettierrc 改成
 *   {
 *     "semi": false,
 *     "singleQuote": true,
 *     "jsxSingleQuote": true,     ← 新增这一行
 *     ...
 *   }
 *
 *   注意 singleQuote 管的是 JS 里的字符串，jsxSingleQuote 管的是 JSX 属性，
 *   两个是分开的配置项 —— 这是很多人漏掉的一点。
 *
 * 练习 2：
 *   // src/vite-env.d.ts
 *   /// <reference types="vite/client" />
 *
 *   interface ImportMetaEnv {
 *     readonly VITE_APP_TITLE: string
 *   }
 *   interface ImportMeta {
 *     readonly env: ImportMetaEnv
 *   }
 *
 *   // RootLayout.tsx
 *   const APP_TITLE = import.meta.env.VITE_APP_TITLE ?? 'React 学习'
 *   ...
 *   <NavLink to="/">{APP_TITLE}</NavLink>
 *
 *   ⚠️ 为什么加 ?? 'React 学习'：
 *      别人 clone 下来没建 .env.local 时，标题会变成 undefined。
 *      给个默认值，项目才能"零配置也能跑起来"——这是给别人用的项目的基本礼貌。
 *
 * 练习 3：
 *   // 答案：因为服务器配置了 rewrite
 *   //   请求 /day7/users/2 → 服务器找不到这个文件 → 按规则返回 index.html
 *   //   → 浏览器加载 index.html 里的 JS → React Router 读到地址是 /day7/users/2
 *   //   → 渲染 UserDetail 组件
 *
 *   // 删掉 rewrites 后：服务器真的去找 dist/day7/users/2 → 404
 *   //   （Vercel 上会显示平台的 404 页面，不是你的 NotFound 组件）
 *
 *   这个区别很重要：
 *     · 平台 404 = 服务器根本没把请求交给你
 *     · 你的 NotFound 组件 = 请求进来了，但路由表里没匹配上
 *   面试里能说清这个区别，说明你真的理解 SPA 部署。
 *
 * 【三个自问】
 * 1. 为什么 node_modules 不能提交，但 package-lock.json 必须提交？
 *    答：前者能装出来（几十 MB），后者是"装到哪些精确版本"的记录。
 *        没有 lock，不同时间装出来的版本可能不一样 → "我这儿是好的"。
 *
 * 2. 环境变量改了为什么必须重启？
 *    答：Vite 在启动时把 .env 读进内存，并做了静态替换（构建时 import.meta.env.X
 *        会变成字面量）。热更新只换模块，不会重读环境变量。
 *
 * 3. 为什么 build 脚本里要先跑 tsc --noEmit？
 *    答：Vite 打包时不做类型检查（它只负责转换和打包）。不先跑 tsc，
 *        类型错误会被打包进去，上线后才发现。
 * ============================================================ */
