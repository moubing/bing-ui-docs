# BingTextarea

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export textarea；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

模型使用字符串；clearable 默认 false，开启后可在焦点仍在控件内的 5 秒内撤销清除。组词草稿只改变显示、计数和高度。submitOn 默认 none，enter 保留 Shift+Enter 换行；resize 只报告 textarea 的稳定高度。字数按 UTF-16 长度统计。

BingTextarea 是多行文本输入组件，适合备注、描述、反馈和长文案编辑。它支持平滑光标、自动高度、字数统计、最大长度、清除按钮、尺寸、状态、resize 控制，以及通过 ref 暴露原生 textarea 操作方法。

## 基础配置

使用 `v-model` 绑定文本值，通过 `rows`、`autosize`、`resize`、`showCount` 和 `clearable` 控制输入体验。

模型始终使用字符串，空值用 `''`，不要传 null。`input` 回调接收 `(value: string, event: Event)` 两个参数，`v-model` 用于同步外部状态。

`readonly` 保留聚焦和文本选择，同时阻止编辑并隐藏清除按钮；`disabled` 则不可聚焦。Textarea 的模型仍是字符串，0.18.0 起 clearable 默认 false，需要清除入口时显式开启。

从 0.10.0 起，`smoothCaret` 默认开启，与 BingInput 使用相同的约 90ms 光标位移。输入、退格、方向键、换行和自动折行时跟随原生插入点；输入值即时更新，不对文字做防抖。自动高度、内部滚动和容器宽度变化时重新校准，中文输入法组词期间只读取原生选区焦点端，不改动选区或候选窗口。

