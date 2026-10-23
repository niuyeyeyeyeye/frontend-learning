import JsxBasics from './day1/01-JSX基础'
import ComponentsProps from './day1/02-组件与props'
import Practice from './day1/03-练习'
import EventsBasics from './day2/01-事件处理'
import UseStateBasics from './day2/02-useState入门'
import ConditionalBasics from './day2/03-条件渲染'
import PracticeDay2 from './day2/04-练习'
import KeyBugDemo from './day3/01-key的坑'
import ListOperations from './day3/02-列表与不可变更新'
import TodoApp from './day3/03-表单与待办列表'
import PracticeDay3 from './day3/04-练习'

function App() {
  return (
    <div>
      <h1>React 学习：JSX → 组件 → 事件 → 状态</h1>
      <p className="hint">
        改 src 下的文件，页面会自动刷新。打开控制台（F12）能看到我埋的提示。
      </p>

      <div className="section">
        <h2>Day1 · 一、JSX 基础</h2>
        <JsxBasics />
      </div>

      <div className="section">
        <h2>Day1 · 二、组件与 props</h2>
        <ComponentsProps />
      </div>

      <div className="section">
        <h2>Day1 · 三、练习（4 个 TODO）</h2>
        <Practice />
      </div>

      <div className="section">
        <h2>Day2 · 一、事件处理</h2>
        <EventsBasics />
      </div>

      <div className="section">
        <h2>Day2 · 二、useState 入门（UI = f(state)）</h2>
        <UseStateBasics />
      </div>

      <div className="section">
        <h2>Day2 · 三、条件渲染</h2>
        <ConditionalBasics />
      </div>

      <div className="section">
        <h2>Day2 · 四、练习（3 个 TODO）</h2>
        <PracticeDay2 />
      </div>

      <div className="section">
        <h2>Day3 · 一、⭐ key 的坑（先读这个，动手操作一遍）</h2>
        <KeyBugDemo />
      </div>

      <div className="section">
        <h2>Day3 · 二、列表操作与不可变更新</h2>
        <ListOperations />
      </div>

      <div className="section">
        <h2>Day3 · 三、完整版待办列表（看目标形态）</h2>
        <TodoApp />
      </div>

      <div className="section">
        <h2>Day3 · 四、练习（3 个 TODO）</h2>
        <PracticeDay3 />
      </div>
    </div>
  )
}

export default App
