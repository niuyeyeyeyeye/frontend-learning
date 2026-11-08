// ============================================================
// Day8-4：你的练习
// ============================================================
// 📖 本文件名字对照表
//   PracticeDay8   今天的练习页（/day8/practice）
//   useCountStore  练习 1：计数器 store
//   useCartStore   练习 2/3：购物车 store
//   persist        练习 3：持久化中间件
//
// 规则：补完 TODO → 保存 → 浏览器看效果
// 每个练习 20 分钟左右；卡住看文件底部的答案，隔一晚闭卷重写

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage,persist } from 'zustand/middleware'

// ============================================================
// 练习 1 ⭐：写一个计数器 store，两个组件共享同一个数字
// ============================================================
// 要求：
//   a) 把 inc 补完（函数式 set）
//   b) 再加一个 reset（合并式 set，把 count 改回 0）
//   c) 点 CounterA 的 +1，CounterB 的数字也要跟着变
// 提示：create<CountStore>()((set) => ({ ... }))
// ------------------------------------------------------------

type CountStore = {
  count: number
  inc: () => void
  reset: () => void
}

const useCountStore = create<CountStore>()((set) => ({
  count: 0,
  // TODO 1-a：补完 inc
  inc: () => {
    set((s) => ({ count: s.count+1 }))
  },
  // TODO 1-b：补完 reset
  reset: () => {
    set({ count: 0 })
  },
}))

function CounterA() {
  const count = useCountStore((s) => s.count)
  const inc = useCountStore((s) => s.inc)
  return (
    <div className="card">
      A 看到的数字：<strong>{count}</strong>{' '}
      <button className="btn" onClick={inc}>
        A 的 +1
      </button>
    </div>
  )
}

function CounterB() {
  const count = useCountStore((s) => s.count)
  const reset = useCountStore((s) => s.reset)
  return (
    <div className="card">
      B 看到的数字：<strong>{count}</strong>{' '}
      <button className="btn-ghost" onClick={reset}>
        B 的重置
      </button>
    </div>
  )
}

// ============================================================
// 练习 2 ⭐⭐：购物车 store（Day6 练习 3 的 Zustand 版）
// ============================================================
// 要求：
//   a) addItem：已有该商品就 count+1，没有就 push 一条（不可变更新）
//   b) removeItem：按 id 删
//   c) clear：清空
//   d) 总件数 / 总价 —— ⭐ 不要存进 store，在组件里从 items 算出来
//      （为什么？存进去就要手动同步，早晚不一致。这条 Day6/Day8 都成立）
// ------------------------------------------------------------

type CartItem = { id: number; name: string; price: number; count: number }

type CartStore = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'count'>) => void
  removeItem: (id: number) => void
  clear: () => void
}
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const useCartStore = create<CartStore>()(persist((set) => ({
  items: [{ id: 1, name: '牛奶', price: 6, count: 1 }],
  // TODO 2-a ~ 2-c
  addItem: (item) =>set((s)=>{
    const n=s.items.find((n)=>n.id===item.id)
    if(n!==undefined)return {items:s.items.map((n)=>n.id===item.id?{ ...n, count: n.count + 1 }:n)}
    return {items:[...s.items,{...item,count:1}]}
  }),
  removeItem: (id) => set((s)=>({items:s.items.filter((n)=>n.id!==id)}) ),
  clear: () => set({items:[]}),
}),
{
  name:'day8-cart',
  storage: createJSONStorage(() =>
        typeof window === 'undefined' ? noopStorage : window.localStorage,
      ),
  partialize:(s)=>({items:s.items})
}
),
)

const PRODUCTS: Omit<CartItem, 'count'>[] = [
  { id: 1, name: '牛奶', price: 6 },
  { id: 2, name: '鸡蛋', price: 2 },
  { id: 3, name: '面包', price: 8 },
]

