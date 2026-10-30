// ============================================================
// Day6-4：你的练习
// ============================================================
// 📖 本文件名字对照表（完整版见 00-命名对照表.md）
//   PracticeDay6         Day6 练习（本文件的出口组件）
//   PriceCalc            价格计算（父，持有 price / qty）
//   PriceInput           单价输入框（Price = 价格；两个兄弟之一）
//   QtyInput             数量输入框（qty = quantity 数量 的缩写）
//   onChangePrice        请父改单价      onChangeQty 请父改数量
//   PriceInputProps      单价输入框的 props 类型（Props = 入参清单）
//   User                 用户（{ name, role }）    UserCtx 用户上下文（Ctx = Context）
//   useUser              用用户（练习 2 要你实现的那三行）     login / logout 登录 / 登出
//   UserProfileDemo      用户资料演示    ProfileSection 资料区块    ProfileCard 资料卡片
//   CartArea             购物车区域（练习 3 的挂载点）   CartItem 购物车条目
//   useCart / CartProvider / CartLayout   用购物车 / 购物车提供者 / 购物车布局
//   HeaderBadge          顶部徽标（badge = 小徽标，"购物车 N 件"）
//   ProductList / ProductCard   商品列表 / 商品卡片
//   addItem / removeItem 加入购物车 / 移除
//   totalCount / totalPrice     总件数 / 总价
// ============================================================
// 规则：补完 TODO → 保存 → 浏览器看效果
// 每个练习卡 20~25 分钟，超时看文件底部的参考答案，然后隔一晚闭卷重写
//
// 顺序建议：先做 1（状态提升）→ 再 2（Context）→ 最后 3（挑战）

import { createContext, useContext, useMemo, useState } from 'react'

// ============================================================
// 练习 1 ⭐：状态提升 —— 单价 × 数量 = 总价
// ============================================================
// 两个兄弟组件（单价输入框、数量输入框）都没有自己的 state，
// 状态在父组件 PriceCalc 里，总价也在父组件算。
//
// TODO 1：
//   a) 把 price 和 onChangePrice 传给 PriceInput（把现在的假 props 换掉）
//   b) 把 qty 和 onChangeQty 传给 QtyInput
//   c) 把总价算出来显示（就是 price * qty）
// ------------------------------------------------------------

type PriceInputProps = {
  price: number
  onChangePrice: (next: number) => void
}

type QtyInputProps = {
  qty: number
  onChangeQty: (next: number) => void
}

function PriceCalc() {
  const [price, setPrice] = useState(10)
  const [qty, setQty] = useState(2) // qty = quantity（数量）的缩写，前端很常用

  return (
    <div className="card">
      {/* TODO 1-a / 1-b：把下面两个假的 props 换成真的 */}
      <PriceInput price={0} onChangePrice={() => {}} />
      <QtyInput qty={0} onChangeQty={() => {}} />
      <p style={{ marginTop: 8 }}>
        总价：<strong style={{ color: '#cf222e' }}>？（TODO 1-c）</strong>
      </p>
    </div>
  )
}

function PriceInput({ price, onChangePrice }: PriceInputProps) {
  return (
    <div style={{ marginBottom: 6 }}>
      单价（元）：
      <input
        type="number"
        value={price}
        onChange={(e) => onChangePrice(Number(e.target.value))}
        style={{ padding: 4, width: 100 }}
      />
    </div>
  )
}

function QtyInput({ qty, onChangeQty }: QtyInputProps) {
  return (
    <div>
      数量：
      <input
        type="number"
        value={qty}
        onChange={(e) => onChangeQty(Number(e.target.value))}
        style={{ padding: 4, width: 100 }}
      />
    </div>
  )
}

// ============================================================
// 练习 2 ⭐⭐：Context —— 登录状态跨 3 层
// ============================================================
// 目标：ProfileCard 在最深层，它要显示"当前用户"并给出登录/登出按钮。
//       中间两层 ProfileLayout / ProfileSection 不许出现任何 user props。
//
// TODO 2-a：把下面这个假 useUser 换成真正的实现
//           （useContext + 空值 throw new Error）
// TODO 2-b：把 ProfileSection 里的 <>{...}</> 包成 <UserProvider>
//           （Provider 自己写：useState<User|null> + useMemo 稳住 value）
// ------------------------------------------------------------

type User = { name: string; role: string }

