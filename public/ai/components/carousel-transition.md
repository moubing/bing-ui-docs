# BingCarouselTransition

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export carousel-transition；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。受控模型必须同步，外部赋值不触发 change。全部面板常驻，示例为隐藏内容设置 inert。滚轮示例使用全部可用的项目；0.5.3 滚轮遇禁用项会造成轨道与模型不一致，详见正文。

BingCarouselTransition 是轮播式面板过渡容器。它把每个 item 渲染为一页，通过 GSAP 移动横向 track，适合展示连续的状态页、看板卡片或需要保留左右方向感的内容切换。

## 滑动轨道

组件内部由 `viewport` 和横向 `track` 组成，当前面板通过`xPercent` 移动到视口中。默认会显示顶部 BingTabs，用于点击或键盘切换。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingCarouselTransition, BingButton, type BingCarouselTransitionItem, type BingCarouselTransitionProps, type BingCarouselTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'snapshot' | 'activity' | 'insight'
type DemoPanel = BingCarouselTransitionItem & { value: PanelKey; title: string; summary: string; badge: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'snapshot',
    label: '概览',
    title: '当前状态快照',
    summary: '用一张固定宽度的面板承载当前模块最重要的概览信息。',
    badge: 'Now',
    accent: '#52525b',
  },
  {
    value: 'activity',
    label: '动态',
    title: '最近活动',
    summary: '横向滑动可以保留前后面板的空间方向，适合连续内容。',
    badge: '12',
    accent: '#71717a',
  },
  {
    value: 'insight',
    label: '洞察',
    title: '下一步洞察',
    summary: '默认插槽可以渲染任意业务内容，而不是只展示纯文本。',
    badge: 'AI',
    accent: '#3f3f46',
  },
]
function field(item: BingCarouselTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('snapshot')
</script>

<template>
  <div class="frame">
    <BingCarouselTransition v-model="active" :items="panels" ariaLabel="基础轮播面板">
      <template #default="{ item, active }">
        <div class="panel" :class="{ 'is-active': active }" :inert="!active" :style="{ '--accent': field(item, 'accent') }">
        <span class="badge">{{ field(item, 'badge') }}</span>
        <div><p>{{ item.label }}</p><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p></div>
      </div>
      </template>
    </BingCarouselTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-carousel-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-carousel-transition__viewport) { min-height: 280px; }
.frame :deep(.bing-carousel-transition__panel) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.badge { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-carousel-transition__viewport) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

## 受控切换和配置

当需要把切换交给外部工具栏或表单控制时，可以隐藏 `showTabs`。`disabled` 阻止内部选择，外部修改模型仍可切换；`loop` 控制边界；`respectReducedMotion`会在系统要求减少动效时直接定位到目标面板。

