# BingAppSwitcherTransition

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export app-switcher-transition；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。受控模型必须同步；外部赋值不会发出 change。全部卡片持续挂载，示例给隐藏内容设置 inert。业务字段先做类型检查，动态列表需有效选择和 key 重建。

BingAppSwitcherTransition 是应用面板切换动效容器。它把多个面板放在同一个舞台里，通过 GSAP 做缩放、位移和聚焦切换，适合仪表盘、设置页、工作台这类需要在复杂状态之间平滑切换的场景。

## 基础切换

传入 `items` 后，组件会为每个 item 创建一张卡片，并在底部自动渲染一组 BingTabs。默认插槽负责渲染卡片内容，`active` 可以用来区分当前面板。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingAppSwitcherTransition, BingButton, type BingAppSwitcherTransitionItem, type BingAppSwitcherTransitionProps, type BingAppSwitcherTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'overview' | 'workflow' | 'metrics'
type DemoPanel = BingAppSwitcherTransitionItem & { value: PanelKey; title: string; summary: string; metric: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'overview',
    label: '总览',
    title: '工作台总览',
    summary: '把当前模块的关键状态压缩成一个可快速阅读的卡片。',
    metric: '24',
    accent: '#52525b',
  },
  {
    value: 'workflow',
    label: '流程',
    title: '流程推进',
    summary: '用于展示从一个应用状态切换到另一个状态时的空间关系。',
    metric: '07',
    accent: '#71717a',
  },
  {
    value: 'metrics',
    label: '指标',
    title: '指标追踪',
    summary: '适合承载带有数据、摘要和下一步操作的复杂面板。',
    metric: '91%',
    accent: '#3f3f46',
  },
]
function field(item: BingAppSwitcherTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('overview')
</script>

<template>
  <div class="frame">
    <BingAppSwitcherTransition v-model="active" :items="panels" ariaLabel="基础应用面板">
      <template #default="{ item, active }">
        <div class="panel" :class="{ 'is-active': active }" :inert="!active" :style="{ '--accent': field(item, 'accent') }">
        <span class="metric">{{ field(item, 'metric') }}</span>
        <div><p>{{ item.label }}</p><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p></div>
      </div>
      </template>
    </BingAppSwitcherTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-app-switcher-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-app-switcher-transition__stage) { min-height: 280px; }
.frame :deep(.bing-app-switcher-transition__card) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.metric { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-app-switcher-transition__stage) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

## 受控切换和配置

`showTabs` 可以隐藏内置 tabs，让外部控制器接管切换；`disabled` 阻止组件内部选择，但外部修改模型仍会切换；`loop` 控制循环边界；`respectReducedMotion` 用来照顾系统动效偏好。