type UserCtx = {
  user: User | null
  login: () => void
  logout: () => void
}

const UserContext = createContext<UserCtx | null>(null)

function useUser(): UserCtx {
  // TODO 2-a：这里应该是 const ctx = useContext(UserContext)
  //            + if (ctx === null) throw new Error(...)
  return { user: null, login: () => {}, logout: () => {} }
}

function UserProfileDemo() {
  // TODO 2-b：包一层 <UserProvider>
  return (
    <>
      <div style={{ color: '#999', fontSize: 12 }}>ProfileLayout（不许出现 user props）</div>
      <ProfileSection />
    </>
  )
}

function ProfileSection() {
  return (
    <div className="card">
      <div style={{ color: '#999', fontSize: 12 }}>ProfileSection（也不许出现 user props）</div>
      <ProfileCard />
    </div>
  )
}

function ProfileCard() {
  const { user, login, logout } = useUser()

  return (
    <div className="card">
      {user === null ? (
        <>
          <p>当前未登录。</p>
          <button className="btn" onClick={login}>
            以「小明 / 前端实习生」登录
          </button>
        </>
      ) : (
        <>
          <p>
            当前用户：<strong>{user.name}</strong>（{user.role}）
          </p>
          <button className="btn-ghost" onClick={logout}>
            登出
          </button>
        </>
      )}
      <p className="hint">
        👆 如果点了没反应，说明 TODO 2-a / 2-b 还没做完（现在用的是假 hook）。
      </p>
    </div>
  )
}

// ============================================================
// 练习 3 ⭐⭐⭐（挑战）：自己从零写一个购物车 Context
// ============================================================
// 需求：
//   - 一个 CartProvider，存 items: { id, name, price, count }[]
//   - useCart() 自定义 hook，暴露：items、totalCount（总件数）、totalPrice（总价）、
//     addItem(id)、removeItem(id)
//   - 两个消费者，位置要一深一浅：
//       · HeaderBadge：在页面顶部，只显示"购物车 N 件"
//       · ProductList → ProductCard：商品卡片，点"加入购物车"
//   - CartLayout 组件负责排版，**它里面不能出现 items 这个 props**
//
// 提示：addItem 的语义是"已有就 count+1，没有就 push 一条"（不可变更新！）
//       参考实现见文件底部，但先自己写 20 分钟。
// ------------------------------------------------------------

function CartArea() {
  // TODO 3：写完 Context / Provider / useCart 后，在这里挂上你的布局
  return (
    <p className="hint">
      TODO 3：从这里开始写你的 CartContext —— 先写 createContext + useCart，
      再写 CartProvider，最后写 HeaderBadge / ProductList，用 CartLayout 串起来。
    </p>
  )
}

// ============================================================
// 展示区（不用改）
// ============================================================
export default function PracticeDay6() {
  return (
    <div>
      <h3>练习 1：状态提升（单价 × 数量）</h3>
      <PriceCalc />

      <h3>练习 2：Context 跨 3 层（登录状态）</h3>
      <UserProfileDemo />

      <h3>练习 3：自己写购物车 Context（挑战）</h3>
      <CartArea />
    </div>
  )
}

