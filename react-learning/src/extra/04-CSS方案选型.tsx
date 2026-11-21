// ============================================================
// 补课-4：CSS 方案选型（这是一个"决策"，不是"学知识"）
// ============================================================
// 📖 名字对照
//   CSS Modules     *.module.css → 类名自动加哈希，局部作用域，零配置
//   Tailwind       原子类，写在 className 里（如 text-sm px-4 rounded）
//   CSS-in-JS      styled-components / emotion，用 JS 写样式（本项目不推荐）
//   内联 style      你现在到处在用的方式（style={{ ... }}）
//
// ⭐ 今天就干一件事：**在两个方案里选一个，写进笔记，项目开工就按它来。**
//   不选，你就会一直写内联 style —— 项目写到第三天style 对象会互相覆盖，改不动。

import { useState } from 'react'
import styles from './styles/decision.module.css'

// ============================================================
// 一、你现在用的：内联 style（能跑，但会失控）
// ============================================================
function InlineStyleDemo() {
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{
        border: '1px solid #d0d7de',
        borderRadius: 8,
        padding: 12,
        background: '#fff',
        marginBottom: 10,
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 600, color: '#cf222e', margin: '0 0 6px' }}>
        内联 style（你现在到处在用的方式）
      </p>
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: hover?'#f6f8fa':'#cf222e',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '6px 14px',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        按钮
      </button>
      <p style={{ color: '#8b949e', fontSize: 12, margin: '6px 0 0' }}>
        上面那个"悬停变色"要用 useState 才能实现（因为 :hover 写不进 style）——
        这就是内联 style 的第一个硬伤。
      </p>
    </div>
  )
}

// ============================================================
// 二、CSS Modules（推荐你用这个）
// ============================================================
function CssModuleDemo() {
  return (
    <div className={styles.card}>
      <p className={styles.title}>✅ CSS Modules（推荐）</p>
      <button className={styles.btn}>按钮</button>
      <p className={styles.hint}>
        悬停变色只靠 CSS <code>:hover</code>，不需要任何 useState。
        <br />
        这个卡片的类名编译后是：<code>{styles.title}</code>
        <br />
        （带哈希 → 你在别的文件里再写一个 <code>.title</code> 也不会冲突）
      </p>
    </div>
  )
}

