// ============================================================
// Day11-0：工程化到底解决什么问题（先看痛点，再看工具）
// ============================================================
// 📖 本文件名字对照表
//   EngineeringIntro  工程化概览（本页 /day11）
//   Prettier          代码格式化工具（风格）      → 今天已配好，能跑
//   ESLint            代码检查工具（质量）        → 今天**装不上**，原因见第 2 节
//   import.meta.env   环境变量                    → 第 3 节
//   npm run build     构建                        → 第 4 节
//
// ⭐ 一句话：**工程化的目的，是把"靠人记着去做的事"变成"机器一定会做"。**

import { Link } from 'react-router-dom'

export default function EngineeringIntro() {
  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>三个痛点，你现在每天都在经历</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>痛点</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>具体表现</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>工具</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                '风格不一致',
                '有人写分号有人不写、缩进 2/4 空格混用 → 每次 review 都在吵格式',
                'Prettier',
              ],
              [
                '低级错误靠肉眼',
                '依赖数组写漏、忘了 return、用了 var → 只能靠"你仔细看看"',
                'ESLint',
              ],
              ['环境不同行为不同', '本地接口是 localhost，线上是 /api → 硬编码就炸', '环境变量'],
              [
                '不知道怎么上线',
                '项目在自己电脑上能跑，别人打不开 → 简历上没有链接',
                '构建 + 部署',
              ],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {a}
                </td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  {b}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <strong>{c}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>⭐ 核心认知：机器能做的事，别靠人记</h3>
        <p style={{ marginTop: 0 }}>你可能觉得"格式不一致"是小问题。但在团队里它很贵：</p>
        <ul style={{ margin: '0 0 8px', paddingLeft: 20, lineHeight: 1.9 }}>
          <li>两个人同时改一个文件 → diff 里一半是格式变化 → **review 的人看不出真实改动**</li>
          <li>每次 code review 都要讨论"这里该不该换行" → **浪费时间且伤感情**</li>
          <li>新人入职第一天就要学"我们这儿怎么排版" → **完全没必要学的知识**</li>
        </ul>
        <p className="hint" style={{ marginBottom: 0 }}>
          所以工程化的原则是：<strong>凡是能写成规则的，就不要写进"注意事项"。</strong>
          人只负责做机器判断不了的事（比如"这个抽象合不合理"）。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天的实际交付（诚实版）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>工具</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>状态</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>命令</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Prettier', '✅ 装好、配好、能跑', 'npm run format / format:check'],
              ['ESLint', '❌ 装不上（TS 7 不兼容），详见第 2 节', '——'],
              ['类型检查', '✅ 一直都在用', 'npm run check（tsc --noEmit）'],
              ['环境变量', '✅ .env.example 已建', '第 3 节'],
              ['构建', '✅ 脚本已就绪（我这边跑不了，你本地跑）', 'npm run build / preview'],
              ['部署', '✅ vercel.json 已建', '第 4 节'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  <code>{c}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint" style={{ marginBottom: 0 }}>
          <strong>ESLint 没装成不是偷懒</strong> —— 是遇到了真实的版本冲突。
          那一段反而是今天最值钱的内容，面试问"你踩过什么工程化问题"时可以直接讲。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>今天的路线</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>
            <Link to="/day11/prettier">1. Prettier 与那条真实的依赖冲突</Link>
          </li>
          <li>
            <Link to="/day11/env">2. 环境变量</Link> —— 为什么密钥绝不能放前端
          </li>
          <li>
            <Link to="/day11/deploy">3. 构建与部署</Link> —— 刷新页面 404 的坑
          </li>
          <li>
            <Link to="/day11/practice">练习</Link>
          </li>
        </ol>
      </div>
    </div>
  )
}
