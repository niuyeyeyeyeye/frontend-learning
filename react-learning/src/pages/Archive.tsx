// ============================================================
// Archive：Day1 ~ Day6 的全部内容（原来 App.tsx 里那一长串）
// ============================================================
// 📖 为什么搬家了？
//   Day7 学路由，App 从"一个页面"变成"一个应用"：
//   src/router.tsx 才是新的入口，每个 URL 对应一个页面组件。
//   这一页就是原来的"全部堆一起"，保留下来方便你回看。
//   地址：http://localhost:5173/archive
// ============================================================

import JsxBasics from '../day1/01-JSX基础'
import ComponentsProps from '../day1/02-组件与props'
import Practice from '../day1/03-练习'
import EventsBasics from '../day2/01-事件处理'
import UseStateBasics from '../day2/02-useState入门'
import ConditionalBasics from '../day2/03-条件渲染'
import PracticeDay2 from '../day2/04-练习'
import KeyBugDemo from '../day3/01-key的坑'
import ListOperations from '../day3/02-列表与不可变更新'
import TodoApp from '../day3/03-表单与待办列表'
import PracticeDay3 from '../day3/04-练习'
import EffectBasics from '../day4/01-useEffect基础'
import CleanupBasics from '../day4/02-清理函数'
import FetchDemo from '../day4/03-请求数据'
import PracticeDay4 from '../day4/04-练习'
import PracticeDay4Variant from '../day4/05-变式练习'
import RefBasics from '../day5/01-useRef基础'
import CustomHooks from '../day5/02-自定义hook'
import SearchDemo from '../day5/03-实战-搜索防抖'
import PracticeDay5 from '../day5/04-练习'
import CommunicationBasics from '../day6/01-组件通信基础'
import ContextBasics from '../day6/02-Context入门'
import TodoWithContext from '../day6/03-实战-用Context重写待办'
import PracticeDay6 from '../day6/04-练习'

export default function Archive() {
  return (
    <div>
      <h1>React 学习：JSX → 组件 → 事件 → 状态（Day1~Day6 归档）</h1>
      <p className="hint">
        这是 Day1~Day6 的全部内容堆在一页。想复习哪天就翻到对应标题。
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

      <div className="section">
        <h2>Day4 · 一、useEffect 基础 + 依赖数组 + 闭包陷阱</h2>
        <EffectBasics />
      </div>

      <div className="section">
        <h2>Day4 · 二、清理函数（不写会出事）</h2>
        <CleanupBasics />
      </div>

      <div className="section">
        <h2>Day4 · 三、请求数据（loading / error / data 三态）</h2>
        <FetchDemo />
      </div>

      <div className="section">
        <h2>Day4 · 四、练习（3 个 TODO）</h2>
        <PracticeDay4 />
      </div>

      <div className="section">
        <h2>Day4 · 五、变式练习（验证你是不是真的会了）</h2>
        <PracticeDay4Variant />
      </div>

      <div className="section">
        <h2>Day5 · 一、useRef（不触发渲染的容器）</h2>
        <RefBasics />
      </div>

      <div className="section">
        <h2>Day5 · 二、自定义 hook（复用逻辑，不复用状态）</h2>
        <CustomHooks />
      </div>

      <div className="section">
        <h2>Day5 · 三、实战：用 useDebounce 重写搜索框</h2>
        <SearchDemo />
      </div>

      <div className="section">
        <h2>Day5 · 四、练习（3 个 TODO）</h2>
        <PracticeDay5 />
      </div>

      <div className="section">
        <h2>Day6 · 一、组件通信（父传子 / 子传父 / 状态提升 / props 钻地）</h2>
        <CommunicationBasics />
      </div>

      <div className="section">
        <h2>Day6 · 二、Context（跨层级共享 + value 不稳的坑）</h2>
        <ContextBasics />
      </div>

      <div className="section">
        <h2>Day6 · 三、实战：用 Context 重写待办</h2>
        <TodoWithContext />
      </div>

      <div className="section">
        <h2>Day6 · 四、练习（3 个 TODO）</h2>
        <PracticeDay6 />
      </div>
    </div>
  )
}
