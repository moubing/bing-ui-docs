# BingTabs

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export tabs；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例中的 options 是演示参数，不代表组件默认值。Tabs 只管理标签栏，内容面板由业务渲染；四个文件各自持有状态。文档站为了方便对照，将基础区和手动激活区的选中值关联，这不是组件自动共享状态。

BingTabs 是横向 tablist 组件，用于在同一页面区域中切换内容分组。它负责渲染可访问的 `role="tablist"` 和 `role="tab"`，处理鼠标点击、键盘方向键、禁用项跳过和活动指示器动画；具体内容面板由业务根据当前 value 自己渲染。

点击碎屑与 Button 共用反馈引擎。从 0.19.0 起，碎屑交由浏览器原生动画推进，选中模型和 change 仍同步通知；活动指示器是独立动画。大量内容首次挂载仍可能延迟碎屑首帧，业务可先更新标签选择、给浏览器绘制机会，再挂载对应内容，并取消已被后续选择替代的任务。相关边界与演示见 [Button 的繁忙页面反馈](/docs/components/button#busy-feedback)。

每个 `value` 必须唯一，类型为 `string | number`；业务比较时要区分数字和字符串。示例使用 `v-model` 同步选中值，`change` 的参数是对象，不是 value 本身。传给组件的可访问名称属性为 `ariaLabel`；完整示例使用这个名称，以兼容严格模板类型检查。

## 基础切换

使用 `items` 描述 tab，使用 `v-model` 保存当前选中值。切换后可以根据当前 value 渲染自己的内容面板。 `smoothScroll` 默认只作用于标签栏溢出时的横向滚轮滚动；设为 `false` 可关闭，点击和键盘定位仍保持即时。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue, BingTabsChangePayload, BingTabsFocusPayload, BingTabsProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingTabsProps = {
  "size": "md",
  "variant": "glass",
  "activation": "auto",
  "block": false,
  "loop": true,
  "animated": true,
  "disabled": false
}

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const active = ref<BingTabValue>('overview')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
const changeLog = ref('等待切换')
const focusLog = ref('等待焦点事件')
function handleChange(payload: BingTabsChangePayload) {
  changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
}
function handleFocus(payload: BingTabsFocusPayload) {
  focusLog.value = `聚焦：${payload.item.label}`
}
function handleBlur(payload: BingTabsFocusPayload) {
  focusLog.value = `失焦：${payload.item.label}`
}
</script>

<template>
  <BingTabs
    v-model="active" :items="items" v-bind="options" ariaLabel="文档分组"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <section aria-live="polite">
    <h2>{{ activeItem?.label }}</h2>
    <p>当前 value：{{ active }}。此内容区域由业务根据选中值渲染。</p>
  </section>
  <p role="status">切换：{{ changeLog }}；{{ focusLog }}</p>
</template>
```

## 样式组合

`variant` 提供 pill、glass、soft 三种样式。pill 使用胶囊外形和实色选中块；glass 使用主题磨砂，默认浅色不透明度 0.86、深色 0.92，模糊 16px、饱和度 1.05；soft 使用中性底色和较弱的选中边框。

sm/md/lg 可见标签栏高度为 32/36/40px，内部标签最小高度为 24/28/32px。外层上下各保留 4px，总占位高度为 40/44/48px；底部空间用于横向滚动条，是否溢出都不会改变组件高度。与文字、按钮放在同一工具栏时，父容器使用 `display: flex; align-items: center` 即可垂直居中。

下面三组分别展示 sm、md、lg 与文字、按钮的对齐。窄屏时长标签保持原宽度，通过横向滚动查看；方向键和 Home/End 会将聚焦项滚入可见范围。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const pillValue = ref<BingTabValue>('overview')
const glassValue = ref<BingTabValue>('overview')
const softValue = ref<BingTabValue>('overview')
</script>

<template>
  <div class="variants">
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="pillValue" :items="items" variant="pill" size="sm" ariaLabel="pill 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="glassValue" :items="items" variant="glass" ariaLabel="glass 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="softValue" :items="items" variant="soft" size="lg" ariaLabel="soft 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
  </div>
  <p>各组独立选中值：{{ pillValue }} / {{ glassValue }} / {{ softValue }}</p>
</template>

<style scoped>
.variants { display: grid; gap: 14px; min-width: 0; }
.tabs-toolbar { display: flex; align-items: center; gap: 12px; min-width: 0; }
.tabs-toolbar__label { flex-shrink: 0; font-size: 12px; line-height: 18px; }
.tabs-toolbar > .bing-button { flex-shrink: 0; margin-left: auto; }
</style>
```

## 自定义标签内容

通过 `item` 插槽可以把业务字段渲染进 tab，例如状态点、数量徽标或更完整的无障碍文案。这些字段可以直接挂在 `BingTabItem` 上。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type RichTabItem = BingTabItem & { tone: string; count: number }
const items: RichTabItem[] = [
  { value: 'design', label: '设计', tone: '#fb7185', count: 12 },
  { value: 'develop', label: '开发', tone: '#38bdf8', count: 6 },
  { value: 'release', label: '发布', tone: '#34d399', count: 3 },
  { value: 'archive', label: '归档', tone: '#94a3b8', count: 0, disabled: true },
]
const active = ref<BingTabValue>('design')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
// 插槽 item 的业务字段类型为 unknown，需要先缩窄再传给样式等强类型位置。
function tone(item: BingTabItem) { return typeof item.tone === 'string' ? item.tone : '#94a3b8' }
function count(item: BingTabItem) { return typeof item.count === 'number' ? item.count : 0 }
</script>

<template>
  <BingTabs v-model="active" :items="items" variant="glass" ariaLabel="任务阶段">
    <template #item="{ item, active: selected, disabled }">
      <span class="dot" :style="{ background: tone(item) }"></span>
      <span>{{ item.label }}</span>
      <small class="badge">{{ count(item) }}</small>
      <span v-if="selected" class="badge">当前</span>
      <span v-if="disabled" class="badge">不可选</span>
    </template>
  </BingTabs>
  <p aria-live="polite">{{ activeItem?.label }}，数量：{{ activeItem?.count }}</p>
</template>

<style scoped>
.dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; }
.badge { padding: 2px 6px; border: 1px solid currentColor; border-radius: 999px; font-size: 12px; }
</style>
```

## 键盘激活模式

`activation="auto"` 下，方向键移动焦点会直接切换选中项；`activation="manual"` 下，方向键只移动焦点，用户按 Enter 或 Space 才切换。当 tab 内容加载较重时，manual 可以避免用户扫过多个 tab 时连续触发内容刷新。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue, BingTabsChangePayload, BingTabsFocusPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const active = ref<BingTabValue>('overview')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
const focusLog = ref('等待焦点事件')
const changeLog = ref('等待切换')
function handleFocus(payload: BingTabsFocusPayload) { focusLog.value = `聚焦：${payload.item.label}` }
function handleBlur(payload: BingTabsFocusPayload) { focusLog.value = `失焦：${payload.item.label}` }
function handleChange(payload: BingTabsChangePayload) {
  changeLog.value = `${payload.previousItem?.label ?? '无'} -> ${payload.item.label}`
}
</script>

<template>
  <BingTabs
    v-model="active" :items="items" activation="manual" :loop="false" variant="soft"
    ariaLabel="手动激活示例" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
  />
  <p role="status">{{ focusLog }}；当前：{{ activeItem?.label }}；切换：{{ changeLog }}</p>
  <p>方向键、Home 和 End 移动焦点；Enter 或空格确认选中。点击标签仍会立即切换。</p>
</template>
```

