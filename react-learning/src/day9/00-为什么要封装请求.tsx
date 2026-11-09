// ============================================================
// Day9-0：为什么要封装请求（先看"三态"，再看工具）
// ============================================================
// 📖 本文件名字对照表
//   WhyWrapRequest  为什么要封装（本页 /day9）
//   loading         加载中   error 出错   empty 空数据
//   fetch / axios   两种发请求的方式
//
// ⭐ 一句话：**页面上任何一个"从服务器拿的数据"，都有 4 种状态，不是 1 种。**
//    loading（正在拿）、error（拿失败）、empty（拿到了但是空）、success（有数据）
//    新手只写第 4 种 —— 这就是线上"白屏"和"转圈卡死"的来源。

import { Link } from 'react-router-dom'

export default function WhyWrapRequest() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>⭐ 一个列表页，其实有 4 种样子</h3>
        <p className="hint">
          👆 下面三张卡是<strong>静态示意</strong>：真实项目里这三种状态你都要写，
          而且要考虑"用户看到它时的感受"。
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div className="card" style={{ padding: 10 }}>
            <div style={{ color: '#57606a', fontSize: 12, marginBottom: 6 }}>① loading（加载中）</div>
            <div style={{ background: '#eaeef2', height: 10, borderRadius: 4, marginBottom: 6 }} />
            <div style={{ background: '#eaeef2', height: 10, borderRadius: 4, marginBottom: 6 }} />
            <div style={{ background: '#eaeef2', height: 10, borderRadius: 4, width: '60%' }} />
            <p className="hint" style={{ marginBottom: 0, marginTop: 8 }}>
              骨架屏 / 转圈。**别让用户对着空白猜。**
            </p>
          </div>

          <div className="card" style={{ padding: 10, borderColor: '#cf222e' }}>
            <div style={{ color: '#cf222e', fontSize: 12, marginBottom: 6 }}>② error（出错）</div>
            <p style={{ margin: '0 0 6px', color: '#cf222e' }}>网络异常，请重试</p>
            <button className="btn-ghost">重试</button>
            <p className="hint" style={{ marginBottom: 0, marginTop: 8 }}>
              要有**原因 + 重试按钮**，不是只有一句"加载失败"。
            </p>
          </div>

          <div className="card" style={{ padding: 10 }}>
            <div style={{ color: '#57606a', fontSize: 12, marginBottom: 6 }}>③ empty（空数据）</div>
            <p style={{ margin: '0 0 6px', color: '#8b949e' }}>还没有内容</p>
            <button className="btn-ghost">去创建</button>
            <p className="hint" style={{ marginBottom: 0, marginTop: 8 }}>
              空 ≠ 错。要说清"为什么空"并给出下一步动作。
            </p>
          </div>
        </div>

        <p className="hint" style={{ marginBottom: 0 }}>
          ⚠️ 最常见的三个坑：① 只判断 `data.length &gt; 0`，忘了 loading 时也是 0 →
          会闪一下"暂无数据"；② 出错后 loading 没关 → 一直转圈；
          ③ 空数据当成错误提示 → 用户以为系统坏了。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>为什么不用 fetch？</h3>
        <p style={{ marginTop: 0 }}>
          fetch 能用，但每写一个接口你都要重复这四件事：
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>要做的事</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>fetch</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>axios</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['4xx / 5xx 状态码', '❌ 不报错，要自己 if (!res.ok)', '✅ 直接 reject，进 catch'],
              ['把响应转成 JSON', '❌ 手动 await res.json()', '✅ 自动（res.data）'],
              ['超时控制', '❌ 要自己写 AbortController + 定时器', '✅ timeout 配置'],
              ['统一加 token / 统一报错', '❌ 每个调用点各写一遍', '✅ 拦截器，一处搞定'],
              ['取消请求', '✅ 支持 signal', '✅ 支持 signal'],
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
          <strong>第一条最关键</strong>：fetch 在 404/500 时<strong>不会</strong>抛错，只有断网才抛。
          所以你写 <code>fetch().then(r =&gt; r.json())</code> 拿到 500 的报错 JSON，还以为成功了。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>“封装请求”到底封装了什么（3 层）</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <strong>实例层</strong>：<code>axios.create({'{ baseURL, timeout }'})</code>
            —— 域名只写一次，换环境（开发/测试/生产）只改一处
          </li>
          <li>
            <strong>拦截器层</strong>：请求前自动带 token；响应后自动剥 <code>data</code>、
            自动把错误翻成人话、401 自动跳登录 —— <strong>这才是封装的核心价值</strong>
          </li>
          <li>
            <strong>类型层</strong>：<code>request&lt;Post[]&gt;()</code> 让调用方拿到带类型的数据，
            <code>data.title</code> 有提示、写错了编译期就报
          </li>
        </ol>
        <p className="hint" style={{ marginBottom: 0 }}>
          今天这三层都会写一遍。最后一节（竞态）才是<strong>真正的新东西</strong>，前两节是换工具。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天的路线</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <Link to="/day9/basics">2. axios 与错误分类</Link> —— 点按钮，把 4 种错误都撞一遍
          </li>
          <li>
            <Link to="/day9/interceptor">3. 拦截器与封装</Link> —— 自动带 token、自动剥 data、401 统一处理
          </li>
          <li>
            <Link to="/day9/race">4. ⭐ 竞态与取消</Link> —— 快速切页时"旧结果覆盖新结果"怎么治
          </li>
          <li>
            <Link to="/day9/practice">练习</Link> —— 3 个 TODO
          </li>
        </ol>
      </div>
    </div>
  )
}