受控用法必须接收更新，例如 `v-model="active"`。只传固定 `modelValue` 并忽略更新，会让卡片动画与模型、激活标记不一致。内部选择会依次触发 `update:modelValue` 和 `change`；外部按钮或业务直接修改模型不会补发事件，也不会等待前一次动画结束。`change` 表示选择请求，不表示动画完成。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingAppSwitcherTransition, BingButton, type BingAppSwitcherTransitionItem, type BingAppSwitcherTransitionProps, type BingAppSwitcherTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'overview' | 'workflow' | 'metrics'
type DemoPanel = BingAppSwitcherTransitionItem & { value: PanelKey; title: string; summary: string; metric: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'overview',
    label: '总览',
    title: '工作台总览',
    summary: '把当前模块的关键状态压缩成一个可快速阅读的卡片。',
    metric: '24',
    accent: '#52525b',
  },
  {
    value: 'workflow',
    label: '流程',
    title: '流程推进',
    summary: '用于展示从一个应用状态切换到另一个状态时的空间关系。',
    metric: '07',
    accent: '#71717a',
  },
  {
    value: 'metrics',
    label: '指标',
    title: '指标追踪',
    summary: '适合承载带有数据、摘要和下一步操作的复杂面板。',
    metric: '91%',
    accent: '#3f3f46',
  },
]
function field(item: BingAppSwitcherTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const options: BingAppSwitcherTransitionProps = {
  "disabled": false,
  "loop": true,
  "showTabs": true,
  "respectReducedMotion": true
}
const active = ref<BingTabValue>('workflow')
const feedback = ref('等待切换')
function changed(payload: BingAppSwitcherTransitionChangePayload) { feedback.value = (payload.previousItem?.label ?? '无') + ' -> ' + payload.item.label }
</script>

<template>
  <div class="actions">
    <BingButton v-for="item in panels" :key="item.value" :throttle="false" variant="secondary" @click="active = item.value">选择{{ item.label }}</BingButton>
  </div>
  <div class="frame">
    <BingAppSwitcherTransition v-model="active" :items="panels" v-bind="options" ariaLabel="应用面板切换" @change="changed">
      <template #default="{ item, active, isAnimating }">
        <div :class="{ 'is-animating': isAnimating }">
          <div class="panel" :class="{ 'is-active': active }" :inert="!active" :style="{ '--accent': field(item, 'accent') }">
        <span class="metric">{{ field(item, 'metric') }}</span>
        <div><p>{{ item.label }}</p><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p></div>
      </div>
        </div>
      </template>
    </BingAppSwitcherTransition>
  </div>
  <p role="status">当前值：{{ active }}；change：{{ feedback }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-app-switcher-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-app-switcher-transition__stage) { min-height: 280px; }
.frame :deep(.bing-app-switcher-transition__card) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.metric { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-app-switcher-transition__stage) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

## 横向滚轮切换

组件根节点会监听 `wheel`。当横向滚动量大于纵向滚动量时，它会拦截这次滚动，并在累计偏移超过阈值后切换到上一张或下一张卡片。这个行为适合触控板横向滑动，但禁用状态下不会触发。

当前版本直接累计 `deltaX`，连续滚动停止约 58ms 后，累计绝对值严格大于 34 才切换一项；不会按 `deltaMode` 换算，也不把 Shift 加纵向滚轮自动转换成横向。动画进行中忽略内部切换。滚轮遇到禁用邻项不会跳过；标签键盘导航会跳过禁用项。即使处于动画中、边界处或邻项禁用，满足横向条件的滚轮事件仍会被 `preventDefault`。

## 默认插槽

插槽会收到当前 item、索引、是否激活以及是否正在动画中。所有卡片一直挂载，切换不会销毁各自状态。示例以 `:inert="!active"` 防止隐藏内容继续获得键盘焦点；组件自身只设置卡片 `aria-hidden`，不会自动设置 inert、关联 tabpanel 或把焦点移进内容。业务字段的类型为 unknown，读取时先缩窄类型。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingAppSwitcherTransition, BingButton, type BingAppSwitcherTransitionItem, type BingAppSwitcherTransitionProps, type BingAppSwitcherTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'overview' | 'workflow' | 'metrics'
type DemoPanel = BingAppSwitcherTransitionItem & { value: PanelKey; title: string; summary: string; metric: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'overview',
    label: '总览',
    title: '工作台总览',
    summary: '把当前模块的关键状态压缩成一个可快速阅读的卡片。',
    metric: '24',
    accent: '#52525b',
  },
  {
    value: 'workflow',
    label: '流程',
    title: '流程推进',
    summary: '用于展示从一个应用状态切换到另一个状态时的空间关系。',
    metric: '07',
    accent: '#71717a',
  },
  {
    value: 'metrics',
    label: '指标',
    title: '指标追踪',
    summary: '适合承载带有数据、摘要和下一步操作的复杂面板。',
    metric: '91%',
    accent: '#3f3f46',
  },
]
function field(item: BingAppSwitcherTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('overview')
const counts = reactive<Record<string, number>>({})
function increment(value: BingTabValue) { const key = String(value); counts[key] = (counts[key] ?? 0) + 1 }
</script>

<template>
  <div class="frame">
    <BingAppSwitcherTransition v-model="active" :items="panels" ariaLabel="插槽应用面板">
      <template #default="{ item, index, active, isAnimating }">
        <div class="panel" :inert="!active" :class="{ 'is-animating': isAnimating }">
          <div><p>第 {{ index + 1 }} 个面板</p><h3>{{ item.label }}</h3><p>{{ active ? '当前展示' : '后台保留' }} · {{ isAnimating ? '切换中' : '静止' }}</p></div>
          <BingButton :throttle="false" @click="increment(item.value)">{{ item.label }}计数：{{ counts[String(item.value)] ?? 0 }}</BingButton>
        </div>
      </template>
    </BingAppSwitcherTransition>
  </div>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-app-switcher-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-app-switcher-transition__stage) { min-height: 280px; }
.frame :deep(.bing-app-switcher-transition__card) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.metric { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-app-switcher-transition__stage) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

### 插槽参数

| 参数            | 类型                              | 说明                |
| ------------- | ------------------------------- | ----------------- |
| `item`        | `BingAppSwitcherTransitionItem` | 当前渲染的 item。       |
| `index`       | `number`                        | 当前卡片在 items 中的索引。 |
| `active`      | `boolean`                       | 当前卡片是否为选中面板。      |
| `isAnimating` | `boolean`                       | 组件是否正在执行切换动画。     |

## 属性