## Props

| Prop                   | Type                          | Default                                | 说明                                                                                            |
| ---------------------- | ----------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `modelValue`           | `BingTabValue`                | `undefined`                            | 当前选中的 tab value；传入后进入受控模式，支持 v-model。                                                         |
| `items`                | `BingTabItem[]`               | `[]`                                   | tab 列表。每一项至少包含 value 和 label。                                                                 |
| `smoothScroll`         | `SmoothScrollValue`           | `true`                                 | 为标签栏溢出时的横向滚轮滚动启用平滑效果。                                                                         |
| `size`                 | `'sm' \| 'md' \| 'lg'`        | `undefined（继承 ConfigProvider，否则 'md'）` | 可见标签栏高度为 32/36/40px，单个标签最小高度为 24/28/32px。外层上下各留白 4px，总占位 40/44/48px；横向滚动条使用底部预留区，不改变垂直中心或总高度。 |
| `variant`              | `'pill' \| 'glass' \| 'soft'` | `'pill'`                               | 控制视觉风格。                                                                                       |
| `activation`           | `'auto' \| 'manual'`          | `'auto'`                               | 键盘方向键移动焦点时是否自动切换选中项。                                                                          |
| `disabled`             | `boolean`                     | `false`                                | 禁用整个 Tabs。                                                                                    |
| `block`                | `boolean`                     | `false`                                | 是否撑满容器宽度。                                                                                     |
| `loop`                 | `boolean`                     | `true`                                 | 键盘方向键到达边界后是否循环。                                                                               |
| `animated`             | `boolean`                     | `true`                                 | 是否使用 GSAP 移动活动指示器。                                                                            |
| `respectReducedMotion` | `boolean`                     | `true`                                 | 需要减少动效时是否关闭指示器动画；策略来自 ConfigProvider 的 reducedMotion，默认跟随系统。                                  |
| `ariaLabel`            | `string`                      | `'标签页'`                                | tablist 的可访问名称。多个 Tabs 应分别提供可区分名称。                                                            |

