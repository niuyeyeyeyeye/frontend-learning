// ========================================
// main.js —— 入口模块：负责 import 别人 + 操作页面
// import 必须写在文件最上方（会被提升）
// ========================================

// 默认导出 + 具名导出，可以一次性导入（默认导出写在前面）
import log, { add, multiply, subtract, formatPrice, PI, discount} from './utils.js'

// 整体导入（命名空间导入）：用 utils.xxx 调用
import * as utils from './utils.js'

// 改名导入：避免重名冲突
import { add as plus } from './utils.js'

// ---------- 开始使用这些函数 ----------
log('main.js 开始执行 ✅')
log('add(2, 3) = ' + add(2, 3))
log('plus(10, 5) = ' + plus(10, 5))            // 同一个函数的另一个名字
log('multiply(4, 5) = ' + multiply(4, 5))
log('utils.subtract(10, 4) = ' + utils.subtract(10, 4))
log('formatPrice(1999.5) = ' + formatPrice(1999.5))
log('PI = ' + PI)

// 用模块里的函数做点实际的事：渲染一个购物车
const cart = [
  { name: '机械键盘', price: 299, count: 1 },
  { name: '显示器', price: 1299, count: 2 },
  { name: '鼠标垫', price: 39, count: 3 },
]

function renderCart() {
  // reduce 求总价（复习第一周）
  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0)

  const box = document.querySelector('#cart')
  box.innerHTML = cart
    .map(item => `<li>${item.name} × ${item.count} —— ${formatPrice(item.price * item.count)}</li>`)
    .join('')
  box.innerHTML += `<li class="total">合计：${discount(total,0.8)}</li>`

  log('购物车渲染完成，合计 ' + formatPrice(total))
}

renderCart()
