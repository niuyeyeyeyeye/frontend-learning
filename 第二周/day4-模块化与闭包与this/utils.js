// ========================================
// utils.js —— 一个"模块"文件
// 模块 = 一个独立的 js 文件：内部变量不污染全局，
//        只有被 export 的东西，别的文件才能 import
// ========================================

// ---------- 1. 具名导出（named export）----------
export const PI = 3.14159

export function add(a, b) {
  return a + b
}

export function discount(price,rate){
  return '￥'+ (price*rate).toFixed(2)
}

export function formatPrice(num) {
  return '¥' + num.toFixed(2)   // toFixed(2) 保留两位小数
}

// 先定义、再统一导出，效果和上面一样
function multiply(a, b) {
  return a * b
}

function subtract(a, b) {
  return a - b
}

export { multiply, subtract }

// ---------- 2. 默认导出（default export）----------
// 一个模块只能有 1 个 default，import 时名字随便起
export default function log(msg) {
  console.log('[日志]', msg)
}

// ---------- 3. 没导出的东西，外部拿不到 ----------
const secret = '我是模块私有变量，外面 import 不到'
// 想让外部用，就 export 出去：
// export { secret }

// 想验证的话可以在这里打印一下
log('utils.js 被加载了（只会加载一次）')
