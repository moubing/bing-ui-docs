# BingCodeBlock

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export code-block；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础 options 是演示参数。code 字符串仅被展示，不会执行；五个示例内置文本，没有缺失的 ?raw 文件。行高亮不修改复制内容，区间包含首尾。Token API 示例保留纯文本失败回退并丢弃过期结果。

BingCodeBlock 是代码展示组件，用于文档示例、配置片段和只读代码预览。它内部用 Shiki 做语法高亮，用 BingScrollbar 处理长代码滚动，并可选接入 BingResizable 让代码区域支持拖拽调整尺寸。

## 基础展示

传入 `code`、`language` 和 `title` 即可展示代码。头部会显示文件名、语言标签和复制按钮；高亮失败时会保留纯文本展示，并触发 `highlightError`。

自 0.12.0 起，Shiki 核心、语法和主题在首次高亮时才按需加载，并在之后复用；加载完成前先以纯文本渲染同样的行，不影响复制。依赖高亮颜色的测试应等待高亮完成后再断言。

`code` 是必填字符串，仅用于展示，不会执行里面的代码，也不是双向绑定的编辑器。下方完整示例内置了展示文本，复制 Vue 文件即可运行；嵌入字符串中的 Unicode 转义用于避免脚本结束标签截断外层 SFC。

