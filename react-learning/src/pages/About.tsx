// ============================================================
// About：练习 1 要你补完的页面（/about）
// ============================================================
// 📖 本文件名字对照表
//   About   关于我（一个独立页面）
//
// 现状：路由已经在 src/router.tsx 里配好了，但：
//   TODO 1-a：这个页面的内容还是空的 → 你自己写（见 day7/05-练习.tsx 的练习 1）
//   TODO 1-b：顶部导航里还没有它 → 去 layouts/RootLayout.tsx 的 NAV_ITEMS 里加一条

export default function About() {
  return (
    <div>
      <h1>关于我</h1>
      <div className="card">
        <p className="hint" style={{ marginTop: 0 }}>
          名字：
          目标：前端实习
          学习进度：react到router路由了
          技术栈：HTML、CSS、JavaScript、TypeScript。
          现在学到哪儿了、会用哪些技术。<strong>这是你以后项目里"个人介绍页"的原型。</strong>
        </p>
      </div>
    </div>
  )
}
