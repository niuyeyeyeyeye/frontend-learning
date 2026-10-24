const React = require('react')
const { renderToString } = require('react-dom/server')
const files = ['01-useEffect基础', '02-清理函数', '03-请求数据', '04-练习']
for (const f of files) {
  try {
    const Comp = require(`./_verify/${f}.js`).default
    const html = renderToString(React.createElement(Comp))
    console.log(`✅ ${f}：${html.length} 字符`)
  } catch (e) {
    console.log(`❌ ${f}：${e.message}`)
  }
}
