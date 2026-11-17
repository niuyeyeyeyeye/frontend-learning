// ============================================================
// Day11-3：构建与部署（从"我电脑能跑"到"别人能打开"）
// ============================================================
// 📖 本文件名字对照表
//   DeployDemo   构建与部署（本页 /day11/deploy）
//   npm run build  先 tsc 检查类型，再用 Vite 打包 → 产出 dist/
//   dist/          构建产物目录（只有 3 个东西：index.html、assets/*.js、assets/*.css）
//   hash           文件名里的指纹（index-a1b2c3.js），用于缓存
//   preview        本地起一个"生产模式"服务器，验证构建产物
//   rewrite        重写规则：所有路径都指向 index.html（SPA 必需）
//
// ⭐ 一句话：**开发时 Vite 用一堆小文件 + 热更新；上线时它把这些打包成几个文件。**

export default function DeployDemo() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>npm run build 做了两件事</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`"build": "tsc --noEmit && vite build"
            ↑ 先跑类型检查        ↑ 再打包

# && 的意思是：前面失败就停下。
# 所以类型有错时不会产出半个坏的 dist —— 这是故意的。`}</pre>
        <p style={{ marginTop: 0 }}>
          构建完 <code>dist/</code> 里大概是这样：
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`dist/
├── index.html                    ← 唯一的一个 HTML
└── assets/
    ├── index-C3xK9pQa.js         ← 你写的所有 TS/TSX 打成一个包
    ├── index-Df8Lm2Zx.css       ← 所有 CSS
    └── vendor-Bq7Yt4Wn.js       ← （可选）第三方库单独一个包`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>注意文件名里那串乱码</strong>（<code>C3xK9pQa</code>）：它是文件内容的哈希。
          内容一变，文件名就变 → 浏览器不会用旧缓存。这叫<strong>缓存失效</strong>
          ，是构建工具的核心价值之一。
          <br />
          <strong>这也意味着：index.html 不能被缓存</strong>（否则它还在请求旧的 JS
          文件名）。部署平台通常会自动处理。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>为什么必须有 npm run preview</h3>
        <p style={{ marginTop: 0 }}>
          <code>npm run dev</code> 跑的是<strong>开发模式</strong>：不打包、不压缩、带热更新、
          还有你在 Day10 发现的 StrictMode 双渲染。
        </p>
        <p>
          <code>npm run preview</code> 跑的是<strong>你刚构建出来的真实产物</strong>。两者差别很大：
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}></th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>npm run dev</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>
                npm run preview
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['代码', '原样加载每个文件', '打包 + 压缩 + 混淆'],
              ['StrictMode 双渲染', '✅ 有', '❌ 没有'],
              ['性能数字能不能信', '❌ 不能', '✅ 能（最接近线上）'],
              ['环境变量 MODE', 'development', 'production'],
              ['路由懒加载', 'chunk 不拆', '**真的拆成多个文件**'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  {b}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>所以 Day10 那句"性能要 build 之后再看"，指的就是 preview 这个阶段。</strong>
          <br />
          ⚠️ 诚实说明：
          <strong>
            我这边没法跑 <code>vite build</code>
          </strong>
          （沙箱里报
          <code>spawn EPERM</code>，不是你的机器问题）。这一步必须你自己在本地跑，
          跑通了再往下部署。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, color: '#cf222e' }}>⭐ 上线后第一个坑：刷新页面 404</h3>
        <p style={{ marginTop: 0 }}>
          你 Day7 做的路由，<code>/day7/users/2</code> 这些地址在浏览器里跳转没问题
          （客户端路由）。但如果你<strong>直接刷新</strong>这个地址，或者把它发给别人打开：
        </p>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`浏览器请求  https://your-app.vercel.app/day7/users/2
服务器找文件 dist/day7/users/2   ← 不存在！只有 index.html
→ 404`}</pre>
        <p style={{ marginTop: 0 }}>
          <strong>解决：让服务器把所有路径都返回 index.html</strong>，剩下的交给前端路由。
          我在项目根目录建了 <code>vercel.json</code>，就是这个作用：
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          这个配置在不同平台的写法不同，但概念一样：
          <strong>
            Nginx 叫<code>try_files $uri /index.html</code>
          </strong>
          ，Vercel 叫 rewrites，Netlify 叫 redirects。
          <br />
          <strong>面试常问</strong>："SPA 部署后刷新 404 怎么办？" —— 答案就是这个。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>部署到 Vercel（3 步，都不花钱）</h3>
        <p style={{ marginTop: 0 }}>
          <strong>第一步：先本地验证</strong>（必须做，否则线上出错更难查）
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 10,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '4px 0 12px',
          }}
        >{`npm run build      # 类型检查 + 打包，要看到 "built in xxx ms"
npm run preview    # 打开它给的地址（通常 http://localhost:4173）
                   # ⭐ 在 preview 里把 /day7/users/2 直接刷新一次，看会不会 404`}</pre>

        <p style={{ marginTop: 0 }}>
          <strong>第二步：把代码推到 GitHub</strong>
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 10,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '4px 0 12px',
          }}
        >{`git add .
git commit -m "feat: React 阶段项目"
# 在 GitHub 上新建一个空仓库，然后：
git remote add origin https://github.com/<你的用户名>/react-learning.git
git branch -M main
git push -u origin main`}</pre>

        <p style={{ marginTop: 0 }}>
          <strong>第三步：Vercel 导入</strong>
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            打开 <strong>vercel.com</strong>，用 GitHub 账号登录
          </li>
          <li>
            点 <strong>Add New → Project</strong> → 选中你刚推上去的仓库 → <strong>Import</strong>
          </li>
          <li>
            <strong>Root Directory</strong> 选 <code>react-learning</code>
            （你的项目在子目录里，这一步最容易被漏掉，漏了就会构建失败）
          </li>
          <li>Framework 会自动识别成 Vite，不用改 → 点 Deploy</li>
          <li>
            等 1~2 分钟 → 拿到 <code>https://xxx.vercel.app</code> 这样的链接
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>这个链接就是你简历上的"线上项目"</strong>。以后再 push 代码，Vercel 会自动重新部署
          —— 这就是 CI/CD 的最小形态。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>部署完之后，自查这 5 条</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>#</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>检查什么</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>为什么</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', '首页能打开', '最基本的'],
              ['2', '直接访问 /day7/users/2 再刷新', '**测 rewrite 有没有生效**'],
              ['3', 'F12 → Network 看资源 404 没有', '路径大小写、public 资源漏传'],
              ['4', 'F12 → Console 没有红字', '环境变量缺失、接口地址不对'],
              ['5', '手机上打开一次', '响应式、字体大小、点击区域'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  {c}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
