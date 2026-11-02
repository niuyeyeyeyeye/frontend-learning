// ============================================================
// Day7-4：嵌套路由 + Outlet（"切 tab 时外壳不动"）
// ============================================================
// 📖 本文件名字对照表
//   SettingsLayout    设置页外壳（/day7/nested）
//   SettingsIndex     设置页首页（index 路由，也就是 /day7/nested 本身）
//   SettingsProfile   资料 tab（/day7/nested/profile）
//   SettingsSecurity  安全 tab（/day7/nested/security）
//   Outlet            出口：子路由渲染在这里
//   index: true       索引路由（父路径本身就是它）
//
// ⭐ 你其实已经在用了：RootLayout → Day7Layout → 本页，这就是两层层嵌套。
//    本节是**第三层**，用来让你看清 Outlet 的机制。

import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/day7/nested', label: '说明', end: true },
  { to: '/day7/nested/profile', label: '资料', end: false },
  { to: '/day7/nested/security', label: '安全', end: false },
]

// ============================================================
// 外壳组件：只负责"标题 + tab 栏 + 出口"
// ============================================================
export default function SettingsLayout() {
  const location = useLocation()

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>设置页（三层嵌套路由的最内层）</h2>
      <p className="hint" style={{ marginTop: 0 }}>
        当前地址：<code>{location.pathname}</code>
      </p>

      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid #eaeef2',
          marginBottom: 12,
        }}
      >
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            style={({ isActive }) => ({
              padding: '6px 12px',
              textDecoration: 'none',
              fontSize: 14,
              borderBottom: isActive ? '2px solid #0969da' : '2px solid transparent',
              color: isActive ? '#0969da' : '#57606a',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* ⭐ 子路由（说明 / 资料 / 安全）从这里渲染出来。
          上面的 tab 栏和标题**不会**因为切 tab 而重建 —— 只有这一块换。 */}
      <Outlet />
    </div>
  )
}

// ============================================================
// index 路由：/day7/nested 本身
// ============================================================
export function SettingsIndex() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>什么是嵌套路由？</h3>
      <p>
        三个 tab 共享同一个外壳（标题 + tab 栏）。如果不嵌套，你得在三个页面里各写一遍外壳 ——
        改一处要改三遍，还容易不一致。
      </p>
      <p>嵌套路由的配置长这样（见 <code>src/router.tsx</code>）：</p>
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
  path: 'nested',
  element: <SettingsLayout />,        // 外壳
  children: [
    { index: true, element: <SettingsIndex /> },     // /day7/nested
    { path: 'profile', element: <SettingsProfile /> },   // /day7/nested/profile
    { path: 'security', element: <SettingsSecurity /> }, // /day7/nested/security
  ],
}`}</pre>

      <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
        <li>
          <strong>父路由的 element 必须有 <code>&lt;Outlet /&gt;</code></strong>，
          否则子路由没地方渲染（页面看着就是"只有外壳、内容空白"，这个坑很常见）。
        </li>
        <li>
          <strong>子路由的 path 不要加前导斜杠</strong>（写 <code>'profile'</code>，不要写{' '}
          <code>'/day7/nested/profile'</code>）。加了斜杠就变成绝对路径，父层的关系就断了。
        </li>
        <li>
          <strong><code>index: true</code></strong> 表示"父路径本身就是我"，所以{' '}
          <code>/day7/nested</code> 显示的就是本页。
        </li>
      </ul>

      <p className="hint">
        👆 点上面的「资料」「安全」两个 tab —— 注意标题和 tab 栏<strong>纹丝不动</strong>，
        只有下面这块内容在换。这就是 Outlet 存在的意义。
      </p>
    </div>
  )
}

// ============================================================
// 两个 tab 页面
// ============================================================
export function SettingsProfile() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>资料 tab（/day7/nested/profile）</h3>
      <p>
        注意：这个组件和 <code>SettingsLayout</code> 是<strong>父子关系</strong>，
        但它拿不到父组件的 state —— 除非通过 props（用 <code>useOutletContext</code>）
        或 Context（Day6 学的）。
      </p>
      <p className="hint">
        真实项目里，这种"设置页"通常是：外壳 + 3 个 tab，
        每个 tab 的数据各自请求，切 tab 时不重新请求外壳的东西。
      </p>
      <Link to="/day7/nested/security">去「安全」tab →</Link>
    </div>
  )
}

export function SettingsSecurity() {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>安全 tab（/day7/nested/security）</h3>
      <p>同样的外壳，不同的内容。</p>
      <p className="hint">
        面试常问：<strong>"嵌套路由的父子组件怎么传值？"</strong>
        答：父组件 <code>&lt;Outlet context={'{...}'} /&gt;</code>，
        子组件 <code>const ctx = useOutletContext&lt;T&gt;()</code>。
        它的作用和 Context 一样，但只在"这一条路由"里有效。
      </p>
      <Link to="/day7/nested">← 回说明</Link>
    </div>
  )
}