可用 `:smooth-caret="false"` 关闭。选择普通文本、只读、禁用、触屏、减少动态效果、高对比度、双向文字或无法可靠测量时回到原生光标；失焦和卸载时清理动画与测量节点。下方“平滑光标”开关可对照体验，多行输入和原生键盘行为保持一致。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import type { BingTextareaProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingTextareaProps = {
  "placeholder": "请输入说明内容",
  "size": "md",
  "status": "default",
  "rows": 4,
  "autosize": {
    "minRows": 3,
    "maxRows": 6
  },
  "resize": "vertical",
  "showCount": true,
  "clearable": true,
  "smoothCaret": true,
  "block": true,
  "disabled": false,
  "readonly": false,
  "maxLength": 120
}
const value = ref('BingTextarea 适合备注、描述、长文案编辑和多行反馈。')
</script>

<template>
  <BingTextarea v-model="value" v-bind="options" ariaLabel="基础 Textarea 示例" />
  <p role="status">字符数：{{ value.length }}</p>
</template>
```

## 自动高度与字数统计

`autosize` 为 `true` 时会使用 `rows` 作为最小行数；传入对象时可以用 `minRows` 和 `maxRows` 限制高度范围。

行数与高度限制使用有效正数，且 minRows 不大于 maxRows。`showCount` 按 JavaScript 字符串 length 统计，部分 emoji 会计为 2；maxLength 是原生输入限制，不会截断程序赋值。可用 countFormatter 自定义文案；计数只在接近或达到上限时播报，组词草稿实时改变计数和高度，确认后才发布模型。

`autosizeTransition` 默认开启 120ms 过渡；一次超过三行、到达 maxRows、宽度变化或减少动态效果时直接设高。滚动条根据最终高度决定，不随过渡中的临时溢出闪现。`resize(height)` 在初次测量和实际高度稳定后各通知一次，参数仅含 textarea 高度，不含计数区和外框。浮层可在回调读取自身外框，窗口和锚点变化仍由业务监听。

0.6.0 关闭 autosize 会清理组件管理的行内高度及 overflow-y，恢复 rows 和 resize 的原生行为，无需用 key 重建。容器宽度改变时会重新测量换行后的高度。开启 showCount 时计数位于底栏，不遮挡正文。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const fixed = ref('固定行数 textarea\n适合高度稳定的备注框。')
const auto = ref('自动高度 textarea\n继续输入更多行时会自动增高。\n第三行内容。')
const limited = ref('最多 80 个字符，右下角显示计数。')
</script>

<template>
  <div class="textarea-stack">
    <BingTextarea v-model="fixed" :rows="4" resize="vertical" block ariaLabel="固定高度" />
    <BingTextarea v-model="auto" autosize :rows="3" block ariaLabel="自动增高" />
    <BingTextarea v-model="limited" :autosize="{ minRows: 3, maxRows: 6 }" :max-length="80" show-count block ariaLabel="限制高度与长度" />
  </div>
</template>

<style scoped>
.textarea-stack { display: grid; gap: 16px; max-width: 500px; }
</style>
```

## Resize、Block 与状态

`resize` 直接控制原生 CSS resize 行为；`block` 让组件撑满父容器。`status` 用于展示校验反馈，也可以从 BingFormItem 继承。

状态样式不包含校验规则。三个示例分别绑定各自的文本，输入或清除会同步更新模型。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const noResize = ref('禁止拖拽调整')
const vertical = ref('只允许垂直调整')
const error = ref('撑满父容器并显示错误状态')
</script>

<template>
  <div class="textarea-stack">
    <BingTextarea v-model="noResize" resize="none" ariaLabel="禁止拖拽" />
    <BingTextarea v-model="vertical" resize="vertical" status="success" ariaLabel="垂直调整" />
    <BingTextarea v-model="error" status="error" block ariaLabel="错误状态" />
  </div>
</template>

<style scoped>
.textarea-stack { display: grid; gap: 16px; }
</style>
```

## 清除与事件

输入时会触发 `update:modelValue` 和 `input`。清除按钮会把值更新为空字符串，触发 `clear`，并重新聚焦 textarea。

清除不触发 input；需要同时处理输入和清除时监听模型更新。clear 没有参数，清除后焦点留在控件内的 5 秒内可 Ctrl / ⌘+Z 撤销；新输入、离开控件或超时后失效。开启清除固定预留槽位，首字输入不重新折行。内部按钮与滚动条间移动不触发 blur 校验。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const note = ref('试着输入、清除、聚焦或失焦。')
const log = ref('等待操作')
const key = ref('未按键')
function handleInput(value: string, event: Event) { log.value = `input：${value.length} 个字符；原始事件：${event.type}` }
function handleClear() { log.value = 'clear：已清空' }
function handleFocus() { log.value = 'focus：获得焦点' }
function handleBlur() { log.value = 'blur：失去焦点' }
function handleKeydown(event: KeyboardEvent) { key.value = event.key }
</script>

<template>
  <BingTextarea v-model="note" clearable show-count :max-length="100" block ariaLabel="事件示例" @input="handleInput" @clear="handleClear" @focus="handleFocus" @blur="handleBlur" @keydown="handleKeydown" />
  <BingButton variant="ghost">移出焦点</BingButton>
  <p role="status">{{ log }}</p>
  <p>最近按键：{{ key }}</p>
</template>
```

## 提交快捷键与高度通知

`submitOn` 的公开类型为 `BingTextareaSubmitOn = 'none' | 'enter' | 'mod-enter'`。默认 none 保持换行；enter 用于短标注，Shift+Enter 仍换行；mod-enter 用于长说明，以 Ctrl / ⌘+Enter 提交。`submit(value,event)` 不在输入法确认前触发，业务 keydown.preventDefault 可阻止提交。快捷键需要可见说明及 aria-describedby。

```vue
<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const note = ref('')
const description = ref('')
const submitted = ref('')
const height = ref(0)
const notifications = ref(0)
const hint = useId()
function resize(value: number) { height.value = value; notifications.value++ }
</script>
<template>
  <div style="display: grid; gap: 16px; min-width: 0">
    <p :id="hint">短标注 Enter 提交、Shift+Enter 换行；清除后 5 秒内且焦点仍在控件内，可 Ctrl / ⌘+Z 撤销。</p>
    <BingTextarea v-model="note" submit-on="enter" :ariaDescribedby="hint" ariaLabel="快捷提交标注" :rows="1" :autosize="{ minRows: 1, maxRows: 4 }" clearable show-count :max-length="100" :count-formatter="(count, max) => count + ' / ' + max + ' 字符'" block @submit="submitted = $event" @resize="resize" />
    <p role="status">提交：{{ submitted }}；高度 {{ height }}px；高度通知 {{ notifications }} 次</p>
    <p :id="hint + '-long'">长说明使用 Ctrl / ⌘+Enter 提交；普通 Enter 换行，默认无清除按钮。</p>
    <BingTextarea v-model="description" submit-on="mod-enter" :ariaDescribedby="hint + '-long'" ariaLabel="长说明快捷提交" :autosize="{ minRows: 2, maxRows: 6 }" block @submit="submitted = $event" />
  </div>
</template>
```

## 实例方法

组件通过 `defineExpose` 暴露原生 textarea 和 `focus()`、`blur()`、`select()`，适合弹窗打开后自动聚焦、批量编辑时选中文本。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTextarea } from '@moubing/bing-ui'
import type { BingTextareaExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const textareaRef = ref<BingTextareaExpose | null>(null)
const note = ref('可以通过 ref 调用 focus、blur、select。')
const selectedText = ref('未选择')
function selectText() {
  textareaRef.value?.select()
  const element = textareaRef.value?.textarea
  selectedText.value = element ? element.value.slice(element.selectionStart, element.selectionEnd) : '未选择'
}
</script>

<template>
  <BingTextarea ref="textareaRef" v-model="note" block ariaLabel="实例方法示例" />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="textareaRef?.focus()">focus</BingButton>
    <BingButton size="sm" variant="ghost" @click="textareaRef?.blur()">blur</BingButton>
    <BingButton size="sm" variant="ghost" @click="selectText">select</BingButton>
  </div>
  <p role="status">选中文本：{{ selectedText }}</p>
</template>

<style scoped>
.actions { display: flex; gap: 12px; margin-top: 12px; }
</style>
```

## 属性

| 属性                   | 类型                                                  | 默认值                                           | 说明                                                                                                                                                |
| -------------------- | --------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string`                                            | `undefined`                                   | textarea id；在 BingFormItem 内会自动继承 controlId。                                                                                                      |
| `modelValue`         | `string`                                            | `''`                                          | 当前文本值。                                                                                                                                            |
| `placeholder`        | `string`                                            | `undefined`                                   | 占位文案。                                                                                                                                             |
| `disabled`           | `boolean`                                           | `继承 FormItem / Form，否则 false`                 | 禁用输入与聚焦；显式 false 可覆盖表单禁用。                                                                                                                         |
| `readonly`           | `boolean`                                           | `false`                                       | 只读，可聚焦和选择文本；不能编辑，且不显示清除按钮。                                                                                                                        |
| `clearable`          | `boolean`                                           | `false`                                       | 显式开启清除；5 秒内且焦点未离开控件可 Ctrl / ⌘+Z 撤销，新输入后失效。                                                                                                        |
| `smoothCaret`        | `boolean`                                           | `true`                                        | 0.10.0 起默认启用约 90ms 平滑光标，支持多行、自动折行、滚动和中文组词。只改变装饰光标，不延迟模型更新；选择文本、只读、触屏、系统减少动态效果或无法可靠定位时使用原生光标；该判断由 CSS 媒体查询完成，不受 ConfigProvider 的 reducedMotion 影响。 |
| `rows`               | `number`                                            | `3`                                           | 原生 textarea rows，也作为 autosize 的默认最小行数。                                                                                                            |
| `autosize`           | `boolean \| { minRows?: number; maxRows?: number }` | `false`                                       | 是否按内容自动调整高度，可限制最小和最大行数。                                                                                                                           |
| `autosizeTransition` | `boolean`                                           | `true`                                        | 自动增高默认过渡 120ms；超过三行、到达上限、宽度变化和减少动态效果时直接调整。                                                                                                        |
| `submitOn`           | `BingTextareaSubmitOn`                              | `'none'`                                      | enter 提交且保留 Shift+Enter 换行；mod-enter 为 Ctrl / ⌘+Enter；none 只换行。                                                                                   |
| `maxLength`          | `number`                                            | `undefined`                                   | 原生 maxlength；配合 showCount 展示最大长度。                                                                                                                 |
| `showCount`          | `boolean`                                           | `false`                                       | 是否显示字数统计。                                                                                                                                         |
| `countFormatter`     | `(count: number, max?: number) => string`           | `undefined`                                   | 自定义可见计数；阈值播报不逐字重复。                                                                                                                                |
| `size`               | `'sm' \| 'md' \| 'lg'`                              | `继承 FormItem / Form / ConfigProvider，否则 'md'` | 控制文本字号和内边距，多行高度由 rows、内容及 autosize 决定。                                                                                                            |
| `block`              | `boolean`                                           | `false`                                       | 是否撑满父容器；在 BingFormItem 内默认撑满。                                                                                                                     |
| `ariaLabel`          | `string`                                            | `undefined`                                   | 无可见标签时的可访问名称。                                                                                                                                     |
| `ariaDescribedby`    | `string`                                            | `undefined`                                   | 关联额外说明元素；在表单内会合并表单说明。                                                                                                                             |
| `status`             | `'default' \| 'error' \| 'success' \| 'warning'`    | `undefined`                                   | 状态样式；在表单内可继承 FormItem 状态。                                                                                                                         |
| `name`               | `string`                                            | `undefined`                                   | 原生 textarea name。                                                                                                                                 |
| `autocomplete`       | `string`                                            | `undefined`                                   | 原生 autocomplete。                                                                                                                                  |
| `spellcheck`         | `boolean \| 'true' \| 'false'`                      | `undefined`                                   | 原生 spellcheck。                                                                                                                                    |
| `resize`             | `'none' \| 'vertical' \| 'horizontal' \| 'both'`    | `'vertical'`                                  | 原生 CSS resize 行为。                                                                                                                                 |
| `clearAriaLabel`     | `string`                                            | `'清空文本'`                                      | 清除按钮的可访问名称。                                                                                                                                       |

## 事件与暴露方法

### 事件

| 事件                  | 参数                                      | 说明                                                 |
| ------------------- | --------------------------------------- | -------------------------------------------------- |
| `update:modelValue` | `string`                                | 输入或清除时触发。                                          |
| `input`             | `(value: string, event: Event)`         | 确认输入后触发；组词草稿仅改变显示、计数和高度，清除不触发 input。               |
| `clear`             | `-`                                     | 清除按钮更新模型为空字符串后触发，无参数，并重新聚焦 textarea。               |
| `focus`             | `FocusEvent`                            | 获得焦点时触发。                                           |
| `blur`              | `FocusEvent`                            | 离开整个控件后触发并校验；清除按钮和内部滚动条间移动不触发。                     |
| `keydown`           | `KeyboardEvent`                         | 按键按下时触发。                                           |
| `submit`            | `(value: string, event: KeyboardEvent)` | 匹配 submitOn 且非组词时提交；业务 keydown.preventDefault 可阻止。 |
| `resize`            | `number`                                | 初次测量及自动高度稳定后各通知一次 textarea 高度（px），不包含外框和计数区。       |

### 暴露方法

| 名称         | 类型                            | 说明                |
| ---------- | ----------------------------- | ----------------- |
| `textarea` | `HTMLTextAreaElement \| null` | 当前原生 textarea 元素。 |
| `focus()`  | `() => void`                  | 聚焦 textarea。      |
| `blur()`   | `() => void`                  | 让 textarea 失焦。    |
| `select()` | `() => void`                  | 选中文本内容。           |
