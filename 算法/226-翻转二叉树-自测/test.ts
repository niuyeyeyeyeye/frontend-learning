// 用你的迭代解跑几组树，验证是不是真的对（不是碰巧过）
class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

// ============ 你的解法（原样，只把全角符号修正了） ============
function invertTree(root: TreeNode | null): TreeNode | null {
  const stack: TreeNode[] = []
  let t: TreeNode | null = null
  let node: TreeNode | null = root
  while (node || stack.length) {
    while (node) {
      stack.push(node)
      node = node.left
    }
    node = stack.pop()!
    t = node.left
    node.left = node.right
    node.right = t
    node = node.left
  }
  return root
}

// ============ 标准解 1：递归 ============
function invertRecursive(root: TreeNode | null): TreeNode | null {
  if (root === null) return null
  const left = invertRecursive(root.left)
  const right = invertRecursive(root.right)
  root.left = right
  root.right = left
  return root
}

// ============ 标准解 2：BFS 迭代（思路直白） ============
function invertBFS(root: TreeNode | null): TreeNode | null {
  if (root === null) return null
  const queue: TreeNode[] = [root]
  while (queue.length > 0) {
    const node = queue.shift()!
    ;[node.left, node.right] = [node.right, node.left]
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }
  return root
}

// ---------- 工具 ----------
const build = (v: (number | null)[]): TreeNode | null => {
  if (v.length === 0 || v[0] === null) return null
  const root = new TreeNode(v[0])
  const q: TreeNode[] = [root]
  let i = 1
  while (q.length > 0 && i < v.length) {
    const cur = q.shift()!
    if (v[i] !== null && v[i] !== undefined) {
      cur.left = new TreeNode(v[i] as number)
      q.push(cur.left)
    }
    i++
    if (v[i] !== null && v[i] !== undefined) {
      cur.right = new TreeNode(v[i] as number)
      q.push(cur.right)
    }
    i++
  }
  return root
}

const layer = (root: TreeNode | null): (number | null)[] => {
  if (!root) return []
  const out: (number | null)[] = []
  const q: (TreeNode | null)[] = [root]
  while (q.length > 0) {
    const n = q.shift()!
    if (n === null) {
      out.push(null)
      continue
    }
    out.push(n.val)
    q.push(n.left)
    q.push(n.right)
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop()
  return out
}

const CASES: [string, (number | null)[], (number | null)[]][] = [
  ['空树', [], []],
  ['单节点', [1], [1]],
  ['两层', [2, 1, 3], [2, 3, 1]],
  ['满二叉树', [4, 2, 7, 1, 3, 6, 9], [4, 7, 2, 9, 6, 3, 1]],
  ['只有左链', [1, 2, null, 3], [1, null, 2, null, 3]],
  ['不平衡', [1, 2, 3, 4, null, null, 5, 6], [1, 3, 2, 5, null, null, 4, null, null, null, 6]],
]

const eq = (a: (number | null)[], b: (number | null)[]) => JSON.stringify(a) === JSON.stringify(b)

console.log('用例'.padEnd(12) + '你的迭代'.padEnd(12) + '递归'.padEnd(10) + 'BFS')
console.log('-'.repeat(46))
let passYours = 0
for (const [name, input, expect] of CASES) {
  const a = layer(invertTree(build(input)))
  const b = layer(invertRecursive(build(input)))
  const c = layer(invertBFS(build(input)))
  const okA = eq(a, expect)
  const okB = eq(b, expect)
  const okC = eq(c, expect)
  if (okA) passYours++
  console.log(
    name.padEnd(12) +
      (okA ? '✅' : '❌') + String(a).padEnd(30) +
      (okB ? '✅' : '❌') +
      (okC ? '  ✅' : '  ❌'),
  )
  if (!okA) console.log('   期望:', JSON.stringify(expect), ' 实际:', JSON.stringify(a))
}
console.log('-'.repeat(46))
console.log(`你的迭代通过 ${passYours}/${CASES.length}`)
