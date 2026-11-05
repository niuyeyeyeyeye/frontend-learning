// ============================================================
// router.tsx：整个应用的路由表（唯一的"地址 ↔ 组件"对照表）
// ============================================================
// 📖 本文件名字对照表
//   routes        路由表（一个数组，描述"什么地址渲染什么组件"）
//   RouteObject   路由项目的类型
//   path          地址（不带前导斜杠的是**相对父路由**的子地址）
//   index: true   索引路由（父路径本身就是它）
//   element       这个地址渲染哪个组件
//   children      子路由（父组件的 <Outlet /> 里出）
//
// ⭐ 只需要记这一条：**加一个页面 = 加一个组件文件 + 在这个数组里加一条**。
//    不用改任何已有页面的代码。

import type { RouteObject } from 'react-router-dom'

import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import About from './pages/About'
import Archive from './pages/Archive'
import NotFound from './pages/NotFound'

import Day7Layout from './day7/Layout'
import Day7Overview from './day7/00-概览'
import RouteBasics from './day7/01-路由基础与Link'
import UsersList, { UserDetail } from './day7/02-动态路由与useParams'
import NavigateDemo from './day7/03-编程式导航与URL状态'
import SettingsLayout, {
  SettingsIndex,
  SettingsProfile,
  SettingsSecurity,
} from './day7/04-嵌套路由与Outlet'
import PracticeDay7, { ArticleList, ArticleDetail } from './day7/05-练习'

import Day8Layout from './day8/Layout'
import WhyZustand from './day8/00-为什么需要Zustand'
import ZustandBasics from './day8/01-zustand基础'
import SelectorDemo from './day8/02-选择性订阅'
import TodoWithZustand from './day8/03-实战-用Zustand重写待办'
import PracticeDay8 from './day8/04-练习'

export const routes: RouteObject[] = [
  {
    path: '/',
    // ⭐ 所有页面都套在 RootLayout 里，所以它必须有 <Outlet />
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> }, //  /            → 首页
      { path: 'about', element: <About /> }, //  /about       → 关于（练习 1）
      { path: 'archive', element: <Archive /> }, //  /archive     → Day1~6 归档

      {
        path: 'day7',
        element: <Day7Layout />,
        children: [
          { index: true, element: <Day7Overview /> }, //  /day7
          { path: 'basics', element: <RouteBasics /> }, //  /day7/basics
          { path: 'users', element: <UsersList /> }, //  /day7/users
          { path: 'users/:id', element: <UserDetail /> }, //  /day7/users/:id  ← 冒号 = 变量
          { path: 'navigate', element: <NavigateDemo /> }, //  /day7/navigate
          {
            path: 'nested', // 第三层嵌套
            element: <SettingsLayout />,
            children: [
              { index: true, element: <SettingsIndex /> }, //  /day7/nested
              { path: 'profile', element: <SettingsProfile /> }, //  /day7/nested/profile
              { path: 'security', element: <SettingsSecurity /> }, //  /day7/nested/security
            ],
          },
          { path: 'articles', element: <ArticleList /> }, //  /day7/articles（练习 2/3）
          { path: 'articles/:id', element: <ArticleDetail /> }, //  /day7/articles/:id
          { path: 'practice', element: <PracticeDay7 /> }, //  /day7/practice
        ],
      },

      {
        path: 'day8',
        element: <Day8Layout />,
        children: [
          { index: true, element: <WhyZustand /> }, //  /day8
          { path: 'basics', element: <ZustandBasics /> }, //  /day8/basics
          { path: 'selector', element: <SelectorDemo /> }, //  /day8/selector
          { path: 'todo', element: <TodoWithZustand /> }, //  /day8/todo
          { path: 'practice', element: <PracticeDay8 /> }, //  /day8/practice
        ],
      },

      // ⭐ 兜底：所有没匹配上的地址都来这里。**必须放最后一条**
      { path: '*', element: <NotFound /> },
    ],
  },
]

/* ============================================================
 * 三条配置规则
 * ============================================================
 * 1. 子路由的 path **不要加前导斜杠**
 *      写 'users/:id' → 完整地址 /day7/users/:id
 *      写 '/users/:id' → 完整地址 /users/:id（父层白套了）
 *
 * 2. 父路由的组件里必须有 <Outlet />，否则子路由"没地方显示"
 *      表现：地址对了，页面只有外壳、内容是空的
 *
 * 3. 兜底路由 '*' 放最后（React Router 按匹配度选，放哪都行，
 *    但放最后是人读代码时的习惯，别跟直觉对着干）
 *
 * 想让某个地址重定向？加一条：
 *      { path: 'old-path', element: <Navigate to="/new-path" replace /> }
 * ============================================================ */
