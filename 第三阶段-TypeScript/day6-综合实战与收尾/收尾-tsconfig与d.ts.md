# Day6 收尾：tsconfig 常用选项 + `.d.ts` 是什么

> 今天最后一块拼图。这两样东西**面试会被问到**，而且是你进 React 阶段后每天都要打交道的。

---

## 一、tsconfig.json 到底在配什么

你现在这个文件长这样：

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "outDir": "dist",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "**/报错示例.ts"]
}
```

### 常用选项速查

| 选项 | 作用 | 你现在的值 |
|---|---|---|
| **`target`** | 编译成哪个版本的 JS | `ES2020`（够新，语法不用降级太多） |
| **`module`** | 生成哪种模块格式 | `CommonJS`（为了 Node 能直接跑；React 项目里会用 `ESNext`） |
| **`strict`** | 开启一整套严格检查 | `true` ✅ **别关** |
| **`outDir`** | 编译产物放哪 | `dist` |
| **`rootDir`** | 源码根目录 | 没写（只有一个根时可以省） |
| **`lib`** | 能用哪些内置类型 | 没写 → 默认含 `DOM` + `ES2020`（所以你能用 `document`） |
| **`esModuleInterop`** | 让 `import` 兼容 CommonJS 包 | `true`（几乎必开） |
| **`skipLibCheck`** | 跳过检查 node_modules 里的 `.d.ts` | `true`（能大幅加快编译） |
| **`declaration`** | 生成 `.d.ts`（给别人用你的库时开） | 没开 |
| **`sourceMap`** | 生成 sourcemap，方便调试 | 没开（做项目时建议开） |
| **`paths` / `baseUrl`** | 路径别名（`@/components/xxx`） | 没开（React 项目里会配） |

### ⭐ `strict` 里面包含什么（面试常问）

`strict: true` 是一组开关的总开关，重要的有：

| 子选项 | 作用 |
|---|---|
| **`strictNullChecks`** | `null` / `undefined` 不能随便赋给别的类型 → **最重要的一项** |
| **`noImplicitAny`** | 不许有"隐式 any"（参数不写类型就报错，你见过的 TS7006） |
| `strictFunctionTypes` | 函数参数类型检查更严格 |
| `strictPropertyInitialization` | class 属性必须初始化（或在构造函数里赋值） |
| `alwaysStrict` | 每个文件都当严格模式 |

**不在 strict 里、但值得知道的**：
- `noUncheckedIndexedAccess`：`arr[i]` 会变成 `T | undefined`（更安全，但代码要多写判断）
- `noUnusedLocals` / `noUnusedParameters`：不许有没用的变量/参数（配合 ESLint）

> **面试如果问"你改过 tsconfig 的什么？"** 答：开 `strict`、配 `target`/`module`、
> 用 `include`/`exclude` 控制检查范围（比如把故意报错的示例文件排除）、
> 项目里还会配 `paths` 别名和 `sourceMap`。

---

## 二、`.d.ts` 是什么

### 一句话

> **`.d.ts` 是"只有类型、没有实现"的文件**（declaration file）。
> 它专门用来告诉 TS："这个 JS 模块长什么样"——不产生任何运行时代码。

### 为什么需要它

你会在三种场景遇到：

| 场景 | 例子 |
|---|---|
| **第三方库是 JS 写的，没有类型** | `npm i -D @types/lodash`（DefinitelyTyped 社区维护） |
| **库自带类型** | 装完后 `node_modules/xxx/index.d.ts`（TS 自动找） |
| **自己写的全局声明** | 比如给 `window.myGlobal` 加类型 |

### 例子：给一个没有类型的库补声明

假设你装了一个 `some-lib`，它没有类型，TS 报 `Could not find a declaration file for module 'some-lib'`。

**做法**：在项目里建 `types/some-lib.d.ts`：

```ts
declare module 'some-lib' {
  // 声明这个模块导出了什么
  export function format(value: number, digits?: number): string
  export const version: string
  export default function init(options: { debug?: boolean }): void
}
```

然后在 `tsconfig.json` 里确保它在 `include` 范围内（`**/*.ts` 已经覆盖 `.d.ts`）。

### 另一个常见用法：给全局变量加类型

```ts
// global.d.ts
declare global {
  interface Window {
    __APP_VERSION__: string          // 现在 window.__APP_VERSION__ 有类型了
  }
}
export {}
```

### 自己生成 `.d.ts`

把 tsconfig 里的 `declaration` 打开：

```json
{ "compilerOptions": { "declaration": true } }
```

编译后每个 `.ts` 会产出一个同名 `.d.ts` —— 这就是"发布 TS 库给别人用"的方式。

> ⚠️ 注意：`.d.ts` 里的 `declare` 只做声明，**不写实现**。写了实现 TS 会报错。

---

## 三、TS 阶段总自测（做完打勾，全过就可以进 React）

### 类型基础
- [ ] 能给变量、函数、对象、数组标类型；知道什么时候**不用**标
- [ ] 能说出 `interface` 和 `type` 的区别
- [ ] 能说清 `any` / `unknown` / `never` 的区别和 never 的用途（穷举检查）
- [ ] 能说清 `??` 和 `||` 的区别

### 收窄与安全
- [ ] 会用 `typeof` / `in` / `instanceof` / `isArray` / 自定义守卫收窄
- [ ] 能写出 `v is User` 形式的类型守卫
- [ ] 知道 `as` 和 `!` 的风险，能说出替代方案

### 泛型与工具类型
- [ ] 能写出 `<K extends keyof T>(obj: T, key: K): T[K]`
- [ ] 用过 `Omit` / `Pick` / `Partial` / `Record` / `ReturnType`
- [ ] 能说出"什么时候**不该**用泛型"

### 真实场景
- [ ] 能用 `$<T extends HTMLElement>()` 处理 DOM 类型
- [ ] 知道 `dataset` 是 string、定时器要用 `ReturnType<typeof setTimeout>`
- [ ] 能写"类型安全的 storage"（映射表 + keyof + T[K]）
- [ ] 能说清"类型擦除"→ 接口数据必须运行时校验

### 工程
- [ ] 知道 tsconfig 里 `strict` / `target` / `module` / `include` / `exclude` 的作用
- [ ] 知道 `.d.ts` 是什么、什么场景需要它

---

## 四、下一步：React 阶段（10 月底开始）

进 React 之前，你会用 Vite 创建一个真正的项目，那时候：

```powershell
npm create vite@latest my-app -- --template react-ts
```

**TS 会从"练习"变成"日常"**：props 类型、`useState<T>`、事件类型、接口响应建模……
你今天学的每一样都会用到。而且你会用到 **Vue/React 的组件 props 类型**，那就是"对象建模 + 泛型"的直接应用。

> **一句话总结整个 TS 阶段**：
> TS 不是"多学一门语言"，而是**给你写 JS 时加了一层"提前发现错误 + 编辑器智能提示"的护栏**。
> 它不能保证逻辑正确，但能保证"类型对得上"——这就已经能省掉大量低级 bug 和调试时间。
