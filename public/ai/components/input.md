# BingInput

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export input；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。九个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

模型与更新均为 BingInputValue（string | number | null）；数字清空为 null，默认失焦 / Enter 规整，input 和 debounced-input 仍为字符串。passwordToggle 默认 true；已有自绘显隐时关闭。scrub 拖动结束提交一次原生 change，取消不提交。加载开关仅演示外观，没有请求。图标示例显式依赖 lucide-vue-next 1.0.0。

BingInput 用于文本、搜索、邮箱、密码、电话、URL 和数值输入。它内置尺寸、状态、图标、清除按钮、防抖事件和平滑光标，并能在 BingFormItem 中继承尺寸、禁用和校验状态。

## 基础配置

使用 `v-model` 绑定输入值，通过 `type`、`size`、`status`、`clearable` 和 `block` 控制常用行为。

模型与更新事件均为 `BingInputValue = string | number | null`，从包根导入；公开类型不会根据 `type` 自动收窄。示例用 `ref<BingInputValue>` 接收更新；业务必须保存字符串时，可使用 `:model-value` 配合 `@update:model-value="value = String($event ?? '')"`。`autocomplete` 默认为 `off`。图标示例使用 `lucide-vue-next 1.0.0`，运行前显式安装该依赖。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingInput, type BingInputProps } from '@moubing/bing-ui'
import { Search } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

type DemoOptions = Omit<BingInputProps, 'modelValue' | 'icon' | 'clearable'> & {
  initialValue: string | number | null; withIcon: boolean; clearMode: 'auto' | 'always' | 'never'
}
const options: DemoOptions = {
  "initialValue": "Bing UI",
  "type": "text",
  "placeholder": "请输入内容",
  "size": "md",
  "status": "default",
  "clearMode": "auto",
  "block": true,
  "disabled": false,
  "withIcon": true
}
const value = ref<string | number | null>(options.initialValue)
const clearable = options.clearMode === 'auto' ? undefined : options.clearMode === 'always'
</script>

<template>
  <BingInput v-model="value" :type="options.type" :placeholder="options.placeholder" :size="options.size"
    :status="options.status" :clearable="clearable" :block="options.block" :disabled="options.disabled"
    :icon="options.withIcon ? Search : undefined" icon-label="搜索" ariaLabel="基础输入框示例" />
  <p role="status">当前值：{{ value === '' ? '空' : value }}</p>
</template>
```

## 尺寸与状态

`sm / md / lg` 的高度分别为 32 / 36 / 40px，`status` 用于展示校验状态。放在表单里时，尺寸和状态可以由 `BingFormItem` 统一下发；显式属性优先于继承值。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingInput, type BingInputSize, type BingInputProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const sizes = ref<{ size: BingInputSize; value: string | number | null }[]>([
  { size: 'sm', value: 'sm 尺寸' }, { size: 'md', value: 'md 尺寸' }, { size: 'lg', value: 'lg 尺寸' },
])
const states = ref<{ status: NonNullable<BingInputProps['status']>; value: string | number | null }[]>([
  { status: 'default', value: 'default' }, { status: 'success', value: 'success' },
  { status: 'warning', value: 'warning' }, { status: 'error', value: 'error' },
])
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-for="item in sizes" :key="item.size" v-model="item.value" :size="item.size" :ariaLabel="`${item.size} 尺寸`" />
    <BingInput v-for="item in states" :key="item.status" v-model="item.value" :status="item.status" :ariaLabel="`${item.status} 状态`" />
    <BingInput model-value="不可编辑" disabled ariaLabel="禁用输入" />
  </div>
</template>
```

## 图标与清除

通过 `icon` prop 可以传入图标组件，也可以使用 `icon` 插槽完全自定义左侧内容。只有 `search` 类型默认开启清除；文本等其他类型需要显式 `clearable`。开启后固定预留清除槽位，空值按钮隐藏并退出 Tab 顺序，首次输入不会挤动文本。

