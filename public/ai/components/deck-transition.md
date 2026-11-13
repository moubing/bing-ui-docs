# BingDeckTransition

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export deck-transition；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。next 来自 controls 插槽，不是公开实例方法。外部赋值直接定位，不发 change；滚轮正负方向均前进。卡片常驻，示例为隐藏内容设置 inert，并给非循环自定义按钮明确的终点状态。

BingDeckTransition 是卡组切换动效容器。它把多个 item 渲染成一摞卡片，点击默认按钮、调用 controls 插槽里的 `next`，或使用横向滚轮时，顶部卡片会飞出并露出下一张。

## 卡组洗牌

默认模式会渲染一个 `切换下一张` 按钮。每次切换只前进到下一张，适合提示卡片、步骤引导、功能亮点这类“逐张翻阅”的内容。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDeckTransition, BingButton, type BingDeckTransitionItem, type BingDeckTransitionProps, type BingDeckTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type PanelKey = 'plan' | 'build' | 'ship'
type DemoCard = BingDeckTransitionItem & { value: PanelKey; title: string; summary: string; step: string; accent: string }
const cards: DemoCard[] = [
  {
    value: 'plan',
    label: '规划',
    title: '确认组件边界',
    summary: '先读源码、类型和测试，把真实行为写进文档。',
    step: '01',
    accent: '#52525b',
  },
  {
    value: 'build',
    label: '编写',
    title: '组合交互示例',
    summary: '用默认插槽承载卡片内容，让文档里的示例真正可操作。',
    step: '02',
    accent: '#71717a',
  },
  {
    value: 'ship',
    label: '验证',
    title: '验证页面与示例',
    summary: '检查类型、导出内容和交互，让示例能独立运行。',
    step: '03',
    accent: '#3f3f46',
  },
]
function field(item: BingDeckTransitionItem, key: string) { const value = item[key]; return typeof value === 'string' ? value : '' }


const active = ref<BingTabValue>('plan')
</script>

<template>

  <div class="frame">
    <BingDeckTransition v-model="active" :items="cards" class="deck">
    <template #default="{ item, active, isAnimating }">
      <div class="story" :inert="!active" :class="{ 'is-animating': isAnimating }" :style="{ '--accent': field(item, 'accent') }">
        <span class="orb">{{ item.label }}</span><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p>
      </div>
    </template>

    </BingDeckTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.deck { width: min(900px, 100%); max-width: 100%; padding: 20px clamp(18px, 4vw, 44px) 74px; }