内部选择依次发出 `update:modelValue` 和 `change`，外部赋值不会补发事件；`change` 不表示动画完成。受控模式必须同步更新，使用 `v-model`；忽略更新会让轨道位置与模型和 aria-hidden 不一致。内部标签可以中断动画选择新面板，横向滚轮则在动画期间被忽略。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingCarouselTransition, BingButton, type BingCarouselTransitionItem, type BingCarouselTransitionProps, type BingCarouselTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'snapshot' | 'activity' | 'insight'
type DemoPanel = BingCarouselTransitionItem & { value: PanelKey; title: string; summary: string; badge: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'snapshot',
    label: '概览',
    title: '当前状态快照',
    summary: '用一张固定宽度的面板承载当前模块最重要的概览信息。',
    badge: 'Now',
    accent: '#52525b',
  },
  {
    value: 'activity',
    label: '动态',
    title: '最近活动',
    summary: '横向滑动可以保留前后面板的空间方向，适合连续内容。',
    badge: '12',
    accent: '#71717a',
  },
  {
    value: 'insight',
    label: '洞察',
    title: '下一步洞察',
    summary: '默认插槽可以渲染任意业务内容，而不是只展示纯文本。',
    badge: 'AI',
    accent: '#3f3f46',
  },
]
function field(item: BingCarouselTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const options: BingCarouselTransitionProps = {
  "disabled": false,
  "loop": true,
  "showTabs": true,
  "respectReducedMotion": true
}
const active = ref<BingTabValue>('activity')
const feedback = ref('等待切换')
function changed(payload: BingCarouselTransitionChangePayload) { feedback.value = (payload.previousItem?.label ?? '无') + ' -> ' + payload.item.label }
</script>

<template>
  <div class="actions">
    <BingButton v-for="item in panels" :key="item.value" :throttle="false" variant="secondary" @click="active = item.value">选择{{ item.label }}</BingButton>
  </div>
  <div class="frame">
    <BingCarouselTransition v-model="active" :items="panels" v-bind="options" ariaLabel="轮播面板切换" @change="changed">
      <template #default="{ item, active, isAnimating }">
        <div :class="{ 'is-animating': isAnimating }">
          <div class="panel" :class="{ 'is-active': active }" :inert="!active" :style="{ '--accent': field(item, 'accent') }">
        <span class="badge">{{ field(item, 'badge') }}</span>
        <div><p>{{ item.label }}</p><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p></div>
      </div>
        </div>
      </template>
    </BingCarouselTransition>
  </div>
  <p role="status">当前值：{{ active }}；change：{{ feedback }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-carousel-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-carousel-transition__viewport) { min-height: 280px; }
.frame :deep(.bing-carousel-transition__panel) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.badge { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-carousel-transition__viewport) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

## 横向滚轮

当横向滚动量大于纵向滚动量时，组件会阻止默认滚动，并让 track 先产生一段预览偏移。偏移累计超过阈值后会切换面板，否则回到当前面板。这个行为主要服务触控板横向滑动。

当前版本累计原始 `deltaX`，横向滚动停止约 72ms 后，绝对累计量严格大于 42 才尝试切换一项；预览偏移为累计量除以 7 并限制到 ±32%。较小位移回弹，不发 change。不会按 deltaMode 换算，也不会把 Shift 加纵向滚轮转换成横向。边界和动画期间仍可能阻止默认滚动。

**禁用项限制：当前滚轮结束逻辑无论选择是否成功，都会移动轨道。邻项禁用时，模型不变且没有更新事件，画面仍可能滑向禁用项。** 需要禁用项的业务可在外层用 `@wheel.capture.stop` 拦截滚轮，改用标签或外部控制；内置标签键盘会跳过禁用项。本页滚轮示例的所有项目均可用。

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingCarouselTransition, BingButton, type BingCarouselTransitionItem, type BingCarouselTransitionProps, type BingCarouselTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'snapshot' | 'activity' | 'insight'
type DemoPanel = BingCarouselTransitionItem & { value: PanelKey; title: string; summary: string; badge: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'snapshot',
    label: '概览',
    title: '当前状态快照',
    summary: '用一张固定宽度的面板承载当前模块最重要的概览信息。',
    badge: 'Now',
    accent: '#52525b',
  },
  {
    value: 'activity',
    label: '动态',
    title: '最近活动',
    summary: '横向滑动可以保留前后面板的空间方向，适合连续内容。',
    badge: '12',
    accent: '#71717a',
  },
  {
    value: 'insight',
    label: '洞察',
    title: '下一步洞察',
    summary: '默认插槽可以渲染任意业务内容，而不是只展示纯文本。',
    badge: 'AI',
    accent: '#3f3f46',
  },
]
function field(item: BingCarouselTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('snapshot')
const counts = reactive<Record<string, number>>({})
function increment(value: BingTabValue) { const key = String(value); counts[key] = (counts[key] ?? 0) + 1 }
</script>

<template>
  <div class="frame">
    <BingCarouselTransition v-model="active" :items="panels" :loop="false" ariaLabel="滚轮轮播面板">
      <template #default="{ item, index, active, isAnimating }">
        <div class="panel" :inert="!active" :class="{ 'is-animating': isAnimating }">
          <div><p>第 {{ index + 1 }} 个面板</p><h3>{{ item.label }}</h3><p>{{ active ? '当前展示' : '后台保留' }} · {{ isAnimating ? '切换中' : '静止' }}</p></div>
          <BingButton :throttle="false" @click="increment(item.value)">{{ item.label }}计数：{{ counts[String(item.value)] ?? 0 }}</BingButton>
        </div>
      </template>
    </BingCarouselTransition>
  </div>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-carousel-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-carousel-transition__viewport) { min-height: 280px; }