禁用或只读时不会显示清除按钮。iconLabel 只命名图标，不会命名输入框；输入框应关联 label 或提供 ariaLabel。自定义 icon 插槽优先于 icon prop，插槽内容的可访问性由使用方设置。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingInput } from '@moubing/bing-ui'
import { Mail, Search, Sparkles } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const keyword = ref<string | number | null>('button')
const email = ref<string | number | null>('hello@bing-ui.dev')
const effect = ref<string | number | null>('spark')
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="keyword" :icon="Search" type="search" placeholder="搜索组件" ariaLabel="搜索组件" />
    <BingInput v-model="email" :icon="Mail" type="email" placeholder="邮箱地址" ariaLabel="邮箱地址">
      <template #icon><span aria-hidden="true">M</span></template>
    </BingInput>
    <BingInput v-model="effect" clearable :icon="Sparkles" clearAriaLabel="清空关键词" ariaLabel="动效关键词" />
  </div>
</template>
```

## 数值输入

`type="number"` 提供增加、减少按钮，支持点击、长按、方向键和 Shift 十倍步进，达到边界后对应按钮禁用。`clampOnBlur` 默认 true，失焦或 Enter 时根据 `min / max / step` 规整，`step="any"` 不对齐。负号、小数、指数中间态保留为显示草稿，不通知业务；父级拒绝更新后恢复已接受值。

0.18.0 起数字模型只发布 `number / null`，清空从 `''` 改为 `null`；`input` 和 `debounced-input` 仍返回字符串。不要用真假判断丢掉数字 `0`。`enter(value,event)` 在规整后发送，原生 `change` 仍接收 Event。需要提交时优先用 enter，避免自行处理组词按键。本例显式开启清除，并将防抖设为 0。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const value = ref<string | number | null>(2.5)
const immediate = ref('等待输入')
const debounced = ref('等待输入')
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="value" type="number" :min="0" :max="10" :step="0.5"
      clearable block :debounce-delay="0" ariaLabel="数值输入示例"
      @input="immediate = `${$event} (${typeof $event})`"
      @debounced-input="debounced = `${$event} (${typeof $event})`" />
    <p role="status">模型：{{ JSON.stringify(value) }}；类型：{{ value === null ? 'null' : typeof value }}；input：{{ immediate }}；debounced：{{ debounced }}</p>
    <div style="display: flex; gap: 12px; flex-wrap: wrap">
      <BingButton variant="secondary" size="sm" @click="value = null">重置为空</BingButton>
      <BingButton variant="secondary" size="sm" @click="value = 0">设为零</BingButton>
    </div>
    <BingInput model-value="3" type="number" readonly clearable ariaLabel="只读数值" />
  </div>
</template>
```

## 密码、计数与前缀拖动

密码框默认有显隐按钮，切换保留焦点和选区；已有业务显隐入口时设置 `passwordToggle=false`。保留 `current-password / new-password` 等自动填充语义。`prefix / suffix` 支持字符串与插槽，计数采用等宽数字，只在接近或达到上限时播报；loading 不接管查询。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const password = ref<BingInputValue>('sample-password')
const title = ref<BingInputValue>('')
const query = ref<BingInputValue>('')
const loading = ref(false)
</script>
<template>
  <div style="display: grid; gap: 18px; min-width: 0">
    <BingInput v-model="password" type="password" autocomplete="new-password" ariaLabel="密码显隐示例" block />
    <BingInput v-model="title" prefix="标题" suffix="字符" :max-length="20" show-count clearable ariaLabel="计数示例" block />
    <BingCheckbox v-model="loading" label="模拟加载状态" />
    <BingInput v-model="query" type="search" :loading="loading" ariaLabel="加载搜索示例" block />
    <p>显隐切换保留选区；计数仅在阈值处播报。加载开关仅演示外观，没有网络请求。</p>
  </div>