function CartDemo() {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)

  // TODO 2-d：从 items 算出总件数和总价（reduce）
  const totalCount = items.reduce((sum,n)=>sum+=n.count,0)
  const totalPrice = items.reduce((sum,n)=>sum+=n.count*n.price,0)

  return (
    <div className="card">
      <p style={{ marginTop: 0 }}>
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            className="btn-ghost"
            style={{ marginRight: 6 }}
            onClick={() => addItem(p)}
          >
            加 {p.name}（¥{p.price}）
          </button>
        ))}
        <button className="btn-ghost" onClick={clear}>
          清空
        </button>
      </p>

      <p>
        共 <strong>{totalCount}</strong> 件，合计 <strong>¥{totalPrice}</strong>
        <span className="hint">　（现在全是 0，说明 TODO 还没做完）</span>
      </p>

      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((it) => (
          <li key={it.id}>
            {it.name} ¥{it.price} × {it.count}{' '}
            <button className="btn-ghost" onClick={() => removeItem(it.id)}>
              删
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================================
// 练习 3 ⭐⭐⭐（挑战）：选择性订阅 + 持久化
// ============================================================
// 要求：
//   a) 加一个只显示「总价」的组件 PriceOnly，它**只**订 items（用 selector 算出数字）
//      ⚠️ 别写成 useCartStore((s) => ({ total: ... })) —— 返回新对象，每帧都算变了
//   b) 打开控制台，点「加牛奶」时 PriceOnly 应该渲染；点下面的
//      「只改备注（跟价格无关）」时 PriceOnly **不应该**渲染
//   c) 给 useCartStore 套上 persist，让刷新页面后购物车还在
// ------------------------------------------------------------

function PriceOnly() {
  // TODO 3-a：只订"总价"这个数字
  const items = useCartStore((s) => s.items)
  const total = items.reduce((s, it) => s + it.price * it.count, 0)

  useEffect(() => {
    console.log('[PriceOnly] 渲染了')
  })

  return (
    <div className="card" style={{ padding: '6px 10px', borderColor: '#1f883d' }}>
      只订阅总价：<strong>¥{total}</strong>
    </div>
  )
}

// 这个字段跟价格完全无关，用来验证"订阅范围"是否生效
const useNoteStore = create<{ note: string; setNote: (n: string) => void }>()(
  persist(
    (set) => ({
      note: '',
      setNote: (n) => set({ note: n }),
    }),
    {
      name:'day8-note',
      partialize:(s)=>({note:s.note})
    }
  )
)

function NoteBox() {
  const note = useNoteStore((s) => s.note)
  const setNote = useNoteStore((s) => s.setNote)
  return (
    <div className="card">
      备注（跟价格无关）：<input value={note} onChange={(e) => setNote(e.target.value)} />
      <p className="hint" style={{ marginBottom: 0 }}>
        TODO 3-b：改这里的时候，上面 PriceOnly 不该重新渲染（看控制台）。它现在其实是对的 ——
        但你要能说出为什么。
      </p>
    </div>
  )
}

// ============================================================
// 展示区（不用改）
// ============================================================
export default function PracticeDay8() {
  return (
    <div>
      <h2>练习 1 ⭐：计数器 store（两个组件共享）</h2>
      <CounterA />
      <CounterB />

      <h2>练习 2 ⭐⭐：购物车 store</h2>
      <CartDemo />

      <h2>练习 3 ⭐⭐⭐：选择性订阅 + 持久化</h2>
      <PriceOnly />
      <NoteBox />
      <p className="hint">
        做完 3-c 之后刷新页面，购物车里的东西应该还在。
      </p>
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   const useCountStore = create<CountStore>()((set) => ({
 *     count: 0,
 *     inc: () => set((s) => ({ count: s.count + 1 })),
 *     reset: () => set({ count: 0 }),        // 合并式 set，只写要改的字段
 *   }))
 *
 * 练习 2：
 *   const useCartStore = create<CartStore>()((set) => ({
 *     items: [{ id: 1, name: '牛奶', price: 6, count: 1 }],
 *     addItem: (item) =>
 *       set((s) => {
 *         const exists = s.items.some((x) => x.id === item.id)
 *         if (exists) {
 *           return { items: s.items.map((x) => (x.id === item.id ? { ...x, count: x.count + 1 } : x)) }
 *         }
 *         return { items: [...s.items, { ...item, count: 1 }] }
 *       }),
 *     removeItem: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
 *     clear: () => set({ items: [] }),
 *   }))
 *
 *   // 组件里算派生数据
 *   const totalCount = items.reduce((s, it) => s + it.count, 0)
 *   const totalPrice = items.reduce((s, it) => s + it.price * it.count, 0)
 *
 * 练习 3：
 *   // a) 只订数字（返回 number，比较的是值，天然稳定）
 *   function PriceOnly() {
 *     const total = useCartStore((s) => s.items.reduce((sum, it) => sum + it.price * it.count, 0))
 *     useEffect(() => { console.log('[PriceOnly] 渲染了') })
 *     return <div>只订阅总价：¥{total}</div>
 *   }
 *   ⚠️ 注意：这个 selector 每次都重新跑 reduce，但**返回的是数字**，
 *      Object.is 比的是数字，没变就不渲染。selector 跑得勤不是问题，重渲染才是。
 *
 *   // b) 为什么 NoteBox 改输入不会让 PriceOnly 渲染？
 *      → 因为 PriceOnly 只订了 useCartStore 的 items，
 *        useNoteStore 是**另一个 store**，两者毫无关系。（这是"跨 store 隔离"）
 *
 *   // c) 加 persist
 *   import { persist, createJSONStorage } from 'zustand/middleware'
 *   const useCartStore = create<CartStore>()(
 *     persist(
 *       (set) => ({ ...同上... }),
 *       { name: 'day8-cart', storage: createJSONStorage(() => localStorage) },
 *     ),
 *   )
 *
 * 【三个自问】
 * 1. 练习 2-d 为什么不让 store 存 totalPrice？
 *    答：能算出来的就别存。存了就要在 add/remove 里手动同步，漏一处就不一致；
 *        而且多个组件各自算也不会不一致（同一个输入 → 同一个输出）。
 *
 * 2. 练习 3 里 PriceOnly 的 selector 每次都跑 reduce，会不会很慢？
 *    答：reduce 是 O(n)，n 就几条，忽略不计。**真正贵的是重渲染（重新渲染整棵子树）**，
 *        selector 跑得勤不勤基本不影响性能。别为了"省 reduce"去做 memo。
 *
 * 3. 为什么不直接用 Context 写购物车？
 *    答：购物车是典型"高频变化 + 跨页面 + 多个组件各取所需"，
 *        Context 会让所有消费者跟着重渲染，而且 Provider 一卸载就丢。
 * ============================================================ */
