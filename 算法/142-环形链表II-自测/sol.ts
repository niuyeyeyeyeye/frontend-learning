// ---------- 环境：按注释里的 ListNode 定义 ----------
class ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val
    this.next = next === undefined ? null : next
  }
}

// ---------- A. 用户的代码（原样，只加了类型标注的注释） ----------
function detectCycle_yours(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return null
  let fast: ListNode | null = head.next.next
  let slow: ListNode | null = head.next

  while (slow !== fast && fast !== null) {
    slow = slow!.next
    fast = fast.next
    if (fast === null) return null
    fast = fast.next
  }

  if (fast === null) return null

  return fast.next
}

// ---------- B. 标准答案（两阶段） ----------
function detectCycle_correct(head: ListNode | null): ListNode | null {
  let slow = head
  let fast = head
  // 阶段一：找相遇点
  while (fast !== null && fast.next !== null) {
    slow = slow!.next
    fast = fast.next.next
    if (slow === fast) {
      // 阶段二：一个回到头，两个同速走，相遇处就是入口
      let p1 = head
      let p2 = slow
      while (p1 !== p2) {
        p1 = p1!.next
        p2 = p2!.next
      }
      return p1
    }
  }
  return null
}

// ---------- C. 构造链表 [3,2,0,-4] + pos=1 这种输入 ----------
function build(vals: number[], pos: number): ListNode | null {
  if (vals.length === 0) return null
  const nodes = vals.map((v) => new ListNode(v))
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1]
  if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos] // 尾巴指回 pos → 成环
  return nodes[0]
}

const cases: Array<{ name: string; vals: number[]; pos: number; expect: number | null }> = [
  { name: '[3,2,0,-4] pos=1', vals: [3, 2, 0, -4], pos: 1, expect: 2 },
  { name: '[1,2] pos=0', vals: [1, 2], pos: 0, expect: 1 },
  { name: '[1] pos=0（自环）', vals: [1], pos: 0, expect: 1 },
  { name: '[1] pos=-1', vals: [1], pos: -1, expect: null },
  { name: '[] pos=-1', vals: [], pos: -1, expect: null },
  { name: '[1,2,3] pos=-1（无环）', vals: [1, 2, 3], pos: -1, expect: null },
  { name: '[1,2,3,4] pos=0（入口在头）', vals: [1, 2, 3, 4], pos: 0, expect: 1 },
  { name: '[1,2,3,4] pos=3（尾巴自环）', vals: [1, 2, 3, 4], pos: 3, expect: 4 },
]

const run = (fn: (h: ListNode | null) => ListNode | null, vals: number[], pos: number) => {
  const r = fn(build(vals, pos))
  return r === null ? null : r.val
}

console.log('用例'.padEnd(26) + '期望'.padEnd(8) + '你的'.padEnd(10) + '标准答案')
console.log('-'.repeat(62))
let yourPass = 0
let correctPass = 0
for (const c of cases) {
  const y = run(detectCycle_yours, c.vals, c.pos)
  const k = run(detectCycle_correct, c.vals, c.pos)
  const okY = y === c.expect
  const okK = k === c.expect
  if (okY) yourPass++
  if (okK) correctPass++
  console.log(
    c.name.padEnd(26) +
      String(c.expect).padEnd(8) +
      (okY ? '✅ ' : '❌ ') + String(y).padEnd(7) +
      (okK ? '✅ ' : '❌ ') + String(k),
  )
}
console.log('-'.repeat(62))
console.log(`你的通过 ${yourPass}/${cases.length}　标准答案通过 ${correctPass}/${cases.length}`)
