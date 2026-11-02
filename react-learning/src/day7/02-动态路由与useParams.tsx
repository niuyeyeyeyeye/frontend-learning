// ============================================================
// Day7-2：动态路由 —— 一个组件，服务无数个 id
// ============================================================
// 📖 本文件名字对照表
//   UsersList     用户列表页（地址 /day7/users）
//   UserDetail    用户详情页（地址 /day7/users/:id）
//   useParams     取路由里的动态参数（这里是 { id: '2' }）
//   params        参数对象（注意：**值永远是字符串**，'2' 不是 2）
//   USERS         用户数据（常量）
//
// ⭐ 核心认知：`/day7/users/2` 和 `/day7/users/3` 用的是**同一个组件**，
//    只是 useParams() 拿到的东西不同。这就是动态路由的价值：
//    不用为每个用户写一个页面。

import { Link, useParams } from 'react-router-dom'

type User = {
  id: number
  name: string
  role: string
  city: string
  skills: string[]
}

const USERS: User[] = [
  { id: 1, name: '小明', role: '前端实习生', city: '杭州', skills: ['React', 'TS'] },
  { id: 2, name: '小红', role: '后端工程师', city: '北京', skills: ['Java', 'MySQL'] },
  { id: 3, name: '小刚', role: '产品经理', city: '深圳', skills: ['需求', '原型'] },
]

// ============================================================
// 列表页：每一条都是一个链接，指向动态路由
// ============================================================
export default function UsersList() {
  return (
    <div>
      <h2>用户列表</h2>
      <p className="hint" style={{ marginTop: 0 }}>
        👆 点任意一个人进详情。注意地址从 <code>/day7/users</code> 变成了{' '}
        <code>/day7/users/2</code> —— 页面没刷新。
      </p>

      <div className="card">
        {USERS.map((u) => (
          // ⭐ to 里用模板字符串把 id 拼进地址
          <div key={u.id} style={{ padding: '6px 0', borderBottom: '1px solid #f6f8fa' }}>
            <Link to={`/day7/users/${u.id}`}>
              {u.name}
            </Link>
            <span style={{ color: '#8b949e', marginLeft: 8, fontSize: 13 }}>
              {u.role} · {u.city}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>手写地址也试试</h3>
        <p>
          <Link to="/day7/users/1">/day7/users/1</Link>
          {'　'}
          <Link to="/day7/users/2">/day7/users/2</Link>
          {'　'}
          <Link to="/day7/users/999">/day7/users/999（不存在的 id）</Link>
        </p>
        <p className="hint">
          直接在地址栏改数字回车也行 —— 因为地址是"真"的，不是内存里藏着的状态。
          这就是"URL 是数据源"的好处：能收藏、能分享、刷新不丢。
        </p>
      </div>
    </div>
  )
}

// ============================================================
// 详情页：用 useParams 取出 id
// ============================================================
export function UserDetail() {
  // ⚠️ useParams 里的值一定是 string！即使路由写成 /users/:id
  const params = useParams()
  const rawId = params.id

  // 传进来的地址可能是垃圾（手改地址栏），必须做"找不到"的处理
  const user = rawId === undefined ? undefined : USERS.find((u) => String(u.id) === rawId)

  if (user === undefined) {
    return (
      <div>
        <h2>用户详情</h2>
        <div className="card">
          <p>
            找不到 id 为 <code>{String(rawId)}</code> 的用户。
          </p>
          <p className="hint">
            这是个常见场景：用户手改地址栏。真实项目里这里应该显示"没有这个资源"，
            而不是让页面白屏。
          </p>
          <Link className="btn" to="/day7/users">
            回列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>用户详情</h2>
      <div className="card">
        <p style={{ marginTop: 0 }}>
          <strong style={{ fontSize: 18 }}>{user.name}</strong>
          <span style={{ color: '#8b949e', marginLeft: 8 }}>(id = {user.id})</span>
        </p>
        <p>
          角色：{user.role}　城市：{user.city}
        </p>
        <p>
          技能：
          {user.skills.map((s) => (
            <span key={s} className="tag" style={{ marginRight: 6 }}>
              {s}
            </span>
          ))}
        </p>
        <p className="hint">
          URL 里 id = <code>{rawId}</code>，类型是 <code>string</code>；
          我用 <code>String(u.id) === rawId</code> 来比较，就是因为一个是字符串一个是数字。
          （用 <code>Number(rawId)</code> 转成数字再比也行，但 <code>'='</code> 这种脏数据会变成 NaN。）
        </p>
        <Link className="btn-ghost" to="/day7/users">
          ← 回列表
        </Link>
      </div>
    </div>
  )
}

/* ============================================================
 * 两个必须记住的坑
 * ============================================================
 * 坑 1：useParams 拿到的永远是字符串
 *   `/users/2` → { id: '2' }，不是 { id: 2 }
 *   → 要和数字比较就 String() 或 Number()，别直接 ===
 *
 * 坑 2：参数变了，组件**不会**重新挂载，只会重新渲染
 *   从 /users/1 点到 /users/2，是同一个 UserDetail 组件，
 *   只是 useParams() 的返回值变了 → 靠"渲染时的计算"拿到新数据是安全的；
 *   但如果你在 useEffect(..., []) 里请求过一次数据，切到 /users/2 时**不会再请求**！
 *   正确写法：依赖数组里写 [rawId]，让它跟着参数重新请求。
 *   （这是面试高频题，第 9 天做请求时会再遇到）
 * ============================================================ */
