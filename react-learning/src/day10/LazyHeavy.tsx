// ============================================================
// LazyHeavy：被"懒加载"的组件（假装它很重）
// ============================================================
// 📖 名字对照：LazyHeavy 懒加载重组件
//
// 这个文件只有在用户点按钮时才会被浏览器加载（动态 import）。
// 真实项目里"重"的可能是：图表库、富文本编辑器、地图、PDF 预览……
// 这里用一个渲染 300 项的列表来模拟。

export default function LazyHeavy() {
  const items = Array.from({ length: 300 }, (_, i) => i + 1)
  return (
    <div className="card" style={{ borderColor: '#0969da' }}>
      <strong style={{ color: '#0969da' }}>我是被懒加载进来的组件</strong>
      <p style={{ margin: '6px 0' }}>这个文件刚才根本不在首屏的 JS 里。</p>
      <div style={{ maxHeight: 100, overflow: 'auto', fontSize: 12, color: '#8b949e' }}>
        {items.map((i) => (
          <span key={i} style={{ marginRight: 6 }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}