</template>
```

`scrub` 需要 number 与 prefix，横拖每 4px 一个步长，Shift 十倍。拖动连续发布模型，释放时为已接受的变化发送一次原生 change；Esc、窗口失焦、指针取消会撤销。受控拒绝时保留手势预览，结束后回到父级值。内部按钮间焦点移动不会触发 blur 校验，离开整个控件后才校验。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingInputValue>(40)
const accept = ref(true)
const changes = ref(0)
const entered = ref('')
function update(next: BingInputValue) { if (accept.value) value.value = next }
</script>
<template>
  <div style="display: grid; gap: 18px" @change="changes++">
    <BingCheckbox v-model="accept" label="接受数字更新" />
    <BingInput :model-value="value" type="number" prefix="宽度" suffix="px" scrub clearable :min="0" :max="100" :step="5" ariaLabel="前缀拖动调值" block @update:model-value="update" @enter="entered = JSON.stringify($event)" />
    <p role="status">已接受：{{ JSON.stringify(value) }}；change：{{ changes }}；Enter：{{ entered }}</p>
    <p>拖动“宽度”前缀，每 4px 一步；Shift 十倍，Esc 取消。输入 43 后 Enter 观察规整，清空为 null；拒绝更新时结束后回弹。</p>
  </div>
</template>
```

## 只读与平滑光标

`readonly` 保留聚焦和选择文本的能力，同时阻止编辑、清除和数值步进。`disabled` 则不可聚焦。

`smoothCaret` 默认开启。它在支持精确定位的文本输入中平滑移动光标，原生输入框仍负责编辑和选区。从 0.8.2 起，中文等输入法组词期间也保持同一条平滑光标，根据原生文本与选区焦点端定位，不修改真实选区或候选窗口。测量合并到每帧一次；确认或取消组词后继续跟随实际插入点。

从 0.9.0 起，聚焦时立即定位平滑光标，普通鼠标按下也会保留它，避免先出现原生光标再切换的短暂闪动。拖动选择文本仍使用原生选区反馈，业务不需要自行隐藏原生光标或增加聚焦延迟。

密码、邮箱、数字输入，以及普通非折叠选区、触摸、减少动态效果、无法可靠测量等场景使用原生光标；也可以显式设置 `smoothCaret=false`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const value = ref<string | number | null>('可以聚焦并选择这段内容')
const readonly = ref(true)
const smoothCaret = ref(true)
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="value" :readonly="readonly" :smooth-caret="smoothCaret" clearable block ariaLabel="只读与光标示例" />
    <BingCheckbox v-model="readonly" label="只读" />
    <BingCheckbox v-model="smoothCaret" label="平滑光标" />
    <p>关闭只读后，可输入文字或用方向键移动光标，切换平滑光标进行对照。</p>
  </div>
</template>
```

## 防抖与事件

普通输入会即时触发模型与 `input` 更新，`debounced-input` 按照 `debounceDelay` 延迟触发，适合搜索建议、远程查询和自动保存。

中文等输入法组词期间，原生输入框继续显示正在输入的文字，组件暂停模型、`input`、表单校验和防抖通知，避免拼音片段反复触发搜索或重绘。确认后只发布一次最终值，`input` 的 event 此时可能是 `compositionend`；取消且内容未改变时不发布模型更新，并恢复组词开始前待发的防抖通知。失焦时若仍有未结束的组词，按输入框最终内容收尾。

有效输入会立即更新模型和 input，只有 debounced-input 延迟。后续输入重置计时；延迟向下取整且最小为 0，0 表示立即通知。清除取消待发通知，发送文本空串或数字 null 的模型、clear()、debounced-input('')，并聚焦输入框，不触发 input。卸载取消待发通知。外部程序改值不主动触发 input 或 debounced-input，也不替代已排队的原生输入通知；组词期间重渲染不覆盖显示草稿。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingInput } from '@moubing/bing-ui'
import { Search } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const keyword = ref<string | number | null>('')
const debounced = ref('等待输入')
const immediate = ref('等待输入')
const cleared = ref(0)
const focus = ref(0)
const blur = ref(0)
const key = ref('')
function handleInput(value: string, event: Event) { immediate.value = `${value}:${event.type}` }
function handleDebouncedInput(value: string) { debounced.value = value || '空字符串' }
</script>

<template>
  <BingInput v-model="keyword" :icon="Search" type="search" block placeholder="输入后等待 500ms" ariaLabel="防抖搜索"
    :debounce-delay="500" @input="handleInput" @debounced-input="handleDebouncedInput" @clear="cleared++"
    @focus="focus++" @blur="blur++" @keydown="key = $event.key" />
  <p role="status">即时：{{ immediate }}；防抖：{{ debounced }}；清除：{{ cleared }}</p>
  <p>focus：{{ focus }}；blur：{{ blur }}；按键：{{ key }}</p>
  <button type="button">移出焦点</button>
</template>
```

