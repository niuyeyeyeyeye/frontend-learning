import JsxBasics from './day1/01-JSX基础'
import ComponentsProps from './day1/02-组件与props'
import Practice from './day1/03-练习'

function App() {
  return (
    <div>
      <h1>React Day1：JSX + 组件 + props</h1>
      <p className="hint">
        改 src/day1 下的文件，页面会自动刷新。JSX 里 {`{/* 注释 */}`} 就是注释。
      </p>

      <div className="section">
        <h2>一、JSX 基础</h2>
        <JsxBasics />
      </div>

      <div className="section">
        <h2>二、组件与 props</h2>
        <ComponentsProps />
      </div>

      <div className="section">
        <h2>三、你的练习（把 TODO 补完）</h2>
        <Practice />
      </div>
    </div>
  )
}

export default App