// ============================================================
// 三、Tailwind（这里没装，只给代码感受）
// ============================================================
function TailwindCodeOnly() {
  return (
    <div className="card" style={{ borderColor: '#bf8700' }}>
      <strong style={{ color: '#9a6700' }}>⚠️ Tailwind（本项目没装，只看代码）</strong>
      <pre
        style={{
          background: '#f6f8fa',
          padding: 10,
          borderRadius: 6,
          fontSize: 12.5,
          overflowX: 'auto',
          margin: '8px 0',
        }}
      >{`// Tailwind 的写法：样式全在 className 里
<div className="rounded-lg border border-gray-300 bg-white p-3 mb-2">
  <p className="text-[15px] font-semibold text-blue-600 mb-1.5">标题</p>
  <button className="bg-blue-600 text-white rounded-md px-3.5 py-1.5
                     hover:bg-blue-700 text-sm">按钮</button>
</div>

// 需要：npm i -D tailwindcss @tailwindcss/vite
//      然后在 vite.config.ts 里加插件 + 在 css 里 @import "tailwindcss";`}</pre>
      <p className="hint" style={{ marginBottom: 0 }}>
        <strong>优点</strong>：不用起名字、不用切文件、体积小（只打包用到的类）。
        <strong>缺点</strong>：JSX 变长（一行 8 个类）、要背类名、复制第三方代码时风格不统一。
      </p>
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function CssStrategy() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>为什么必须现在定</h3>
        <p style={{ marginTop: 0 }}>
          你的项目现在<strong>只有 `index.css` + 满地内联 style</strong>。这会带来三个具体问题：
        </p>
        <ol style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>`:hover` / `:focus` / 媒体查询 / 动画都写不了</strong>（内联 style 只支持静态属性，
            要交互就得加 `useState`，代码量翻倍）
          </li>
          <li>
            <strong>同一个按钮在 5 个页面各写一遍 style 对象</strong>，改个颜色要改 5 处
          </li>
          <li>
            <strong>项目写到第三天就改不动了</strong>（style 对象一层套一层，谁覆盖谁说不清）
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          CSS 方案不定，<strong>做项目时每天都会为这件事纠结</strong>。所以今天花 25 分钟定掉。
        </p>
      </div>

      <h2>1. 三种写法，同一个卡片</h2>
      <InlineStyleDemo />
      <CssModuleDemo />
      <TailwindCodeOnly />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>2. 决策表（照这个选，别纠结）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>维度</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>CSS Modules</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Tailwind</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>CSS-in-JS</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['配置成本', '✅ 零配置（Vite/Next 原生）', '要装插件 + 配 1 次', '要装库 + 配 Babel/插件'],
              ['要不要起类名', '要（但可以很少）', '不用', '不用'],
              ['JSX 可读性', '✅ 干净（className={styles.x}）', '❌ 一行 8 个类', '中'],
              [':hover / 媒体查询 / 动画', '✅ 全支持', '✅ 全支持', '✅ 全支持'],
              ['复用（改一处全站生效）', '✅ 改 css 一处', '⚠️ 要抽组件或 @apply', '⚠️ 要抽组件'],
              ['首屏 CSS 体积', '小', '✅ 只打包用到的', '运行时注入，略大'],
              ['Next App Router（RSC）兼容', '✅ 原生支持', '✅ 原生支持', '❌ 要额外配置/不推荐'],
              ['招聘要求里常见度', '中', '✅ **高（2026 年很多团队在用）**', '低（在退潮）'],
              ['学习成本', '✅ 你第一周学的 CSS 直接用', '要记类名体系', '要学库 API'],
            ].map(([a, b, c, d]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', whiteSpace: 'nowrap' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ borderColor: '#1f883d' }}>
        <h3 style={{ marginTop: 0, color: '#1f883d' }}>3. ⭐ 我的建议：CSS Modules</h3>
        <p style={{ marginTop: 0 }}>三个理由，都跟你的具体情况有关：</p>
        <ol style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>你已经会写 CSS 了</strong>（第一周的 Flexbox/Grid/响应式没白学）——
            CSS Modules 就是普通 CSS，只是类名加了哈希，**零学习成本**
          </li>
          <li>
            <strong>和 Next App Router 完全兼容</strong>。而 CSS-in-JS（styled-components）在
            RSC 里需要额外配置，是这个方案最大的硬伤
          </li>
          <li>
            <strong>项目周期只有 4 周</strong>，Tailwind 要花 1~2 天建立"类名肌肉记忆"，
            这段时间你更该花在功能上
          </li>
        </ol>
        <p style={{ marginBottom: 0 }}>
          <strong>但有一个例外情况值得反向选择</strong>：如果你查到的目标公司（或你想投的岗位）
          JD 里明确写了 Tailwind，那就选 Tailwind —— 因为**简历上"会用 Tailwind"是可以加分的**。
          Tailwind 上手 1~2 天就够，晚点补也不亏。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>4. 顺带：Vite 的两句话（八股 + 实用）</h3>
        <p style={{ marginTop: 0 }}>
          <strong>① 为什么 Vite 比 Webpack 快？</strong>
        </p>
        <p style={{ margin: '0 0 8px', fontSize: 14 }}>
          开发时它<strong>不打包</strong>：浏览器原生 ESM 请求哪个文件就编译哪个，依赖用 Go 写的
          esbuild 预构建。<strong>但生产环境它照样用 Rollup 打包</strong> —— 因为几百个 ESM 请求反而慢。
        </p>
        <p style={{ marginTop: 0 }}>
          <strong>② 开发时怎么解决跨域（CORS）？</strong>
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
        >{`// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',   // 你的后端
        changeOrigin: true,                // 改掉 Host 头，避免后端校验失败
        // rewrite: (p) => p.replace(/^\\/api/, ''),  // 后端没有 /api 前缀时用
      },
    },
  },
})`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          前端请求 <code>/api/posts</code> → Vite 帮你转发到 <code>http://localhost:8080/api/posts</code>，
          浏览器只看到同源请求 → <strong>不触发 CORS</strong>。
          <br />
          （但走 Next 全栈就不需要了，因为 API 和页面在同一个域名下。）
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⏱ 10 分钟动手（这节的产出就是这个决定）</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>选一个</strong>：CSS Modules / Tailwind（选完就别再改）
          </li>
          <li>
            把它写进 <code>笔记/React.md</code>，写清"<strong>为什么选它 + 什么时候会后悔</strong>"
            （面试问"你的项目怎么组织样式"，这就是答案）
          </li>
          <li>
            <strong>动手验一次</strong>：把 <code>src/pages/Home.tsx</code> 里的一张卡片改成
            CSS Module 写法（新建 <code>Home.module.css</code>），确认类名生效
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>验证标准</strong>：F12 → Elements 里看到 <code>class="_card_xxxxx"</code> 这种带哈希的名字，
          说明 Module 生效了。（本页那个绿色卡片就是这么来的，你可以直接用它当模板。）
        </p>
      </div>
    </div>
  )
}