## 实例方法

组件通过 `defineExpose` 暴露了原生 input 和三个方法，适合在复杂表单、弹窗打开后自动聚焦、批量编辑时控制输入框。

ref 在挂载后才可调用。select() 使用原生选择行为；此例用 text 类型读取 selectionStart/selectionEnd，email 等类型不一定支持文本选区。禁用状态下原生输入框无法获得焦点。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput, type BingInputExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const inputRef = ref<BingInputExpose | null>(null)
const value = ref<string | number | null>('可以通过 ref 控制')
const selection = ref('未选择')
function selectText() {
  inputRef.value?.select()
  const element = inputRef.value?.input
  selection.value = element ? element.value.slice(element.selectionStart ?? 0, element.selectionEnd ?? 0) : '未选择'
}
</script>

<template>
  <BingInput ref="inputRef" v-model="value" block ariaLabel="实例方法输入" />
  <div style="display: flex; gap: 12px; margin-top: 12px">
    <BingButton size="sm" @click="inputRef?.focus()">focus</BingButton>
    <BingButton size="sm" @click="inputRef?.blur()">blur</BingButton>
    <BingButton size="sm" @click="selectText">select</BingButton>
  </div>
  <p role="status">选中文本：{{ selection }}</p>
</template>
```

## 属性

| 属性                      | 类型                                                                          | 默认值                                           | 说明                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                    | `string`                                                                    | `undefined`                                   | 输入框 id；在 BingFormItem 内会自动继承 controlId。                                                                                                          |
| `modelValue`            | `BingInputValue`                                                            | `''`                                          | string \| number \| null；number 类型只发布 number / null，清空为 null。                                                                                    |
| `type`                  | `'text' \| 'search' \| 'email' \| 'password' \| 'tel' \| 'url' \| 'number'` | `'text'`                                      | 原生 input 类型；number 额外显示数值步进按钮。                                                                                                                   |
| `min / max`             | `number \| string`                                                          | `undefined`                                   | 数值输入的原生最小值和最大值约束。                                                                                                                                |
| `step`                  | `number \| string`                                                          | `undefined（原生默认 1）`                           | 数值步长；可用小数或 any。any 的自定义步进按钮每次增减 1。                                                                                                               |
| `clampOnBlur`           | `boolean`                                                                   | `true`                                        | 失焦或 Enter 时按 min/max 和 step 规整；step=any 不对齐。受控拒绝后恢复已接受值。                                                                                         |
| `passwordToggle`        | `boolean`                                                                   | `true`                                        | 密码显隐按钮，切换保留选区；已有业务按钮时显式关闭。                                                                                                                       |
| `prefix / suffix`       | `string`                                                                    | `undefined`                                   | 前后缀文字，如金额符号和 px 单位；同名插槽优先。                                                                                                                       |
| `maxLength / showCount` | `number / boolean`                                                          | `undefined / false`                           | 长度限制和计数；按 UTF-16 长度计算，接近或达到上限时播报。                                                                                                                |
| `loading`               | `boolean`                                                                   | `false`                                       | 显示加载反馈，不改变输入模型或接管请求。                                                                                                                             |
| `scrub`                 | `boolean`                                                                   | `false`                                       | number + prefix 可横向拖动，每 4px 一步，Shift 十倍；Esc / 失焦 / 指针取消撤销。                                                                                       |
| `placeholder`           | `string`                                                                    | `undefined`                                   | 占位文案。                                                                                                                                            |
| `disabled`              | `boolean`                                                                   | `继承 FormItem / Form，否则 false`                 | 禁用输入框；显式 false 可以覆盖表单的禁用状态。                                                                                                                      |
| `readonly`              | `boolean`                                                                   | `false`                                       | 只读，可聚焦和选择文本；隐藏清除按钮并禁用数值步进。                                                                                                                       |
| `clearable`             | `boolean`                                                                   | `search 为 true，其他类型为 false`                   | 有值时是否展示清除按钮；可显式覆盖，禁用或只读时不显示。                                                                                                                     |
| `smoothCaret`           | `boolean`                                                                   | `true`                                        | 约 90ms 的光标位移过渡，组词时跟随原生选区焦点端；自 0.9.0 起聚焦立即定位，普通鼠标按下不切回原生光标。拖选、普通文本选区、无法可靠定位或系统减少动态效果时使用原生光标；该判断由 CSS 媒体查询完成，不受 ConfigProvider 的 reducedMotion 影响。 |
| `icon`                  | `Component`                                                                 | `undefined`                                   | 左侧图标组件。                                                                                                                                          |
| `iconLabel`             | `string`                                                                    | `undefined`                                   | 图标的可访问名称；未传时图标为装饰性。                                                                                                                              |
| `size`                  | `'sm' \| 'md' \| 'lg'`                                                      | `继承 FormItem / Form / ConfigProvider，否则 'md'` | 高度分别为 32 / 36 / 40px。                                                                                                                            |
| `block`                 | `boolean`                                                                   | `false`                                       | 宽度是否撑满父容器。                                                                                                                                       |
| `debounceDelay`         | `number`                                                                    | `180`                                         | debounced-input 事件的防抖延迟，单位毫秒。                                                                                                                    |
| `clearAriaLabel`        | `string`                                                                    | `'清空输入'`                                      | 清除按钮的可访问名称。                                                                                                                                      |
| `ariaLabel`             | `string`                                                                    | `undefined`                                   | 输入框的可访问名称。                                                                                                                                       |
| `ariaDescribedby`       | `string`                                                                    | `undefined`                                   | 关联额外说明元素。                                                                                                                                        |
| `status`                | `'default' \| 'error' \| 'success' \| 'warning'`                            | `undefined`                                   | 输入框状态；在表单内可继承 FormItem 状态。                                                                                                                       |
| `name`                  | `string`                                                                    | `undefined`                                   | 原生 input name。                                                                                                                                   |
| `autocomplete`          | `string`                                                                    | `'off'`                                       | 原生 input autocomplete；需要浏览器自动填充时显式设置。                                                                                                            |
| `spellcheck`            | `boolean \| 'true' \| 'false'`                                              | `undefined`                                   | 原生 input spellcheck。                                                                                                                             |

## 插槽、事件与暴露方法

### 插槽

| 插槽                | 参数  | 说明                             |
| ----------------- | --- | ------------------------------ |
| `icon`            | `-` | 自定义左侧图标内容，会覆盖 icon prop 的默认渲染。 |
| `prefix / suffix` | `-` | 自定义前后缀，覆盖同名字符串属性。              |

### 事件

| 事件                  | 参数                                              | 说明                                                              |
| ------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| `update:modelValue` | `BingInputValue`                                | 文本为 string，数字为 number / null；组词和数字中间态只更新显示。                     |
| `input`             | `(value: string, event: Event)`                 | 普通输入即时触发；组词确认后仅触发一次，event 可为 compositionend 或失焦收尾的 blur；清除不会触发。 |
| `debounced-input`   | `string`                                        | 输入值经过 debounceDelay 防抖后触发；组词期间暂停，确认后重新计时；清除时立即触发空字符串。           |
| `clear`             | `()`                                            | 点击清除按钮时触发，无参数；同时立即发送空字符串的 debounced-input 并取消待发通知。              |
| `focus`             | `FocusEvent`                                    | 输入框获得焦点时触发。                                                     |
| `blur`              | `FocusEvent`                                    | 离开整个控件后触发并通知表单；内部按钮间移动不触发校验。                                    |
| `keydown`           | `KeyboardEvent`                                 | 输入框 keydown 时触发。                                                |
| `enter`             | `(value: BingInputValue, event: KeyboardEvent)` | 非组词 Enter，数字规整后发送；keydown.preventDefault 可阻止。                   |
| `change（原生透传）`      | `Event`                                         | 保持原生 change 参数；前缀拖动释放时为已接受变化发送一次。                               |

### 暴露方法

| 名称         | 类型                         | 说明             |
| ---------- | -------------------------- | -------------- |
| `input`    | `HTMLInputElement \| null` | 当前原生 input 元素。 |
| `focus()`  | `() => void`               | 聚焦输入框。         |
| `blur()`   | `() => void`               | 让输入框失焦。        |
| `select()` | `() => void`               | 选中输入框内的文本。     |