.frame :deep(.bing-carousel-transition__panel) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.badge { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-carousel-transition__viewport) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
```

## 默认插槽

默认插槽接收当前 item、索引、激活状态和动画状态。全部面板持续挂载，示例中的计数会保留。隐藏卡片只有 aria-hidden，组件不自动提供 inert、tabpanel 关联或内容焦点管理；示例为业务内容设置 `:inert="!active"`。面板内容建议保持稳定高度。业务字段为 unknown，使用前先缩窄类型。

| 参数            | 类型                           | 说明                |
| ------------- | ---------------------------- | ----------------- |
| `item`        | `BingCarouselTransitionItem` | 当前渲染的 item。       |
| `index`       | `number`                     | 当前卡片在 items 中的索引。 |
| `active`      | `boolean`                    | 当前卡片是否为选中面板。      |
| `isAnimating` | `boolean`                    | 组件是否正在执行切换动画。     |

## 属性

| 属性                     | 类型                             | 默认值         | 说明                                                              |
| ---------------------- | ------------------------------ | ----------- | --------------------------------------------------------------- |
| `modelValue`           | `BingTabValue`                 | `undefined` | 受控当前值。未传时会使用第一个未禁用 item 作为初始面板。                                 |
| `items`                | `BingCarouselTransitionItem[]` | `[]`        | 面板数据。每项至少需要 value 和 label，可额外挂载业务字段给默认插槽使用。                     |
| `disabled`             | `boolean`                      | `false`     | 阻止内置标签和滚轮选择。外部修改模型仍能切换；不会因此取消已经运行的动画。                           |
| `respectReducedMotion` | `boolean`                      | `true`      | 是否遵守减少动效策略（ConfigProvider 的 reducedMotion，默认跟随系统）。开启后会在需要时跳过动画。 |
| `loop`                 | `boolean`                      | `true`      | 是否允许索引循环。影响内置 tabs 的键盘行为和横向滚轮切换边界。                              |
| `showTabs`             | `boolean`                      | `true`      | 是否显示顶部内置 BingTabs。隐藏后仍然可以通过 v-model 外部切换。                       |
| `ariaLabel`            | `string`                       | `'轮播切换面板'`  | 传给内置 BingTabs 的可访问名称。                                           |

## Item 结构

| 字段              | 类型             | 说明                                                                |
| --------------- | -------------- | ----------------------------------------------------------------- |
| `value`         | `BingTabValue` | 必填，以 Object.is 比较的面板唯一值；String(value) 也必须唯一，避免数字与同名字符串的卡片 key 冲突。 |
| `label`         | `string`       | 必填，内置 tabs 显示的文本。                                                 |
| `disabled`      | `boolean`      | 阻止标签选中此项，外部赋值不受限制；横向滚轮仍可能将轨道移向禁用项，详见正文。                           |
| `ariaLabel`     | `string`       | 当前 tab 的可访问名称。                                                    |
| `[key: string]` | `unknown`      | 可挂载 title、summary、icon 等业务字段，在默认插槽里读取。                            |

## 事件

| 事件                  | 参数                                    | 说明                                                                                    |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `update:modelValue` | `BingTabValue`                        | 内部标签或横向滚轮选中新值时触发，用于同步受控模型。外部直接赋值不触发。                                                  |
| `change`            | `BingCarouselTransitionChangePayload` | 内部选择在 update:modelValue 后触发，包含 value、previousValue、item、previousItem；不表示动画完成，外部赋值不触发。 |

## 公开类型与使用边界

| 公开类型                                  | 定义或用途                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `BingTabValue`                        | string \| number                                                                                                                     |
| `BingCarouselTransitionProps`         | 上表中的 7 个可选属性。                                                                                                                        |
| `BingCarouselTransitionItem`          | \{ value: BingTabValue; label: string; disabled?: boolean; ariaLabel?: string; \[key: string\]: unknown \}                           |
| `BingCarouselTransitionSlotProps`     | \{ item: BingCarouselTransitionItem; index: number; active: boolean; isAnimating: boolean \}                                         |
| `BingCarouselTransitionChangePayload` | \{ value: BingTabValue; previousValue?: BingTabValue; item: BingCarouselTransitionItem; previousItem?: BingCarouselTransitionItem \} |
| `BingCarouselTransitionEmits`         | update:modelValue(value: BingTabValue) 与 change(payload: BingCarouselTransitionChangePayload)。                                       |

类型从 `@moubing/bing-ui` 导入。组件没有公开实例方法，也不提供自动播放、拖拽或自定义动画时长属性。默认插槽省略时显示 item.label；ariaLabel 只为顶部标签栏命名。

未提供模型时，初始使用首个未禁用项。模型必须命中有效项，value 以 [Object.is](http://Object.is) 比较，字符串化后也应唯一。无效模型可能显示首个面板，但没有激活项且所有面板 aria-hidden；空列表应渲染业务空态。

组件没有监听列表重排来重新定位轨道；替换、增删或重排 items 后应选定有效值并通过业务 key 重建。所有面板常驻，后台任务需按 active 自行管理。文档站在 KeepAlive 页面离开时卸载实例，取消动画和滚轮计时，返回时保留外部状态重新挂载。

respectReducedMotion 默认尊重系统减少动态效果偏好，切换时直接定位；不保证偏好变化立即取消已运行的动画。disabled 同样不会自行清理正在运行的动画。loop=false 只控制内部索引边界，外部模型仍由业务负责。