/* ============================================================
 * 参考答案
 * ============================================================
 *
 * 练习 1：
 *   function PriceCalc() {
 *     const [price, setPrice] = useState(10)
 *     const [qty, setQty] = useState(2)
 *     return (
 *       <div className="card">
 *         <PriceInput price={price} onChangePrice={setPrice} />
 *         <QtyInput qty={qty} onChangeQty={setQty} />
 *         <p>总价：<strong>{(price * qty).toFixed(2)}</strong></p>
 *       </div>
 *     )
 *   }
 *   ← 两个子组件都没变，变的只是"谁持有 state"。这就是状态提升。
 *
 * 练习 2：
 *   function useUser(): UserCtx {
 *     const ctx = useContext(UserContext)
 *     if (ctx === null) throw new Error('useUser 必须在 <UserProvider> 内部使用')
 *     return ctx
 *   }
 *
 *   function UserProvider({ children }: { children: React.ReactNode }) {
 *     const [user, setUser] = useState<User | null>(null)
 *     const login = () => setUser({ name: '小明', role: '前端实习生' })
 *     const logout = () => setUser(null)
 *     const value = useMemo<UserCtx>(() => ({ user, login, logout }), [user])
 *     return <UserContext.Provider value={value}>{children}</UserContext.Provider>
 *   }
 *
 *   function UserProfileDemo() {
 *     return (
 *       <UserProvider>
 *         <div style={{ color: '#999', fontSize: 12 }}>ProfileLayout（不许出现 user props）</div>
 *         <ProfileSection />
 *       </UserProvider>
 *     )
 *   }
 *   ← 注意 login / logout 每次渲染都是新函数，但 value 的依赖只写了 [user]，
 *     所以它们不会被"看见"。这是常见取舍：要么 useCallback 包，要么接受。
 *
 * 练习 3：
 *   type CartItem = { id: number; name: string; price: number; count: number }
 *   type CartCtx = {
 *     items: CartItem[]
 *     totalCount: number
 *     totalPrice: number
 *     addItem: (item: Omit<CartItem, 'count'>) => void
 *     removeItem: (id: number) => void
 *   }
 *   const CartContext = createContext<CartCtx | null>(null)
 *
 *   function useCart() {
 *     const ctx = useContext(CartContext)
 *     if (!ctx) throw new Error('useCart 必须在 <CartProvider> 内部使用')
 *     return ctx
 *   }
 *
 *   function CartProvider({ children }: { children: React.ReactNode }) {
 *     const [items, setItems] = useState<CartItem[]>([])
 *
 *     const addItem = useCallback((item: Omit<CartItem, 'count'>) => {
 *       setItems((prev) => {
 *         const exists = prev.some((x) => x.id === item.id)
 *         if (exists) {
 *           return prev.map((x) => (x.id === item.id ? { ...x, count: x.count + 1 } : x))
 *         }
 *         return [...prev, { ...item, count: 1 }]
 *       })
 *     }, [])
 *
 *     const removeItem = useCallback((id: number) => {
 *       setItems((prev) => prev.filter((x) => x.id !== id))
 *     }, [])
 *
 *     const value = useMemo<CartCtx>(() => {
 *       return {
 *         items,
 *         totalCount: items.reduce((s, x) => s + x.count, 0),
 *         totalPrice: items.reduce((s, x) => s + x.price * x.count, 0),
 *         addItem,
 *         removeItem,
 *       }
 *     }, [items, addItem, removeItem])
 *
 *     return <CartContext.Provider value={value}>{children}</CartContext.Provider>
 *   }
 *
 *   function CartLayout() {
 *     return (
 *       <div>
 *         <HeaderBadge />
 *         <ProductList />
 *       </div>
 *     )
 *   }
 *   function HeaderBadge() {
 *     const { totalCount, totalPrice } = useCart()
 *     return <p className="card">🛒 购物车 {totalCount} 件，共 {totalPrice} 元</p>
 *   }
 *   function ProductList() {
 *     const { addItem } = useCart()
 *     const products = [
 *       { id: 1, name: '键盘', price: 299 },
 *       { id: 2, name: '鼠标', price: 129 },
 *     ]
 *     return <>{products.map((p) => <ProductCard key={p.id} product={p} onAdd={addItem} />)}</>
 *   }
 *   function ProductCard({ product, onAdd }: { product: Omit<CartItem,'count'>; onAdd: (p: Omit<CartItem,'count'>) => void }) {
 *     return (
 *       <div className="card">
 *         {product.name} ¥{product.price}
 *         <button className="btn" onClick={() => onAdd(product)}>加入购物车</button>
 *       </div>
 *     )
 *   }
 *   function CartArea() {
 *     return (
 *       <CartProvider>
 *         <CartLayout />
 *       </CartProvider>
 *     )
 *   }
 *
 * 【三个自问，答不上来就是没会】
 * 1. 练习 3 里 HeaderBadge 和 ProductCard 相隔好几层，它们靠什么共享数据？
 *    答：同一个 Context 的 Provider —— 它们都在 Provider 子树内。
 *
 * 2. 为什么 addItem 里不能写成 items.push(...) 然后 setItems(items)？
 *    答：同一个数组引用，React 认为"没变"，不重新渲染（Day3 的不可变更新）。
 *
 * 3. 如果不用 useCallback 包 addItem 会怎样？
 *    答：不会报错，但每次 Provider 渲染都产生新函数 → value 变 → 所有消费者重新渲染。
 *        功能对、性能差 —— 这才是最难查的那类 bug。
 * ============================================================ */
