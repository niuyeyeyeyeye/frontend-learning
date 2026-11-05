// ============================================================
// Day8-2：选择性订阅 —— Zustand 最值钱的一点
// ============================================================
// 📖 本文件名字对照表
//   SelectorDemo   选择性订阅演示（本页）
//   useShop        demo 用的 store（count / text / list 三个字段）
//   selector       选择器：从整个 state 里挑出我要的那一块
//   useShallow     浅比较的包装（selector 要返回对象时用它）
//   Object.is      React 比较"状态变没变"用的算法（引用比较）
//
// ⭐ 一句话：**组件只订阅它真正用到的那一小块。别的一变，它根本不渲染。**

import { useEffect } from 'react'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

// ============================================================
// 一个"杂货铺"store：三个互不相干的字段
// ============================================================
type ShopStore = {
  count: number
  text: string
  list: string[]
  inc: () => void
  setText: (t: string) => void
  addItem: () => void
}

const useShop = create<ShopStore>()((set) => ({
  count: 0,
  text: '你好',
  list: ['第一条'],
  inc: () => set((s) => ({ count: s.count + 1 })),
  setText: (t) => set({ text: t }),
  addItem: () => set((s) => ({ list: [...s.list, `第 ${s.list.length + 1} 条`] })),
}))

// ============================================================
// 三个消费者：订阅的范围不同
// ============================================================

// ① 只订 count
function CountOnly() {
  const count = useShop((s) => s.count)
  useEffect(() => {
    console.log('[① 只订 count] 渲染了')
  })
  return (
    <div className="card" style={{ padding: '6px 10px' }}>
      ① 只订 <code>count</code>：{count}
    </div>
  )
}

// ② 只订 text
function TextOnly() {
  const text = useShop((s) => s.text)
  useEffect(() => {
    console.log('[② 只订 text] 渲染了')
  })
  return (
    <div className="card" style={{ padding: '6px 10px' }}>
      ② 只订 <code>text</code>：{text}
    </div>
  )
}

// ③ 整店订阅（不传 selector）—— 任何一个字段变，它都渲染
function WholeStore() {
  const state = useShop()
  useEffect(() => {
    console.log('[③ 整店订阅] 渲染了')
  })
  return (
    <div className="card" style={{ padding: '6px 10px', borderColor: '#cf222e' }}>
      ③ 整店订阅：count={state.count} / text={state.text} / list={state.list.length} 条
    </div>
  )
}

// ④ 一次要两个字段 —— 用 useShallow，只有当这两个值真的变了才渲染
function TwoFieldsShallow() {
  const { count, text } = useShop(useShallow((s) => ({ count: s.count, text: s.text })))
  useEffect(() => {
    console.log('[④ useShallow 拿两个字段] 渲染了')
  })
  return (
    <div className="card" style={{ padding: '6px 10px', borderColor: '#1f883d' }}>
      ④ useShallow 拿 count+text：{count} / {text}
    </div>
  )
}

// ============================================================
// 页面
// ============================================================
export default function SelectorDemo() {
  const inc = useShop((s) => s.inc)
  const setText = useShop((s) => s.setText)
  const addItem = useShop((s) => s.addItem)

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>实验：打开 F12 控制台，然后点下面三个按钮</h3>
        <button className="btn" style={{ marginRight: 8 }} onClick={inc}>
          count +1
        </button>
        <button
          className="btn-ghost"
          style={{ marginRight: 8 }}
          onClick={() => setText(new Date().toLocaleTimeString('zh-CN', { hour12: false }))}
        >
          改 text
        </button>
        <button className="btn-ghost" onClick={addItem}>
          往 list 加一条
        </button>
        <p className="hint">
          <strong>点 count +1</strong> 时，控制台应该只出现
          <code>[① 只订 count]</code> 和 <code>[③ 整店订阅]</code>；
          <code>[② 只订 text]</code> 不出现。
          <br />
          <strong>改 text</strong> 时，只有 <code>[②]</code>（还有 ③④）出现。
        </p>
      </div>

      <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <CountOnly />
        <TextOnly />
        <WholeStore />
        <TwoFieldsShallow />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>它凭什么能做到？看 zustand 源码就一行</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// node_modules/zustand/react.js
const slice = React.useSyncExternalStore(
  api.subscribe,
  React.useCallback(() => selector(api.getState()), [api, selector]),
  () => selector(api.getInitialState()),
)`}</pre>
        <p style={{ margin: 0 }}>
          React 拿到 <code>selector(api.getState())</code> 的返回值后，会用{' '}
          <strong>
            <code>Object.is</code>
          </strong>{' '}
          和上一次比较。相等 → 不渲染；不等 → 渲染。
          <br />
          所以你写 <code>(s) =&gt; s.count</code>，返回的是个数字，比的就是数字 ——
          只有数字变了才渲染。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⚠️ 最容易踩的坑：selector 返回了一个新对象</h3>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`// ❌ 每次调用都新建一个对象 → Object.is 永远 false → 每次 store 变都重渲染
const { count, text } = useShop((s) => ({ count: s.count, text: s.text }))

// ✅ 办法一：分开订（推荐，最直观）
const count = useShop((s) => s.count)
const text  = useShop((s) => s.text)

// ✅ 办法二：要一次拿多个，就用 useShallow 包一层
const { count, text } = useShop(useShallow((s) => ({ count: s.count, text: s.text })))`}</pre>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>为什么上面④用了 useShallow 就没事？</strong>因为它内部用{' '}
          <code>useRef</code> 记住了上一次的结果，浅比较（每个字段都相等）成立时
          <strong>返回上一次那个对象的同一个引用</strong> —— React 一比较，引用没变，就不渲染。
          <br />
          <strong>为什么这段错误代码我只放在注释里、没接进页面？</strong>
          因为返回新对象会让 React 认为"状态每一帧都在变"，控制台会报
          <code>getSnapshot should be cached</code>，严重时直接把页面刷成死循环。你自己写的时候，
          看到这条报错就知道是这个原因。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>和 Context 对比：为什么 Context 做不到</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}></th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Context</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Zustand</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['能不能只订一部分', '❌ value 里任何一个字段变，所有消费者全渲染', '✅ selector 想订多细就多细'],
              ['提供者', '必须有 Provider 包住', '没有 Provider'],
              ['状态活在哪', 'Provider 组件的 useState 里', '模块级 store，React 之外'],
              ['组件卸载后', '状态没了', '还在'],
              ['学习成本', 'React 自带，零依赖', '多一个依赖'],
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
          Context 想减少重渲染，只能"拆成多个小 Context"或"用 memo 包消费者" ——
          能缓解，但本质上做不到"只订一个字段"。这就是 Zustand 存在的意义。
        </p>
      </div>
    </div>
  )
}

/* ============================================================
 * 面试三连（能答上就说明真懂了）
 * ============================================================
 * Q1: 为什么 Zustand 不会像 Context 那样"一个字段变全部重渲染"？
 *     A: 因为它用 useSyncExternalStore + selector，每个组件自己决定
 *        "拿哪一部分"，React 用 Object.is 比较这一部分有没有变。
 *        Context 是"值"级别的广播，没有选择器。
 *
 * Q2: useShallow 解决什么问题？
 *     A: selector 必须返回稳定引用。要返回对象/数组时，用 useShallow 做浅比较，
 *        相等就返回旧引用，避免"每次都算变了"。
 *
 * Q3: Zustand 的状态为什么切路由不丢？
 *     A: store 是模块级的（create 在模块作用域执行），不属于任何组件的生命周期。
 *        组件卸载只是取消订阅，store 本身还在。
 * ============================================================ */
