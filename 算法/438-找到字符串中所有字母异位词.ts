/**
 * 438. 找到字符串中所有字母异位词 · 中等 · 滑动窗口
 * https://leetcode.cn/problems/find-all-anagrams-in-a-string/
 *
 * 检查类型：
 *   cd D:\前端学习\第三阶段-TypeScript
 *   npx tsc --ignoreConfig --strict --noEmit ..\算法\438-找到字符串中所有字母异位词.ts
 */

/* ============================================================
 * 一、我原来的解法（逻辑正确，但会 TLE）
 * ------------------------------------------------------------
 * 实测：300 组随机数据 + 暴力解交叉验证 → 结果完全一致 ✅
 *       所以**逻辑没问题，问题在复杂度**。
 *
 * 复杂度：O((n - m) × m)     n = s.length, m = p.length
 *   外层 while：left 每轮 +1，约 (n - m) 轮
 *   内层 for  ：每轮把整个窗口重扫一遍，m 次
 *   最坏情况 m = n/2 → 约 n²/4 次操作
 *
 * 力扣限制 n、m ≤ 3×10⁴：n = 3×10⁴、m = 1.5×10⁴ 时约 3 秒 → TLE
 *
 * 根本问题（一句话）：
 *   **每滑动一步，都 clear() 后重建整个窗口的计数** ——
 *   而窗口从 [i, i+m-1] 移到 [i+1, i+m]，其实只变了 2 个字符：
 *   进来一个新的、出去一个旧的。没必要重算 m 个。
 * ============================================================ */
export function findAnagramsMine(s: string, p: string): number[] {
  const mapP = new Map<string, number>()
  const mapS = new Map<string, number>()
  let left = 0
  let right = left + p.length - 1
  const result: number[] = []

  function isSame(): boolean {
    if (mapP.size !== mapS.size) return false
    for (const [key, value] of mapS) {
      if (value !== mapP.get(key)) return false
    }
    return true
  }

  for (let i = 0; i < p.length; i++) {
    mapP.set(p[i], (mapP.get(p[i]) || 0) + 1)
  }

  while (right < s.length) {
    if (!mapP.has(s[left])) {
      left++
      right++
      continue
    }
    for (right = left; right - left < p.length; right++) {
      if (!mapP.has(s[right])) {
        mapS.clear()
        break
      }
      mapS.set(s[right], (mapS.get(s[right]) || 0) + 1)
    }
    if (isSame()) result.push(left)
    mapS.clear()
    left++
  }
  return result
}

/* ============================================================
 * 二、优化版 A：固定长度滑动窗口（推荐，最好理解）
 * ------------------------------------------------------------
 * 核心思路：
 *   ① 先统计 p 的字母计数 → need[26]
 *   ② 用一个长度正好为 m 的窗口，统计 s 的字母计数 → win[26]
 *   ③ 窗口整体右移一格：**新字符 +1、旧字符 -1**（只改 2 个位置）
 *   ④ 每步比较 need 和 win 是否相同
 *
 * 复杂度：O(n × 26) = **O(n)**（26 是常数，所以是线性的）
 * 空间：O(26) = O(1)（只有两个固定长度数组）
 *
 * 为什么快：**增量更新** —— 窗口移动时不重算，只修补变化的那两个字符。
 * ============================================================ */
export function findAnagrams(s: string, p: string): number[] {
  const n = s.length
  const m = p.length
  const result: number[] = []
  if (n < m) return result                    // p 比 s 还长，不可能有异位词

  const A = 'a'.charCodeAt(0)
  const need: number[] = new Array(26).fill(0)   // p 里每个字母的个数
  const win: number[] = new Array(26).fill(0)    // 当前窗口里每个字母的个数

  // ① 初始化：把 p 和前 m 个字符都统计好
  for (let i = 0; i < m; i++) {
    need[p.charCodeAt(i) - A]++
    win[s.charCodeAt(i) - A]++
  }
  if (sameArray(need, win)) result.push(0)

  // ② 窗口整体右移
  for (let i = m; i < n; i++) {
    win[s.charCodeAt(i) - A]++            // 右边进来一个字符
    win[s.charCodeAt(i - m) - A]--        // 左边出去一个字符
    if (sameArray(need, win)) result.push(i - m + 1)
  }
  return result
}