.story { display: grid; min-width: 0; align-content: center; gap: 16px; color: var(--bing-text, #111827); }
.orb { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-weight: 400; }
.story h3 { margin: 0; font-size: 1.45rem; line-height: 1.25; overflow-wrap: anywhere; }
.story p { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin: 16px 0; }
@media (max-width: 640px) { .deck { padding: 12px 8px 50px; } .deck :deep(.bing-deck-transition__stage) { min-height: 440px; } .deck :deep(.bing-deck-transition__card) { inset: 18px 8px 100px; padding: 18px; } }
</style>
```

## 自定义控制

默认按钮可以用 `controlLabel` 改文案，也可以通过 `controls` 插槽完全接管。插槽会提供 `next`、当前卡片、当前索引和动画状态。

内部 next 成功选择时依次发出 `update:modelValue` 和 `change`，再播放洗牌；模型和 active 表示目标项，不表示动画已结束。受控使用 `v-model` 接收更新；只传固定 modelValue 并忽略更新会导致视觉位置与激活状态不一致。

外部修改模型不会补发 change，并且直接重新定位卡组，不播放洗牌。`disabled` 阻止组件内部选择，无法阻止业务外部赋值。自定义按钮需显式绑定禁用条件，组件不会给 controls 插槽内任意按钮自动加 disabled。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDeckTransition, BingButton, type BingDeckTransitionItem, type BingDeckTransitionProps, type BingDeckTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type PanelKey = 'plan' | 'build' | 'ship'
type DemoCard = BingDeckTransitionItem & { value: PanelKey; title: string; summary: string; step: string; accent: string }
const cards: DemoCard[] = [
  {
    value: 'plan',
    label: '规划',
    title: '确认组件边界',
    summary: '先读源码、类型和测试，把真实行为写进文档。',
    step: '01',
    accent: '#52525b',
  },
  {
    value: 'build',
    label: '编写',
    title: '组合交互示例',
    summary: '用默认插槽承载卡片内容，让文档里的示例真正可操作。',
    step: '02',
    accent: '#71717a',
  },
  {
    value: 'ship',
    label: '验证',
    title: '验证页面与示例',
    summary: '检查类型、导出内容和交互，让示例能独立运行。',
    step: '03',
    accent: '#3f3f46',
  },
]
function field(item: BingDeckTransitionItem, key: string) { const value = item[key]; return typeof value === 'string' ? value : '' }

const options: BingDeckTransitionProps = {
  "disabled": false,
  "loop": true,
  "showControls": true,
  "respectReducedMotion": true
}
const feedback = ref('等待切换')
function changed(payload: BingDeckTransitionChangePayload) { feedback.value = (payload.previousItem?.label ?? '无') + ' -> ' + payload.item.label }

const active = ref<BingTabValue>('build')
</script>

<template>
  <div class="actions"><BingButton v-for="card in cards" :key="card.value" :throttle="false" @click="active = card.value">选择{{ card.label }}</BingButton></div>
  <div class="frame">
    <BingDeckTransition v-model="active" :items="cards" class="deck" controlLabel="下一张" v-bind="options" @change="changed">
    <template #default="{ item, active, isAnimating }">
      <div class="story" :inert="!active" :class="{ 'is-animating': isAnimating }" :style="{ '--accent': field(item, 'accent') }">
        <span class="orb">{{ item.label }}</span><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p>
      </div>
    </template>
    <template #controls="{ next, activeItem, activeIndex, isAnimating }">
      <div class="actions">
        <BingButton :throttle="false" :disabled="isAnimating || options.disabled" @click="next">下一张</BingButton>
        <span>{{ activeItem?.label }} / {{ activeIndex + 1 }}</span>
      </div>
    </template>
    </BingDeckTransition>
  </div>
  <p role="status">当前值：{{ active }}；change：{{ feedback }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.deck { width: min(900px, 100%); max-width: 100%; padding: 20px clamp(18px, 4vw, 44px) 74px; }
.story { display: grid; min-width: 0; align-content: center; gap: 16px; color: var(--bing-text, #111827); }
.orb { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-weight: 400; }
.story h3 { margin: 0; font-size: 1.45rem; line-height: 1.25; overflow-wrap: anywhere; }
.story p { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin: 16px 0; }
@media (max-width: 640px) { .deck { padding: 12px 8px 50px; } .deck :deep(.bing-deck-transition__stage) { min-height: 440px; } .deck :deep(.bing-deck-transition__card) { inset: 18px 8px 100px; padding: 18px; } }
</style>
```

以下示例关闭循环，并在最后一张禁用自定义“下一张”按钮；“返回第一张”是业务外部赋值。`next` 仅由 controls 插槽提供，不是组件 ref 的公开方法。`showControls=false` 连同自定义 controls 插槽一起隐藏，但不关闭滚轮。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingDeckTransition, BingButton, type BingDeckTransitionItem, type BingDeckTransitionProps, type BingDeckTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type PanelKey = 'plan' | 'build' | 'ship'
type DemoCard = BingDeckTransitionItem & { value: PanelKey; title: string; summary: string; step: string; accent: string }
const cards: DemoCard[] = [
  {
    value: 'plan',
    label: '规划',
    title: '确认组件边界',
    summary: '先读源码、类型和测试，把真实行为写进文档。',
    step: '01',
    accent: '#52525b',
  },
  {
    value: 'build',
    label: '编写',
    title: '组合交互示例',
    summary: '用默认插槽承载卡片内容，让文档里的示例真正可操作。',
    step: '02',
    accent: '#71717a',
  },
  {
    value: 'ship',
    label: '验证',
    title: '验证页面与示例',
    summary: '检查类型、导出内容和交互，让示例能独立运行。',
    step: '03',
    accent: '#3f3f46',
  },
]
function field(item: BingDeckTransitionItem, key: string) { const value = item[key]; return typeof value === 'string' ? value : '' }


const active = ref<BingTabValue>('plan')
</script>

<template>
  <BingButton :throttle="false" @click="active = 'plan'">返回第一张</BingButton>
  <div class="frame">
    <BingDeckTransition v-model="active" :items="cards" class="deck" controlLabel="下一张" :loop="false">
    <template #default="{ item, active, isAnimating }">
      <div class="story" :inert="!active" :class="{ 'is-animating': isAnimating }" :style="{ '--accent': field(item, 'accent') }">
        <span class="orb">{{ item.label }}</span><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p>
      </div>
    </template>
    <template #controls="{ next, activeItem, activeIndex, isAnimating }">
      <div class="actions">
        <BingButton :throttle="false" :disabled="isAnimating || activeIndex >= cards.length - 1" @click="next">下一张</BingButton>
        <span>{{ activeItem?.label }} / {{ activeIndex + 1 }}</span>
      </div>
    </template>
    </BingDeckTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.deck { width: min(900px, 100%); max-width: 100%; padding: 20px clamp(18px, 4vw, 44px) 74px; }
.story { display: grid; min-width: 0; align-content: center; gap: 16px; color: var(--bing-text, #111827); }
.orb { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-weight: 400; }
.story h3 { margin: 0; font-size: 1.45rem; line-height: 1.25; overflow-wrap: anywhere; }
.story p { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin: 16px 0; }
@media (max-width: 640px) { .deck { padding: 12px 8px 50px; } .deck :deep(.bing-deck-transition__stage) { min-height: 440px; } .deck :deep(.bing-deck-transition__card) { inset: 18px 8px 100px; padding: 18px; } }
</style>
```

## 横向滚轮

组件会监听根节点的 `wheel`。当横向滚动量大于纵向滚动量，并且横向绝对值超过 24 时，会触发一次 `next()`。禁用状态或动画进行中不会执行 next。

滚轮不累计、不等待手势结束，不换算 deltaMode。单次横向绝对值必须严格大于 24；正负方向都会前进下一张，不提供上一张操作。满足横向条件时，即使不足阈值、动画中或已到边界，仍会 preventDefault。减少动态效果时切换很快，连续事件可能连续前进多项；需要精确逐张操作可使用按钮或在业务外层拦截滚轮。

## 属性

| 属性                     | 类型                         | 默认值         | 说明                                                                 |
| ---------------------- | -------------------------- | ----------- | ------------------------------------------------------------------ |
| `modelValue`           | `BingTabValue`             | `undefined` | 受控当前值。未传时使用第一个未禁用 item。                                            |
| `items`                | `BingDeckTransitionItem[]` | `[]`        | 卡片数据。每项至少需要 value 和 label，也可以附加业务字段供插槽读取。                          |
| `disabled`             | `boolean`                  | `false`     | 阻止内部 next 与滚轮；外部模型仍可定位，已运行的动画不会因此自动取消。                             |
| `respectReducedMotion` | `boolean`                  | `true`      | 是否遵守减少动效策略（ConfigProvider 的 reducedMotion，默认跟随系统）。开启后需要时会直接设置卡组位置。 |
| `loop`                 | `boolean`                  | `true`      | 是否循环。false 时最后一张继续 next 不发更新。默认按钮仍可点击，业务可在 controls 插槽中自行禁用。       |
| `showControls`         | `boolean`                  | `true`      | 是否显示默认控制或 controls 插槽。                                             |
| `controlLabel`         | `string`                   | `'切换下一张'`   | 默认控制按钮文本。                                                          |

## 插槽

所有卡片一直挂载。示例给默认插槽的隐藏业务内容设置 `:inert="!active"`，避免焦点进入不可见卡片；组件自身只设置 aria-hidden，不管理业务控件焦点或提供 tabpanel。额外业务字段是 unknown，读取前先做类型检查。省略默认插槽时显示 item.label。

| 插槽参数                   | 类型                                    | 说明                  |
| ---------------------- | ------------------------------------- | ------------------- |
| `default.item`         | `BingDeckTransitionItem`              | 当前渲染的卡片数据。          |
| `default.index`        | `number`                              | 当前卡片索引。             |
| `default.active`       | `boolean`                             | 当前卡片是否在最上层。         |
| `default.isAnimating`  | `boolean`                             | 卡组是否正在洗牌动画中。        |
| `controls.next`        | `() => void`                          | 切换到下一张。             |
| `controls.activeItem`  | `BingDeckTransitionItem \| undefined` | 当前最上层卡片。            |
| `controls.activeIndex` | `number`                              | 当前最上层索引。            |
| `controls.isAnimating` | `boolean`                             | 是否正在动画中，可用于禁用自定义按钮。 |

## Item 结构

| 字段              | 类型             | 说明                                                     |
| --------------- | -------------- | ------------------------------------------------------ |
| `value`         | `BingTabValue` | 必填，以 Object.is 比较的唯一值；String(value) 也必须唯一，防止卡片 key 冲突。 |
| `label`         | `string`       | 必填，默认内容或控制文案可使用。                                       |
| `disabled`      | `boolean`      | 内部 next 命中禁用项时停止，不会自动跳过；外部模型仍可定位到此项。                   |
| `[key: string]` | `unknown`      | 可挂载 title、summary、accent 等业务字段。                        |

## 事件

| 事件                  | 参数                                | 说明                                                                                    |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| `update:modelValue` | `BingTabValue`                    | 内部 next 成功选择时首先发出，受控模式需要同步。外部直接赋值不触发。                                                 |
| `change`            | `BingDeckTransitionChangePayload` | 内部选择在 update:modelValue 后发出，包含 value、previousValue、item、previousItem；不表示动画完成，外部赋值不触发。 |

## 公开类型与使用边界

| 公开类型                                  | 定义或用途                                                                                                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `BingTabValue`                        | string \| number                                                                                                             |
| `BingDeckTransitionProps`             | 上表中的 7 个可选属性。                                                                                                                |
| `BingDeckTransitionItem`              | \{ value: BingTabValue; label: string; disabled?: boolean; \[key: string\]: unknown \}                                       |
| `BingDeckTransitionSlotProps`         | \{ item: BingDeckTransitionItem; index: number; active: boolean; isAnimating: boolean \}                                     |
| `BingDeckTransitionControlsSlotProps` | \{ next: () =\> void; activeItem?: BingDeckTransitionItem; activeIndex: number; isAnimating: boolean \}                      |
| `BingDeckTransitionChangePayload`     | \{ value: BingTabValue; previousValue?: BingTabValue; item: BingDeckTransitionItem; previousItem?: BingDeckTransitionItem \} |
| `BingDeckTransitionEmits`             | update:modelValue(value: BingTabValue) 与 change(payload: BingDeckTransitionChangePayload)。                                   |

类型从 `@moubing/bing-ui` 导入。组件没有公开实例方法，也没有上一张、自动播放、拖拽或动画时长属性。默认按钮在动画中或最后一张仍可能显示为可用，但内部 next 会忽略相应操作；自定义按钮可结合 isAnimating 和 activeIndex 提供清楚的状态。

未传模型时初始选择首个未禁用项；next 只尝试相邻项，不跳过禁用卡片。需要跳过的业务自行计算有效值并外部赋值。模型要命中有效项，值与字符串化的 key 均须唯一；无效值可能让首张卡片可见且 controls.activeItem 指向首项，但所有卡片都未激活。空列表先显示业务空态。

组件没有监听列表重排来重新布局，动态替换或增删 items 后应选择有效值并用业务 key 重建。适合少量卡片；大量卡片仍会常驻，后台任务按 active 自行管理。文档站离开 KeepAlive 页面时卸载实例以清理动画，返回保持外部模型并重新挂载。

respectReducedMotion 默认尊重系统减少动态效果偏好，在 next 执行时直接设置布局；不保证系统设置变化立即取消正在运行的时间线。