`theme` 默认为 `auto`：组件会跟随 Bing UI 的全局 `light`、`dark` 或 `system` 主题解析高亮，其中亮色使用 `vitesse-light`，暗色使用 `github-dark`。显式传入具体 Shiki 主题后，高亮主题会保持固定，不再随全局主题切换。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'
import type { BingCodeBlockProps, BingCodeBlockCopyPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// code 是要展示的文本，不会作为组件执行。
const options: BingCodeBlockProps = {
  "code": "\u003cscript setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst visible = ref(false)\n\nfunction openDialog() {\n  visible.value = true\n}\n\u003c/script>\n\n\u003ctemplate>\n  \u003cBingButton @click=\"openDialog\">打开弹窗\u003c/BingButton>\n  \u003cBingDialog v-model=\"visible\" title=\"发布确认\">\n    当前文档会进入公开状态。\n  \u003c/BingDialog>\n\u003c/template>",
  "language": "vue",
  "theme": "auto",
  "title": "usage.vue",
  "languageLabel": "Vue",
  "lineNumbers": true,
  "copyable": true,
  "wrap": false,
  "maxHeight": "360px",
  "highlightLines": [
    [
      8,
      12
    ]
  ]
}
const copyLog = ref('等待复制')
const highlightLog = ref('高亮状态正常')
function handleCopy(payload: BingCodeBlockCopyPayload) { copyLog.value = `已复制 ${payload.language}，共 ${payload.code.length} 个字符` }
function handleCopyError(error: Error) { copyLog.value = '复制失败：' + error.message }
function handleHighlightError(error: Error) { highlightLog.value = '高亮失败，已回退纯文本：' + error.message }
</script>

<template>
  <BingCodeBlock v-bind="options" @copy="handleCopy" @copy-error="handleCopyError" @highlight-error="handleHighlightError" />
  <p role="status">{{ copyLog }}；{{ highlightLog }}</p>
</template>
```

> **关于 ?raw**
>
> 在 Vite/Nuxt 中，导入路径末尾的 `?raw` 会把文件作为原始文本字符串导入，也可用于提供 code。此页完整示例已经内置文本，不依赖外部示例文件；实际项目改用 raw 导入时，目标文件必须真实存在。

## 行高亮和滚动

`highlightLines` 支持单行和闭区间范围。代码较长时可以通过 `maxHeight`限制高度，内部滚动条会同时支持垂直和水平滚动；按住 Shift 使用滚轮时，也可以平滑横向滚动长代码行。 `smoothScroll` 默认覆盖代码区的纵横滚动和头部 Shift + 滚轮的横向转发，设为 `false` 即可关闭平滑处理。

行号从 1 开始，区间包含首尾；0、负数、小数、反向区间不会高亮。高亮并不改变原始字符串，复制内容仍是原始 code，不包含行号。

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import type { BingCodeBlockHighlightLine, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const longCode = Array.from({ length: 26 }, (_, index) => {
  const line = index + 1

  return `const metric${line.toString().padStart(2, '0')} = collectComponentSignal(source[${index}], { animated: true, density: 'compact' })`
}).join('\n')
const singleLines = ref<number[]>([6])
const rangeStart = ref(12)
const rangeEnd = ref(16)
const lineOptions = Array.from({ length: 26 }, (_, index) => ({ label: '第 ' + (index + 1) + ' 行', value: index + 1 }))
const rangeEndOptions = computed(() => lineOptions.filter(option => option.value >= rangeStart.value))
const highlightedLines = computed<BingCodeBlockHighlightLine[]>(() => [...singleLines.value, [rangeStart.value, rangeEnd.value]])
watch(rangeStart, start => { if (rangeEnd.value < start) rangeEnd.value = start })
// Select 的事件类型包含单值、数组和 null；先收窄再写入行号状态。
function updateSingleLines(value: BingSelectModelValue) {
  singleLines.value = Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : []
}
function updateRangeStart(value: BingSelectModelValue) { if (typeof value === 'number') rangeStart.value = value }
function updateRangeEnd(value: BingSelectModelValue) { if (typeof value === 'number') rangeEnd.value = value }
</script>

<template>
  <div class="highlight-controls">
    <BingSelect :model-value="singleLines" :options="lineOptions" multiple block searchable clearable :show-select-all="false" :panel-max-height="300" placeholder="选择单独高亮的行" ariaLabel="选择单独高亮的代码行" @update:model-value="updateSingleLines" />
    <BingSelect :model-value="rangeStart" :options="lineOptions" block searchable :clearable="false" :panel-max-height="300" placeholder="起始行" ariaLabel="选择闭区间起始行" @update:model-value="updateRangeStart" />
    <BingSelect :model-value="rangeEnd" :options="rangeEndOptions" block searchable :clearable="false" :panel-max-height="300" placeholder="结束行" ariaLabel="选择闭区间结束行" @update:model-value="updateRangeEnd" />
  </div>
  <BingCodeBlock :code="longCode" language="ts" title="metrics.ts" language-label="TypeScript" :highlight-lines="highlightedLines" :max-height="280" />
  <p role="status">高亮：{{ JSON.stringify(highlightedLines) }}</p>
</template>

<style scoped>
.highlight-controls { display: grid; gap: 12px; margin-bottom: 16px; }
</style>
```

## 换行和只读片段

打开 `wrap` 后，长行会在容器内换行，同时保留缩进。只读展示场景可以关闭行号和复制按钮，让代码块更像一段嵌入式说明。

```vue
<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const code = "const message = '这是一行刻意写得比较长的代码，用来观察 wrap 打开后是否保留缩进并在容器内自然换行，适合移动端文档或较窄的示例区域。'\n\nexport function previewMessage() {\n  return message.toUpperCase()\n}"
</script>

<template>
  <BingCodeBlock :code="code" language="ts" title="message.ts" :line-numbers="false" :copyable="false" wrap />
</template>
```

## 可调整尺寸

设置 `resizable` 后，组件会用 BingResizable 包裹代码块。这个模式适合在线示例、代码预览器、playground 这类需要用户临时改变可视区域的场景。

```vue
<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const longCode = Array.from({ length: 26 }, (_, index) => {
  const line = index + 1

  return `const metric${line.toString().padStart(2, '0')} = collectComponentSignal(source[${index}], { animated: true, density: 'compact' })`
}).join('\n')
</script>

<template>
  <div class="code-preview">
    <BingCodeBlock :code="longCode" language="ts" title="resizable-code.ts" resizable :highlight-lines="[4, [10, 13]]" :resizable-options="{
      defaultSize: { width: 720, height: 360 }, minWidth: 280, minHeight: 260,
      maxWidth: 920, maxHeight: 460, directions: ['right', 'bottom', 'bottom-right'],
      showSize: true, ariaLabel: '可调整尺寸的代码示例',
    }" />
  </div>
</template>

<style scoped>
.code-preview { max-width: 100%; overflow: auto; padding: 12px; }
</style>
```

## 在编辑器中复用高亮

0.14.0 新增包根公开 API：`getCodeLanguages`、`normalizeCodeLanguage`、`resolveCodeTheme` 和 `highlightCode`。业务可把逐行 token 映射为编辑器的装饰，不需要复制内部 Shiki 配置，也不必把高亮写入正文数据。

`getCodeLanguages()` 返回 12 种支持语言的独立副本，不含纯文本；按需添加 `{ value: 'text', label: '纯文本' }`。`normalizeCodeLanguage` 处理大小写、首尾空白和 js/ts/bash/sh/md/yml 等别名；空值归一为 text，未知标识保留为小写，不自动检测语言。

`highlightCode(code, language, theme)` 返回 Promise，行号从 1 开始，token 的 content 为原始文本，color 和 fontStyle 可选。纯文本不加载 Shiki，未知语言在加载前拒绝；语法、主题或网络加载失败同样拒绝，由调用方保留原文。行间换行不包含在 token 中；映射编辑器位置时应以原文的 UTF-16 偏移计算，并校验还原结果，特别是 CRLF。

`resolveCodeTheme('auto', mode)` 与组件共用亮色 vitesse-light、暗色 github-dark；可传 light/dark/system，省略时读取当前 Bing UI 主题。SSR 默认亮色。该函数只解析当前值，不自动监听变化；调用方负责在主题变化时重算。

读取语言元数据、规范化别名和解析主题不会加载 Shiki；实际高亮才按需加载核心、当前语言和主题，并复用模块缓存。Markdown 围栏需要加载内置嵌入语法。Token API 不提供正文缓存、防抖或可见性检测，编辑器应自行处理过期请求、IME 组词、超长内容和视口调度。

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { BingSelect, getCodeLanguages, highlightCode, normalizeCodeLanguage, resolveCodeTheme, type BingCodeBlockLine, type BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const language = ref('typescript')
const mode = ref<'light' | 'dark'>('light')
const code = 'const message: string = "你好"\nconsole.log(message)\n'
const options = [{ value: 'text', label: '纯文本' }, ...getCodeLanguages()]
const lines = ref<BingCodeBlockLine[]>([])
function changeLanguage(value: BingSelectModelValue) { if (typeof value === 'string') language.value = value }
function changeMode(value: BingSelectModelValue) { if (value === 'light' || value === 'dark') mode.value = value }
let request = 0
watch([language, mode], async () => {
  const current = ++request
  try {
    const result = await highlightCode(code, normalizeCodeLanguage(language.value), resolveCodeTheme('auto', mode.value))
    if (current === request) lines.value = result
  } catch {
    // 网络或语法加载失败保留原文；不显示过期请求的结果。
    if (current === request) lines.value = []
  }
}, { immediate: true })
onBeforeUnmount(() => { request++ })
</script>

<template>
  <div class="token-example" :class="{ 'token-example--dark': mode === 'dark' }">
    <div class="token-example__controls">
      <BingSelect :model-value="language" :options="options" searchable :clearable="false" ariaLabel="高亮语言" @update:model-value="changeLanguage" />
      <BingSelect :model-value="mode" :options="[{ value: 'light', label: '亮色' }, { value: 'dark', label: '暗色' }]" :clearable="false" ariaLabel="高亮配色" @update:model-value="changeMode" />
    </div>
    <pre aria-label="Token 高亮结果"><code><template v-if="lines.length"><template v-for="(line, index) in lines" :key="line.number"><span v-for="(token, tokenIndex) in line.tokens" :key="tokenIndex" :style="{ color: token.color }">{{ token.content }}</span>{{ index < lines.length - 1 ? '\n' : '' }}</template></template><template v-else>{{ code }}</template></code></pre>
  </div>
</template>

<style scoped>
.token-example { padding: 16px; border-radius: 8px; background: #f4f5f6; color: #20242a; }
.token-example--dark { background: #222830; color: #edf0f5; }
.token-example__controls { display: flex; flex-wrap: wrap; gap: 12px; }
pre { overflow: auto; margin: 16px 0 0; }
</style>
```

| 函数                                                                       | 返回值                            | 说明                                        |
| ------------------------------------------------------------------------ | ------------------------------ | ----------------------------------------- |
| `getCodeLanguages()`                                                     | `BingCodeLanguage[]`           | 返回支持语言的 value/label 副本，不含 text，不加载 Shiki。 |
| `normalizeCodeLanguage(language?: string \| null)`                       | `string`                       | 规范化别名；空值为 text，未知值保持小写。                   |
| `resolveCodeTheme(theme = 'auto', mode?: 'light' \| 'dark' \| 'system')` | `string`                       | 解析当前主题；显式主题优先，无自动订阅。                      |
| `highlightCode(code: string, language = 'text', theme = 'auto')`         | `Promise<BingCodeBlockLine[]>` | 逐行 token；纯文本保留空白，未知语言或加载失败拒绝。             |

| 导出类型                 | 字段                                                        | 说明                                                   |
| -------------------- | --------------------------------------------------------- | ---------------------------------------------------- |
| `BingCodeLanguage`   | `{ value: string; label: string }`                        | 语言标识及友好名称。                                           |
| `BingCodeBlockLine`  | `{ number: number; tokens: BingCodeBlockToken[] }`        | 从 1 开始的行号与有序 token。                                  |
| `BingCodeBlockToken` | `{ content: string; color?: string; fontStyle?: number }` | fontStyle 为 Shiki 位标志：1 斜体、2 粗体、4 下划线；编辑器可仅使用颜色保持排版。 |

## 属性

| 属性                 | 类型                                  | 默认值         | 说明                                                                                                                                      |
| ------------------ | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `code`             | `string`                            | `必填`        | 需要展示的原始代码字符串，不会作为业务代码执行。                                                                                                                |
| `language`         | `string`                            | `'text'`    | 传给 Shiki 的语言标识。当前内置 js、ts、jsx、tsx、vue、html、css、scss、json、markdown、shellscript、yaml。                                                     |
| `theme`            | `BingCodeBlockTheme`                | `'auto'`    | Shiki 主题。auto 会按 Bing UI 全局主题解析为亮色或暗色高亮；显式主题固定使用指定值。当前内置 auto、vitesse-light、vitesse-dark、github-light、github-dark、light-plus、dark-plus。 |
| `title`            | `string`                            | `undefined` | 头部标题，通常用文件名。                                                                                                                            |
| `languageLabel`    | `string`                            | `undefined` | 头部语言标签；为空时 text 显示“纯文本”，其他语言显示标识的大写形式。                                                                                                  |
| `copyable`         | `boolean`                           | `true`      | 是否显示复制按钮。                                                                                                                               |
| `copyLabel`        | `string`                            | `'复制代码'`    | 复制按钮默认文案。                                                                                                                               |
| `copiedLabel`      | `string`                            | `'已复制'`     | 复制成功后的按钮文案。                                                                                                                             |
| `copyResetDelay`   | `number`                            | `1600`      | 复制成功状态恢复延迟，单位毫秒。                                                                                                                        |
| `lineNumbers`      | `boolean`                           | `true`      | 是否显示 1-based 行号。                                                                                                                        |
| `highlightLines`   | `Array<number \| [number, number]>` | `undefined` | 需要高亮的行号或闭区间范围，例如 \[2, \[4, 6\]\]。非法行号会被忽略。                                                                                              |
| `width`            | `string \| number`                  | `undefined` | 代码块宽度；数字会转为 px，空值撑满父容器。                                                                                                                 |
| `maxHeight`        | `string \| number`                  | `undefined` | 代码区域最大高度；超出后通过内部 BingScrollbar 滚动。                                                                                                      |
| `smoothScroll`     | `SmoothScrollValue`                 | `true`      | 是否启用内部 BingScrollbar 的平滑滚动；传入 false 可关闭，也可传配置对象调整参数。                                                                                    |
| `resizable`        | `boolean`                           | `false`     | 是否用 BingResizable 包裹代码块，让用户拖拽调整尺寸。                                                                                                      |
| `resizableOptions` | `BingCodeBlockResizableOptions`     | `undefined` | 传给内部 BingResizable 的尺寸、方向、边界和无障碍配置。                                                                                                     |
| `wrap`             | `boolean`                           | `false`     | 是否保留缩进并允许长行换行。                                                                                                                          |
| `ariaLabel`        | `string`                            | `'代码块'`     | 代码块和滚动区域的可访问名称。                                                                                                                         |

## BingCodeBlockResizableOptions

| 字段                     | 类型                                                        | 说明                                     |
| ---------------------- | --------------------------------------------------------- | -------------------------------------- |
| `defaultSize`          | `{ width?: number \| string; height?: number \| string }` | 默认尺寸。CodeBlock 默认使用 width 或 640 x 360。 |
| `minWidth / minHeight` | `number \| string`                                        | 最小宽高；CodeBlock 默认 380 x 240。           |
| `maxWidth / maxHeight` | `number \| string`                                        | 最大宽高。                                  |
| `mode`                 | `'fixed' \| 'mirror'`                                     | BingResizable 的尺寸模式。                   |
| `snapMode`             | `'live' \| 'end'`                                         | 拖拽时实时吸附还是结束后吸附。                        |
| `directions`           | `BingResizableDirection[]`                                | 允许拖拽的方向；默认 right、bottom、bottom-right。  |
| `step`                 | `number \| { x?: number; y?: number }`                    | 拖拽步进。                                  |
| `disabled`             | `boolean`                                                 | 是否禁用拖拽。                                |
| `lockAspectRatio`      | `boolean`                                                 | 是否锁定宽高比。                               |
| `contain`              | `boolean`                                                 | 是否限制在父容器内。                             |
| `showSize`             | `boolean`                                                 | 是否显示当前尺寸；CodeBlock 默认 true。            |
| `handleSize`           | `number`                                                  | 拖拽手柄尺寸；CodeBlock 默认 12。                |
| `ariaLabel`            | `string`                                                  | 内部 BingResizable 的可访问名称。               |

## 事件

copy 接收 `{ code, language }` 对象。优先使用 Clipboard API；API 不存在时才尝试 textarea 兼容复制，API 拒绝时直接发出 copyError，不继续走兼容分支。业务可在错误事件中显示失败反馈。

| 事件               | 参数                                   | 说明                                                               |
| ---------------- | ------------------------------------ | ---------------------------------------------------------------- |
| `copy`           | `{ code: string; language: string }` | 复制成功后触发。                                                         |
| `copyError`      | `Error`                              | Clipboard API 拒绝，或 API 不存在且 textarea 兼容复制失败时触发；API 拒绝时不继续尝试兼容分支。 |
| `highlightError` | `Error`                              | Shiki 高亮失败时触发；组件会回退为纯文本展示。                                       |
