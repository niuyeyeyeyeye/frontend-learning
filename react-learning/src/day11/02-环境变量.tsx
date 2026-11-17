// ============================================================
// Day11-2：环境变量（本地 / 测试 / 生产的差异，不要硬编码）
// ============================================================
// 📖 本文件名字对照表
//   EnvDemo        环境变量演示（本页 /day11/env）
//   import.meta    ES 模块的元信息对象（Vite 往里面塞了 env）
//   import.meta.env 环境变量对象（Vite 注入）
//   MODE           当前模式：development / production
//   DEV / PROD     布尔值：是不是开发/生产
//   BASE_URL       部署的基础路径（默认 '/'）
//   VITE_ 前缀      只有这个前缀的变量才会被打包进前端
//
// ⭐ 一句话：**环境变量是"同一份代码，在不同环境用不同的配置"。**
//   好处：你不用为了改一个接口地址去改代码、重新测一遍。

export default function EnvDemo() {
  // ⚠️ 这里加了 ?. 和 ??，是为了让这个文件在 Node 里也能跑（我的验证环境没有 Vite）
  //    真实项目里直接写 import.meta.env.MODE 就行
  const env = import.meta.env
  const mode = env?.MODE ?? '（Node 环境，无 Vite）'
  const isDev = env?.DEV
  const isProd = env?.PROD
  const base = env?.BASE_URL ?? '/'

  return (
    <div>
      <div className='card'>
        <h3 style={{ marginTop: 0 }}>你现在这个环境，变量长这样</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>变量</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>值</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>
                什么时候会变
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'import.meta.env.MODE',
                mode,
                'npm run dev → development；npm run build → production',
              ],
              ['import.meta.env.DEV', String(isDev), '开发时 true，构建后 false'],
              ['import.meta.env.PROD', String(isProd), '构建后 true'],
              ['import.meta.env.BASE_URL', base, '部署到子路径时会变（比如 /my-app/）'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{a}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <strong>{b}</strong>
                </td>
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
        <p className='hint'>
          👆 按 F12 执行 <code>import.meta.env.MODE</code> 看不到（浏览器的 import.meta 没这个）——
          要在代码里打日志才行。
        </p>
        <p className='hint' style={{ marginBottom: 0 }}>
          <strong>DEV / PROD 最实用的场景</strong>：要不要打印调试日志。
          <code>if (import.meta.env.DEV) console.log(...)</code> —— 构建时这段代码会被整段删掉，
          生产包里一个字都不留。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>⭐ 唯一必须记住的规则：VITE_ 前缀</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>.env 里写</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>
                前端能读到吗
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['VITE_API_BASE_URL=/api', '✅ 能'],
              ['VITE_APP_TITLE=React 学习', '✅ 能'],
              ['API_SECRET=sk-xxx', '❌ 读不到（故意的）'],
              ['DB_PASSWORD=123456', '❌ 读不到（故意的）'],
            ].map(([a, b]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{a}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: '8px 0 0' }}>
          <strong>为什么要有这个前缀？</strong> 因为 Vite 想把"前端变量"和"后端变量"隔开：
          <code>.env</code> 文件里可能既有前端配置，也有只给 Node 服务端看的密钥，
          加前缀相当于一个物理隔离。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0, color: '#cf222e' }}>⚠️ 最重要的一条：VITE_ 变量会打包进 JS</h3>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// ❌ 千万不能这样
// .env
VITE_API_SECRET=sk-live-abcdef123456

// 构建后 dist/assets/index-xxx.js 里能直接搜到 "sk-live-abcdef123456"
// 任何人打开 F12 → Sources 就能看到 → 你的密钥泄露了`}</pre>
        <p style={{ marginTop: 0 }}>
          <strong>记住这句话就够了：</strong>前端代码是<strong>发给用户的文件</strong>，
          不是"跑在服务器上"的代码。凡是写进前端的，用户都能拿到。
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>东西</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>能放前端吗</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['接口地址 /api', '✅ 能（本来就是公开的）'],
              ['地图 API Key（限域名的那种）', '✅ 能（配合域名白名单）'],
              ['数据库密码', '❌ 绝对不能'],
              ['支付/短信服务密钥', '❌ 绝对不能（要由后端签名）'],
              ['管理后台的固定 token', '❌ 不算绝对，但等于把钥匙贴在门上'],
            ].map(([a, b]) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>.env 文件的层级（谁覆盖谁）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>文件</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>提交 git？</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>用途</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['.env', '✅ 可以', '所有环境共用的变量'],
              [
                '.env.local',
                '❌ 不提交（已在 .gitignore）',
                '**你自己机器上的**覆盖值（比如本机后端地址）',
              ],
              ['.env.development', '✅', '只有 npm run dev 时生效'],
              ['.env.production', '✅', '只有 npm run build 时生效'],
              ['.env.example', '✅ **必须提交**', '模板，告诉同事"有哪些变量要填"'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{a}</code>
                </td>
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
        <p className='hint' style={{ marginBottom: 0 }}>
          优先级（高的覆盖低的）：<code>.env.local</code> ＞ 模式文件（<code>.env.production</code>
          ）＞ <code>.env</code>。
          <br />
          ⚠️{' '}
          <strong>
            改完 .env 必须重启 <code>npm run dev</code>
          </strong>{' '}
          —— 环境变量是在启动时读进去的，热更新不会重读。这个坑每个人都会踩一次。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>自定义变量还要补类型（否则 tsc 会报错）</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// src/vite-env.d.ts —— 补上声明，VITE_APP_TITLE 才有类型提示
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`}</pre>
        <p style={{ margin: 0 }}>
          不补会怎样？<code>import.meta.env.VITE_APP_TITLE</code> 报
          <code>TS2339: Property 'VITE_APP_TITLE' does not exist</code> —— 我在做这一页时真撞到了。
          <br />
          <strong>这就是"环境变量"和"类型系统"的交界处</strong>：Vite 在运行时注入值，TS
          在编译期需要声明。 少了这一块，团队里每个人都要猜"到底有哪些变量可用"。
        </p>
      </div>
    </div>
  )
}