## BingTabItem

| 字段              | Type               | 说明                                 |
| --------------- | ------------------ | ---------------------------------- |
| `value`         | `string \| number` | 每个 tab 的唯一值，也是 v-model 的值。         |
| `label`         | `string`           | 默认渲染的 tab 文案。                      |
| `disabled`      | `boolean`          | 禁用当前 tab；点击和键盘切换都会跳过。              |
| `ariaLabel`     | `string`           | 当前 tab 的可访问名称，适合 label 不够完整时补充。    |
| `[key: string]` | `unknown`          | 可挂载 count、tone 等业务字段，配合 item 插槽渲染。 |

## Slots

| Slot   | 参数                                  | 说明                              |
| ------ | ----------------------------------- | ------------------------------- |
| `item` | `{ item, index, active, disabled }` | 自定义每个 tab 的内容。未传时显示 item.label。 |

## Events

| Event               | Payload                 | 说明                                                           |
| ------------------- | ----------------------- | ------------------------------------------------------------ |
| `update:modelValue` | `BingTabValue`          | 选中项变化时触发。                                                    |
| `change`            | `BingTabsChangePayload` | 点击或键盘确认切换后触发，包含 value、previousValue、item、previousItem 和原始事件。 |
| `focus`             | `BingTabsFocusPayload`  | 某个 tab 获得焦点时触发。                                              |
| `blur`              | `BingTabsFocusPayload`  | 某个 tab 失去焦点时触发。                                              |

事件参数类型如下。`previousValue` 和 `previousItem` 可能不存在，读取前应处理空值；点击当前已选中的标签不会产生新的选中值变化。

```ts
type BingTabValue = string | number
interface BingTabItem {
  value: BingTabValue
  label: string
  disabled?: boolean
  ariaLabel?: string
  [key: string]: unknown
}
interface BingTabsChangePayload {
  value: BingTabValue
  previousValue?: BingTabValue
  item: BingTabItem
  previousItem?: BingTabItem
  event: MouseEvent | KeyboardEvent
}
interface BingTabsFocusPayload {
  value: BingTabValue
  item: BingTabItem
  event: FocusEvent
}
```
