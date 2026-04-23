# 做了个在线工具集，记录几个写的时候没想到会踩的坑

起因很简单：某天在公司内网环境下，需要解码一个 JWT，打开平时用的那个网站发现被墙了。找了另一个，页面广告多到看不清输入框。

我知道 JWT 解码就是 Base64 + JSON.parse，不涉及任何网络请求，完全可以本地跑。但市面上大多数工具都是表单提交到服务端处理再返回，哪怕逻辑再简单也不例外。

就想着自己做一个，把常用的工具都集中到一起，所有计算在浏览器本地完成。这个想法说起来简单，但真正写完 30 个工具之后，踩了不少我没预料到的坑。

---

## 架构没什么好说的，SSG 是唯一合理的选择

工具页面没有动态数据，SSG 是显而易见的选择。用 Next.js 15 App Router，每个工具对应一条路由：

```
/tools/json-formatter
/tools/base64
/tools/jwt-decoder
...
```

`generateStaticParams` 把所有工具路由预渲染成静态 HTML，工具的 React 组件通过 `next/dynamic` 懒加载进来，SSR 关掉：

```ts
'json-formatter': dynamic(() => import('@/tools/json-formatter'), { ssr: false }),
```

这样工具逻辑不会影响首屏加载，TTFB 极快。部署在 Vercel，CDN 分发，没有服务端成本。

---

## 第一个没想到的问题：usePersistedState 的水合错误

工具输入需要持久化，用户关掉页面再回来，上次输入的内容还在。我封装了个 `usePersistedState`，第一版就犯了个很经典的错误：

```ts
const [value, setValue] = useState<T>(() => {
  // 在这里读 localStorage
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
})
```

本地开发看起来没问题，部署后控制台报 hydration mismatch。原因显而易见：服务端渲染没有 `localStorage`，用 `defaultValue`；客户端初始化时读到了本地存储的值，两边对不上。

改法是分两步走：

```ts
// 第一次渲染无论服务端客户端都用 defaultValue
const [value, setValue] = useState<T>(defaultValue)

// mount 之后才从 localStorage 读
useEffect(() => {
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) setValue(JSON.parse(stored))
  } catch {}
}, [key])

// 写入只在用户主动改的时候触发
const set = useCallback((v: T) => {
  setValue(v)
  try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
}, [key])
```

这里有个隐蔽的地方：**持久化写入必须放在 setter 里，不能放在监听 value 的 useEffect 里**。

如果监听 `value` 变化然后写入 localStorage，那么 rehydrate 时 `setValue(stored)` 触发，value 变成了本地存储的值，没问题。但如果同时有另一个 `useEffect` 在监听 value 并写入，`defaultValue` 状态也会被短暂地写进去——因为两个 effect 的执行顺序不确定。这个 bug 触发概率不高，但一旦触发就会把存储的数据覆盖掉。

---

## 第二个没想到的问题：输入自动转换的写法

最开始每个工具都有个"转换"按钮，用户改了输入，点击才出结果。写到第五个工具的时候觉得这个交互很蠢——输入变化就应该立刻更新输出，为什么要多一次点击？

于是把所有按钮触发改成了响应输入的 `useEffect`：

```ts
useEffect(() => {
  if (!input.trim()) { setOutput(''); return }
  try {
    setOutput(convert(input))
    setError('')
  } catch (e) {
    setError(e.message)
    setOutput('')
  }
}, [input])
```

跑起来没问题，但有个隐患：`useEffect` 是异步的，每次渲染之后才执行，中间有一帧的空窗期，输出和输入短暂不同步。对于这种纯计算的场景，其实更适合用 `useMemo`：

```ts
const { output, error } = useMemo(() => {
  if (!input.trim()) return { output: '', error: '' }
  try {
    return { output: convert(input), error: '' }
  } catch (e) {
    return { output: '', error: e.message }
  }
}, [input])
```

同步计算，没有中间状态，逻辑也更清晰。全部工具换成这个模式之后，把 useEffect 改成 useMemo 这件事本身反而踩了另一个坑：有几个工具之前用 `useEffect` 同时做了自动转换和持久化，拆开之后发现持久化的逻辑漏掉了，静默失效。所以重构的时候要注意不要只改一半。

---

## JSON 格式化器的树形视图

这个功能写起来比我预期的要好写。思路就是一个递归组件，每个节点自己管展开状态：

```tsx
function JsonNode({ value, depth }: { value: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2)

  if (typeof value !== 'object' || value === null) {
    return <span>{renderPrimitive(value)}</span>
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="...">
        ▶ {Array.isArray(value) ? `[${entries.length}]` : `{${entries.length} 个键}`}
      </button>
    )
  }

  return (
    <div>
      <button onClick={() => setOpen(false)}>▼</button>
      <div className="ml-4 border-l pl-3">
        {entries.map(([k, v]) => (
          <div key={k}>
            {!Array.isArray(value) && <span className="text-blue-400">"{k}": </span>}
            <JsonNode value={v} depth={depth + 1} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

深度小于 2 默认展开，更深的折叠。用的时候粘贴进一个几百行的 JSON 响应，只展开关心的那个字段，比全量高亮显示要实用得多。

写的时候踩了一个小坑：`depth < 2` 的默认展开状态是 `useState` 的初始值，但当用户重新输入一个新的 JSON 时，之前展开的状态不会重置——节点保持着上一次的 `open` 状态。解决方法是给最外层的 `JsonNode` 加一个 `key={inputVersion}`，让整棵树在新输入时重新挂载。

---

## Tailwind CSS v4

项目用了 Tailwind v4，和 v3 最大的区别是配置文件没了，全部移到 CSS 里：

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 250);
  --radius: 0.5rem;
}
```

自定义颜色、间距、字体都在 `@theme` 里声明，shadcn/ui 的 CSS 变量也放这里。整体比 v3 干净，但文档还不完整，遇到问题只能翻源码或者 GitHub Issues。

---

## 测试

每个工具拆成两个文件：`logic.ts` 放纯函数，`index.tsx` 放组件。测试只覆盖 `logic.ts`，组件逻辑通过手动验证。

这个拆分非常值得。纯函数好测，边界情况好列举，有几次就是写测试的时候才发现逻辑有问题。比如颜色转换器，HSL 里 H 值超过 360、S/L 超过 100 要报错，这个校验最开始没做，写测试时才加上去。

30 个工具，275 个测试用例，跑完不到 5 秒。

---

## 现在有什么

30 个工具，分四类：

- **开发者工具**：JSON 格式化、Base64、URL 编码/解析、正则测试、时间戳、UUID、Cron 解析、密码生成、JWT 解析、二维码、HTTP 状态码、日期差/加减、年龄计算
- **文本处理**：字数统计、文本对比、大小写转换、Markdown 预览、行操作（排序/去重/反转）
- **编码加密**：哈希（MD5/SHA-1/SHA-256）、HTML 实体、图片转 Base64
- **转换工具**：颜色（HEX/RGB/HSL）、进制、CSS 单位、JSON↔CSV、YAML↔JSON、单位换算（长度/重量/温度/数据）

全部开源，地址在下面。用的时候如果发现 bug 或者想要哪个工具，提 Issue 就行。

> 在线地址：https://tools.huangzhicheng.top  
> GitHub：https://github.com/HadeAs/tools
