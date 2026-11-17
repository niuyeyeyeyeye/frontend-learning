// ============================================================
// Day11-1：Prettier 实配 + 一条真实的依赖冲突
// ============================================================
// 📖 本文件名字对照表
//   PrettierDemo  Prettier 演示（本页 /day11/prettier）
//   .prettierrc   配置文件（逐项见页内）
//   format        格式化并写入（会改文件）
//   format:check  只检查不改（CI 里用这个）
//   peerDependency 对等依赖：包声明"我需要哪个版本的宿主包"
//
// ⭐ Prettier 只干一件事：**排版**。它不懂代码质量，也不会告诉你"这里有 bug"。

export default function PrettierDemo() {
  return (
    <div>
      <div className='card'>
        <h3 style={{ marginTop: 0 }}>已经配好了，两个命令</h3>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`npm run format:check    # 只检查，不改文件（CI / 提交前用）
npm run format          # 真的格式化并写入（改文件）`}</pre>
        <p style={{ marginTop: 0 }}>
          配置在 <code>.prettierrc</code>：
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>配置项</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>含义</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>
                为什么这么设
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['semi: false', '不加分号', '跟你现有的代码风格一致'],
              ['singleQuote: true', '用单引号', '同上'],
              ['printWidth: 100', '超过 100 字符折行', '默认 80 太窄，JSX 会被折得很碎'],
              ['trailingComma: "all"', '对象/数组最后一项也加逗号', '以后加一行时 diff 只有一行'],
              ['arrowParens: "always"', '箭头函数单个参数也加括号', '加参数时 diff 更小'],
              [
                'endOfLine: "lf"',
                '强制 LF 换行',
                '**Windows 上必须设**，否则 git 里全是换行符噪音',
              ],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>
                  <code>{a}</code>
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{b}</td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  {c}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>⭐ 我实测了一件事：存量债务</h3>
        <p style={{ marginTop: 0 }}>
          刚配好我就跑了一次 <code>format:check</code>，结果是：
        </p>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`[warn] src/day9/03-竞态与取消.tsx
[warn] src/day9/04-练习.tsx
[warn] src/index.css
[warn] src/pages/Home.tsx
...
Code style issues found in 50 files. Run Prettier with --write to fix.`}</pre>
        <p>
          <strong>50 个文件不合规。</strong> 这就是"工程化第一天"的真实体验 ——
          不是"配好了就干净了"，而是<strong>先把你之前所有的债一次性暴露出来</strong>。
        </p>
        <p style={{ marginTop: 0 }}>
          你有两个选择，<strong>没有标准答案，取决于团队约定</strong>：
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>策略</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>做法</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>优缺点</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'A. 一次性格式化',
                'npm run format 然后单独一个 commit',
                '✅ 一次痛完，之后干净；<br />❌ diff 很大（50 个文件），review 不了，最好选在没人改代码的时候做',
              ],
              [
                'B. 只管新代码',
                '老文件不动，新写的文件保证合规',
                '✅ diff 干净；<br />❌ 债务永远在那，format:check 一直红着，久了就没人跑了',
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
                <td
                  style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}
                  dangerouslySetInnerHTML={{ __html: c }}
                />
              </tr>
            ))}
          </tbody>
        </table>
        <p className='hint' style={{ marginBottom: 0 }}>
          我的建议：<strong>这个项目选 A</strong>（它是学习项目，没有协作者，diff 大也无所谓）。
          真实工作里如果是个老项目，通常选 B + 定个"新代码必须合规"的规矩。
          <br />
          <strong>我没有替你执行 format</strong> —— 那会把你之前手写、已经读过的 50 个文件全改一遍，
          你可能反而认不出自己写的东西了。命令给你，什么时候跑由你决定。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>Prettier 和 ESLint 分工（别搞混）</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}></th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>Prettier</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>ESLint</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['管什么', '排版（空格、引号、换行）', '质量（可疑写法、潜在 bug）'],
              ['会不会改代码语义', '❌ 永远不会', '✅ 经常建议你改逻辑'],
              ['能不能自动修', '✅ 全部自动', '部分自动（--fix）'],
              ['典型规则', 'printWidth、singleQuote', 'hook 依赖数组、未使用变量、== vs ==='],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{a}</td>
                <td
                  style={{
                    padding: '4px 8px',
                    borderBottom: '1px solid #f6f8fa',
                    color: '#57606a',
                  }}
                >
                  {b}
                </td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='hint' style={{ marginBottom: 0 }}>
          一句话：<strong>Prettier 管"好不好看"，ESLint 管"对不对"。</strong>
          两个都要，但不要用 ESLint 管格式（那是历史包袱，会让配置变得极其复杂）。
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>⭐ 今天的真事：ESLint 装不上，以及为什么</h3>
        <p style={{ marginTop: 0 }}>我按计划执行了这条命令：</p>
        <pre
          style={{
            background: '#f6f8fa',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`npm install -D eslint typescript-eslint eslint-plugin-react-hooks ...

npm error code ERESOLVE
npm error Found: typescript@7.0.2
npm error Could not resolve dependency:
npm error peer typescript@">=4.8.4 <6.1.0" from typescript-eslint@8.73.0`}</pre>
        <p>
          <strong>翻译一下：</strong>
          <code>typescript-eslint</code> 声明了"我需要 TypeScript 4.8.4 到 6.1.0
          之间"，而本项目用的是 <strong>TypeScript 7.0.2</strong> —— 版本超出范围，npm
          拒绝安装。这就是 <strong>peerDependencies（对等依赖）</strong>在起作用。
        </p>
        <p>
          我不死心，硬装了一次（<code>--legacy-peer-deps</code> 跳过检查），结果运行直接报错：
        </p>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`$ npx eslint src/day1/01-JSX基础.tsx
typescript-eslint does not support TS 7.0.
Please see https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
  to run typescript-eslint using the TS 6 API.`}</pre>
        <p style={{ marginTop: 0 }}>
          然后我又试了"不用 typescript-eslint，让 ESLint 自己解析 TS"：
        </p>
        <pre
          style={{
            background: '#fff5f5',
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            overflowX: 'auto',
            margin: '8px 0',
          }}
        >{`$ npx eslint src/_probe_ts.ts
1:6  error  Parsing error: Unexpected token A

$ npx eslint src/_probe_tsx.tsx
1:17 error  Parsing error: Unexpected token :`}</pre>
        <p style={{ marginTop: 0 }}>
          <strong>结论：ESLint 自己不认识 TS 语法</strong>（<code>type A = ...</code> 和
          <code>{'{ x: number }'}</code> 都解析不了）。所以我把它卸掉了 ——
          不给你留一个装不上、跑不了的坑。
        </p>

        <h4 style={{ marginBottom: 6 }}>三条解法，各自的代价</h4>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#57606a' }}>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>解法</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>怎么做</th>
              <th style={{ padding: '4px 8px', borderBottom: '1px solid #eaeef2' }}>代价</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                '① 等支持',
                '等 typescript-eslint 发布支持 TS7 的版本',
                '最稳，但不知道等到什么时候',
              ],
              [
                '② 降 TypeScript 到 6.x',
                'npm i -D typescript@6，让两者兼容',
                '要验证整个项目在 TS6 下仍然编译通过，可能踩别的坑',
              ],
              [
                '③ 暂时不用 ESLint',
                '只用 Prettier + tsc --noEmit',
                '**拿不到 hook 依赖检查这类价值最高的规则** —— 但你 Day10 已经知道那些坑，能手动避开',
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
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #f6f8fa' }}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='hint' style={{ marginBottom: 0 }}>
          我选了 <strong>③</strong>，因为你的 TypeScript 7 是项目基础（我所有验证都依赖它的 CLI），
          为装 lint 把编译器降级不划算。等哪天 typescript-eslint 支持了，装回来只要几分钟。
          <br />
          <strong>
            这就是工程化里最常见的一类决策：不是"哪个最好"，而是"当前约束下哪个代价最小"。
          </strong>
        </p>
      </div>

      <div className='card'>
        <h3 style={{ marginTop: 0 }}>⚠️ 关于 --legacy-peer-deps</h3>
        <p style={{ marginTop: 0 }}>
          它能让你"装上去"，但<strong>只是让 npm 闭嘴，不解决不兼容</strong>。上面的报错就是证据：
          装成功了，一跑就崩。
        </p>
        <p className='hint' style={{ marginBottom: 0 }}>
          所以看到有人用 <code>--legacy-peer-deps</code> / <code>--force</code>
          解决安装问题时，要问一句：<strong>装完之后它真的能跑吗？</strong>
          这两个参数适合"临时排查"，不适合写进文档让大家照抄。
        </p>
      </div>
    </div>
  )
}
