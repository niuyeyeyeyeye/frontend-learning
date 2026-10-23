// ============================================================
// Day3-1：⭐ key 的坑 —— 为什么不能用 index
// ============================================================
// 这是 React 面试最爱问的坑，也是实际开发里真实会遇到的 bug。
//
// 一句话原理：
//   ① React 用 key 来判断"这个元素是谁"，从而决定"复用还是销毁重建"
//   ② 用 index 做 key 时，删除/插入前面的项，后面所有项的 key 都变了
//   ③ React 就以为"这些元素都是新的" → 复用错 DOM 节点 → 状态错位
//
// 下面的演示：两个列表一模一样，只有 key 不同。
// 操作步骤：
//   1. 在第 1 个和第 2 个输入框里随便打字（比如打 "AAA" "BBB"）
//   2. 点"删除第一项"
//   3. 对比两个列表 —— 用 index 的那个会出现"内容错位"

import { useState } from 'react'

interface Item {
  id: number
  text: string
}

export default function KeyBugDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, text: '第 1 项（id=1）' },
    { id: 2, text: '第 2 项（id=2）' },
    { id: 3, text: '第 3 项（id=3）' },
  ])

  // 每次添加都用递增 id（别用 Date.now()，也别用 Math.random() —— 见文末）
  const [nextId, setNextId] = useState(4)

  function addItem() {
    setItems([...items, { id: nextId, text: `第 ${items.length + 1} 项（id=${nextId}）` }])
    setNextId(nextId + 1)
  }

  function removeFirst() {
    setItems(items.slice(1)) // 不可变更新：返回新数组
  }

  function reset() {
    setItems([
      { id: 1, text: '第 1 项（id=1）' },
      { id: 2, text: '第 2 项（id=2）' },
      { id: 3, text: '第 3 项（id=3）' },
    ])
    setNextId(4)
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button className="btn" onClick={addItem}>
          添加一项
        </button>
        {'　'}
        <button className="btn-ghost" onClick={removeFirst}>
          删除第一项
        </button>
        {'　'}
        <button className="btn-ghost" onClick={reset}>
          重置
        </button>
      </div>

      <p className="hint" style={{ color: '#cf222e' }}>
        👉 操作：先在两个列表的前两个输入框里打字，然后点"删除第一项"，对比两边
      </p>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* ---------- ❌ 用 index 做 key ---------- */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <h4 style={{ color: '#cf222e' }}>❌ 用 index 做 key</h4>
          {items.map((item, index) => (
            <div key={index} className="card">
              <div>{item.text}</div>
              {/* 这个输入框是"非受控"的：它的值存在 DOM 里，不受 React 管理 */}
              <input defaultValue={item.text} style={{ width: '100%', marginTop: 4 }} />
            </div>
          ))}
        </div>

        {/* ---------- ✅ 用 id 做 key ---------- */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <h4 style={{ color: '#1f883d' }}>✅ 用 id 做 key</h4>
          {items.map((item) => (
            <div key={item.id} className="card">
              <div>{item.text}</div>
              <input defaultValue={item.text} style={{ width: '100%', marginTop: 4 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h4 style={{ marginTop: 0 }}>为什么会错位？</h4>
        <p>
          假设你删掉了第 1 项。剩下的是「第 2 项、第 3 项」。
        </p>
        <p>
          <strong>用 index 做 key</strong>：key 变成 <code>0, 1</code>。
          而 React 记得"key=0 那个元素里有个输入框" → 它**复用**了原来第 1 项那个 DOM 节点，
          只是把文字改成了"第 2 项"。但输入框里你打的字是存在 DOM 里的，**不会被改** → 就错位了。
        </p>
        <p>
          <strong>用 id 做 key</strong>：key 是 <code>2, 3</code>。
          React 知道"id=1 那个元素没了"，直接销毁它 → 剩下的 id=2、id=3 节点原封不动 → 正确。
        </p>
      </div>

      <div className="card" style={{ borderColor: '#d4a72c', background: '#fff8c5' }}>
        <h4 style={{ marginTop: 0 }}>⭐ 三条 key 的规则</h4>
        <ol style={{ paddingLeft: 20 }}>
          <li>
            <strong>key 在同级兄弟里必须唯一</strong>（不要求全局唯一）
          </li>
          <li>
            <strong>key 要稳定</strong>：用数据自带的 id；没有 id 时，在数据里自己生成一个（比如
            <code>{'{ id: nextId++, ...}'}</code>）
          </li>
          <li>
            <strong>绝对不要用 <code>Math.random()</code></strong> —— 每次渲染 key 都变，
            React 会把整个列表销毁重建（性能差 + 状态全丢）
          </li>
        </ol>
        <p className="hint">
          什么时候可以用 index 当 key？**列表不会增删、不会重排**的时候（比如静态展示的配置列表）。
          一旦有"添加 / 删除 / 排序"，就必须用稳定 id。
        </p>
      </div>
    </div>
  )
}