function sameArray(a: number[], b: number[]): boolean {
  for (let i = 0; i < 26; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/* ============================================================
 * 三、优化版 B：差异计数器 diff（面试加分项）
 * ------------------------------------------------------------
 * 优化版 A 每步还要比 26 个字母。这里再省一步：
 *   只维护一个 count 数组 = (p 的计数) - (窗口的计数)，
 *   再用一个整数 diff 记录"count 里有几个位置不为 0"。
 *   diff === 0 就说明窗口是 p 的异位词。
 *
 * 复杂度：**O(n)**，没有内层 26 次比较
 * 更新规则（关键）：
 *   加入字符 x：count[x] 减 1（0 → 非0 则 diff++；变成 0 则 diff--）
 *   移出字符 y：count[y] 加 1（同上）
 * ============================================================ */
export function findAnagramsDiff(s: string, p: string): number[] {
  const n = s.length
  const m = p.length
  const result: number[] = []
  if (n < m) return result

  const A = 'a'.charCodeAt(0)
  const count: number[] = new Array(26).fill(0)

  for (let i = 0; i < m; i++) {
    count[p.charCodeAt(i) - A]++
    count[s.charCodeAt(i) - A]--
  }

  let diff = 0
  for (let i = 0; i < 26; i++) if (count[i] !== 0) diff++
  if (diff === 0) result.push(0)

  for (let i = m; i < n; i++) {
    let idx = s.charCodeAt(i) - A          // 新进入窗口的字符
    if (count[idx] === 0) diff++
    count[idx]--
    if (count[idx] === 0) diff--

    idx = s.charCodeAt(i - m) - A          // 离开窗口的字符
    if (count[idx] === 0) diff++
    count[idx]++
    if (count[idx] === 0) diff--

    if (diff === 0) result.push(i - m + 1)
  }
  return result
}

/* ============================================================
 * 四、实测数据（本机跑出来的）
 * ------------------------------------------------------------
 * 最坏情况：m = n/2，且所有字符相同（窗口永远不会提前 break）
 *
 *   n=2000 m=1000:   我的版 16.8ms   |  窗口版 0.04ms   → 慢 430 倍
 *   n=4000 m=2000:   我的版 58.0ms   |  窗口版 0.07ms   → 慢 861 倍
 *   n=6000 m=3000:   我的版 120.8ms  |  窗口版 0.10ms   → 慢 1208 倍
 *
 *   推算到力扣数据量（n=3×10⁴, m=1.5×10⁴）：
 *     我的版  约 3.1 秒   → TLE ❌
 *     窗口版  约 0.0005 秒 → 通过 ✅
 * ============================================================ */

/* ============================================================
 * 五、这道题我该记住的三件事
 * ------------------------------------------------------------
 * ① **滑动窗口的精髓是增量更新，不是重新计算**
 *    窗口移动时只有两个字符变化：进来的和出去的。凡是"每步重建窗口"的写法
 *    都是 O(n·m)，必然 TLE。
 *
 * ② **看题先看 n 的范围**（n ≤ 3×10⁴ → 只能 O(n) 或 O(n log n)）
 *    这道题一看到 3×10⁴，就该排除任何带"每步重扫窗口"的方案。
 *
 * ③ **Map 的常数很大**
 *    即使同样是 O(n)，用 26 长度的数组也比 Map 快好几倍（数字下标 vs 字符串哈希）。
 *    字母题（固定小字符集）优先用数组，不要用 Map。
 *
 * 【另外：这题还有一个"看起来能做但会 TLE"的思路】
 *   每个位置取长度 m 的子串，排序后和 p 的排序结果比较
 *   → 复杂度 O((n - m) × m log m)，比我的版本还慢，同样 TLE。
 * ============================================================ */

/* ============================================================
 * 六、TypeScript 小知识点（做这道题顺手学到的）
 * ------------------------------------------------------------
 * `new Array(26).fill(0)` 在 TS 里推断出来是 any[]，
 * 所以要显式标注类型：`const need: number[] = new Array(26).fill(0)`
 * —— 不标注虽然不报错，但会丢掉类型保护（any[] = 关掉了检查）。
 * ============================================================ */
