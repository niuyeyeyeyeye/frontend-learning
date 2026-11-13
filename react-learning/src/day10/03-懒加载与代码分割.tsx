// ============================================================
// Day10-3：懒加载与代码分割（唯一能改善"首屏慢"的手段）
// ============================================================
// 📖 本文件名字对照表
//   LazyDemo        懒加载演示（本页 /day10/lazy）
//   lazy            把一个组件变成"用到时才加载"
//   Suspense        加载中显示什么（fallback）
//   import()        动态导入（浏览器会单独请求这个文件）
//
// ⭐ 前面几节优化的都是"渲染"，这一节优化的是"下载"：
//   首屏只加载当前页面需要的那几个文件，其他的等用到再拉。
//   **这是唯一能改善"首屏加载慢"的手段** —— memo/useMemo 对此毫无作用。

import { lazy, Suspense, useState } from 'react'

// ⭐ 关键：lazy 接收一个"返回 import() 的函数"
//   这里人为加了 1.2 秒延迟，只为了让你看清 fallback；
//   真实项目里延迟来自网络（几百 KB 的库要下载）。
const LazyHeavy = lazy(async () => {
  await new Promise((r) => setTimeout(r, 1200))
  const mod = await import('./LazyHeavy')
  return { default: mod.default }
})

export default function LazyDemo() {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>实验：点按钮，看"加载中"和"加载完成"</h3>
        <p style={{ marginTop: 0 }}>
          <button className="btn" onClick={() => setShow((s) => !s)}>
            {show ? '卸载它' : '加载那个重组件'}
          </button>
        </p>

        {/* ⭐ Suspense 必须有：lazy 组件还没加载完时，它的位置放 fallback */}
        <Suspense
          fallback={
            <div className="card" style={{ color: '#8b949e' }}>
              ⏳ 正在加载组件文件……（这就是 fallback）
            </div>
          }
        >
          {show && <LazyHeavy />}
        </Suspense>

        <p className="hint" style={{ marginBottom: 0 }}>
          👆 点一下会先看到「正在加载组件文件……」，1.2 秒后变成真正的内容。
          <br />
          再点「卸载它」→ 再点「加载」→ <strong>这次立刻就出来了</strong>（模块已经被缓存，不会重复下载）。
          打开 F12 → Network 能看到这个文件多了一个请求（开发环境下路径类似{' '}
          <code>LazyHeavy.tsx</code>）。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>代码长这样（就三行）</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 12.5,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`import { lazy, Suspense } from 'react'

// ① 动态导入：这个文件不在首屏的 JS 里
const Chart = lazy(() => import('./Chart'))

// ② 用的时候包一层 Suspense
<Suspense fallback={<div>加载中…</div>}>
  <Chart data={data} />
</Suspense>`}</pre>
        <p style={{ margin: 0 }}>
          <strong>两个必须知道的点：</strong>
          <br />
          ① <code>lazy</code> 的组件<strong>必须</strong>包在 <code>Suspense</code> 里，
          否则整个页面会被"暂停"导致白屏/报错
          <br />
          ② <code>fallback</code> 不能是 <code>null</code> 加上忘记处理 ——
          加载失败时你需要错误边界（<code>ErrorBoundary</code>），这一块超出今天范围，先知道有这回事
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⭐ 最高收益的用法：路由级懒加载</h3>
        <p style={{ marginTop: 0 }}>
          你 Day7 写的路由表，现在每打开首页都会把 <strong>Day7/Day8/Day9 的代码全部下载一遍</strong>。
          改造之后，只有点进那一天才下载那一天的代码：
        </p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 12.5,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// src/router.tsx 改造前
import Day9Layout from './day9/Layout'        // 一进首页就下载了

// 改造后：用到才下载
const Day9Layout = lazy(() => import('./day9/Layout'))

// 然后在根布局的 <Outlet /> 外面包一层 Suspense
<div className="content">
  <Suspense fallback={<div>页面加载中…</div>}>
    <Outlet />
  </Suspense>
</div>`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          这在真实项目里几乎是标配：一个后台管理系统几十个页面，
          用户打开首页只要几百 KB，而不是把几十个页面的代码全拉下来。
          <br />
          ⚠️ 诚实说明：<strong>我这边验证不了"构建后拆成几个 chunk"</strong>（沙箱里跑不了{' '}
          <code>vite build</code>）。你可以自己跑 <code>npm run build</code>，
          看 <code>dist/assets/</code> 下的文件数量变化。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>三种"优化"分别治什么病</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>症状</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>用什么</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>用错了会怎样</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['首屏加载慢（白屏久）', '懒加载 / 代码分割', 'memo/useMemo 完全无效（那些是运行时的）'],
              ['交互卡（打字、点击延迟）', '挪 state / 拆组件 / memo', '懒加载无效（代码已经在了）'],
              ['长列表滚动卡', '虚拟列表', 'memo 只能缓解，治不了根'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa', color: '#57606a' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>先分症状，再选工具。</strong> 这是性能优化最容易弄反的一步。
        </p>
      </div>
    </div>
  )
}