| 属性                     | 类型                                | 默认值         | 说明                                                              |
| ---------------------- | --------------------------------- | ----------- | --------------------------------------------------------------- |
| `modelValue`           | `BingTabValue`                    | `undefined` | 受控当前值。未传时会使用第一个未禁用 item 作为初始面板。                                 |
| `items`                | `BingAppSwitcherTransitionItem[]` | `[]`        | 面板数据。每项至少需要 value 和 label，可额外挂载业务字段给默认插槽使用。                     |
| `disabled`             | `boolean`                         | `false`     | 阻止内置标签和滚轮选择。外部修改模型仍能切换；不会因此取消已经运行的动画。                           |
| `respectReducedMotion` | `boolean`                         | `true`      | 是否遵守减少动效策略（ConfigProvider 的 reducedMotion，默认跟随系统）。开启后会在需要时跳过动画。 |
| `loop`                 | `boolean`                         | `true`      | 是否允许索引循环。影响内置 tabs 的键盘行为和横向滚轮切换边界。                              |
| `showTabs`             | `boolean`                         | `true`      | 是否显示底部内置 BingTabs。隐藏后仍然可以通过 v-model 外部切换。                       |
| `ariaLabel`            | `string`                          | `'应用切换面板'`  | 传给内置 BingTabs 的可访问名称。                                           |

## Item 结构

| 字段              | 类型             | 说明                                                                |
| --------------- | -------------- | ----------------------------------------------------------------- |
| `value`         | `BingTabValue` | 必填，以 Object.is 比较的面板唯一值；String(value) 也必须唯一，避免数字与同名字符串的卡片 key 冲突。 |
| `label`         | `string`       | 必填，内置 tabs 显示的文本。                                                 |
| `disabled`      | `boolean`      | 阻止内部选择此项，横向滚轮遇到禁用邻项不会自动跨过；外部模型赋值不受此限制。                            |
| `ariaLabel`     | `string`       | 当前 tab 的可访问名称。                                                    |
| `[key: string]` | `unknown`      | 可挂载 title、summary、icon 等业务字段，在默认插槽里读取。                            |

## 事件

| 事件                  | 参数                                       | 说明                                                                                    |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------- |
| `update:modelValue` | `BingTabValue`                           | 内部标签或横向滚轮选中新值时触发，用于同步受控模型。外部直接赋值不触发。                                                  |
| `change`            | `BingAppSwitcherTransitionChangePayload` | 内部选择在 update:modelValue 后触发，包含 value、previousValue、item、previousItem；不表示动画完成，外部赋值不触发。 |

## 公开类型与使用边界

| 公开类型                                     | 定义或用途                                                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `BingTabValue`                           | string \| number                                                                                                                           |
| `BingAppSwitcherTransitionProps`         | 上表中的 7 个可选属性。                                                                                                                              |
| `BingAppSwitcherTransitionItem`          | \{ value: BingTabValue; label: string; disabled?: boolean; ariaLabel?: string; \[key: string\]: unknown \}                                 |
| `BingAppSwitcherTransitionSlotProps`     | \{ item: BingAppSwitcherTransitionItem; index: number; active: boolean; isAnimating: boolean \}                                            |
| `BingAppSwitcherTransitionChangePayload` | \{ value: BingTabValue; previousValue?: BingTabValue; item: BingAppSwitcherTransitionItem; previousItem?: BingAppSwitcherTransitionItem \} |
| `BingAppSwitcherTransitionEmits`         | update:modelValue(value: BingTabValue) 与 change(payload: BingAppSwitcherTransitionChangePayload)。                                          |

类型均从 `@moubing/bing-ui` 导入；组件没有公开实例方法。默认插槽省略时显示 item.label。`ariaLabel` 只为内置标签栏命名，隐藏标签后需要业务自行提供内容语义。

初始未传模型时选中首个未禁用项；受控模型应始终命中有效项。无效值可能让首张卡片可见，但没有激活项且所有卡片 aria-hidden。确保 value 唯一且字符串化后仍唯一。空数据先显示业务空态；不要依赖组件修正无效选择。

当前版本没有监听列表重排来重新布局。动态替换、增删、重排 items 时，先选定有效值，再通过业务 key 重建实例。所有面板常驻，昂贵内容或后台任务应自行根据 active 管理。KeepAlive 页面离开时可卸载切换器，取消其动画和横向滚轮计时；文档站保留外部模型和计数，返回时重新挂载。

`respectReducedMotion` 默认尊重系统减少动态效果偏好，在切换时跳过动画；不要依赖系统设置变化立即取消已运行的时间线。示例中的布局 CSS 是业务样式，不是额外的组件属性。
