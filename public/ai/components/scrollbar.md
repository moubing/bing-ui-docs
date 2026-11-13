# BingScrollbar

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export scrollbar；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。纵横轴开关控制自定义轨道与组件插值，不能据此判断原生内容不可滚动。实例方法挂载后调用；stop 取消组件插值，不取消浏览器原生 smooth 动画。

从 0.7.2 起，启用的滚动方向固定预留轨道空间，内容溢出时只改变轨道可见性，不挤动正文。默认纵向占右侧，可通过公开 CSS 变量 `--bing-scrollbar-gutter-left: var(--bing-scrollbar-gutter)` 同时预留左侧空间，使居中页面保持对称。自定义 viewport 的布局由调用方负责，同样应始终预留空间。

BingScrollbar 是自定义滚动容器，用于在保留原生滚动能力的同时，提供更统一的滚动条视觉和默认开启的平滑滚动。它支持纵向和横向滚动、hover/滚动时显示轨道、拖拽滑块、点击轨道跳转，以及通过 expose 方法主动滚动。

滚动内容放在默认插槽。独立使用时从 `@moubing/bing-ui` 导入组件，并导入 `@moubing/bing-ui/style.css`。类型使用公开导出的 `BingScrollbarProps`、`BingScrollbarSmoothOptions` 和 `BingScrollbarExpose`。

## 基础滚动

默认启用纵向滚动。设置 `height` 或 `maxHeight` 后，如果内容超过容器高度，组件会计算滑块大小和位置，并隐藏浏览器原生滚动条。

`vertical` 和 `horizontal` 控制对应自定义轨道与组件插值，原生 viewport 仍为 `overflow: auto`；关闭轴开关不等于禁止该方向滚动。`disabled` 才会隐藏 overflow 并移除轨道和 tabindex，但实例方法仍可滚动。可聚焦条件是启用方向存在超过容差的溢出、`focusable=true` 且未禁用；容差最小为 1px。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingScrollbar, type BingScrollbarProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingScrollbarProps = {
  "height": "300px",
  "minThumbSize": 28,
  "overflowTolerance": 1,
  "vertical": true,
  "horizontal": false,
  "always": true,
  "disabled": false
}
const items = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1, title: `交互层 ${index + 1}`,
  description: index % 2 === 0 ? '动效反馈和状态展示。' : '稳定的结构内容区域。',
}))
const feedback = ref('等待滚动')
function handleScroll(event: Event) {
  const viewport = event.currentTarget as HTMLElement
  feedback.value = `scrollTop: ${Math.round(viewport.scrollTop)} / scrollLeft: ${Math.round(viewport.scrollLeft)}`
}
</script>

<template>
  <BingScrollbar v-bind="options" ariaLabel="组件列表" @scroll="handleScroll">
    <div class="list"><article v-for="item in items" :key="item.id"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></article></div>
  </BingScrollbar>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.list { display: grid; gap: 8px; padding: 10px; }
article { display: grid; gap: 4px; padding: 14px; border: 1px solid var(--bing-border); border-radius: 8px; }
</style>
```

## 横向滚动

横向滚动需要显式设置 `horizontal`。如果内容宽度超过 viewport，组件会显示横向轨道；按住 Shift 使用滚轮时，会把滚轮位移映射到横向滚动。

```vue
<script setup lang="ts">
import { BingScrollbar } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const columns = Array.from({ length: 10 }, (_, index) => ({ id: index + 1, title: `Column ${index + 1}` }))
</script>

<template>
  <BingScrollbar height="180px" horizontal always ariaLabel="横向内容">
    <div class="lane"><article v-for="column in columns" :key="column.id"><strong>{{ column.title }}</strong><p>横向滚动内容块。</p></article></div>
  </BingScrollbar>
</template>

<style scoped>
.lane { display: grid; grid-template-columns: repeat(10, 160px); gap: 8px; padding: 10px; }
article { height: 130px; box-sizing: border-box; padding: 14px; border: 1px solid var(--bing-border); border-radius: 8px; }
</style>
```

## 平滑滚动与原生回退

`smooth` 默认为 `true`，鼠标滚轮和聚焦后的键盘输入会经过脉冲缓动与连续输入加速。传入配置对象可以覆盖默认参数；传 `false` 时普通纵向输入由浏览器处理。当前仍保留横向 Shift+滚轮兼容处理及其插值，不能把 `smooth=false` 理解为所有输入都停止插值。

0.7.0 将滑块位置更新与内容渲染分离，滚动时无需因为滑块位移重新渲染默认插槽。默认平滑滚动、轨道点击、滑块拖动和键盘操作保持原有行为。

默认不会二次处理高精度触控板输入，并且默认尊重 `prefers-reduced-motion`；放在 BingConfigProvider 中时改由其 `reducedMotion` 策略决定。事件来自内部可滚动元素时，内部元素优先消费；到达边界后，滚动可以继续交给外层容器。

0.11.2 修复了 Chromium 页面缩放后鼠标档位取整引起的误判，例如 110% 下 `wheelDeltaY=-109`、`deltaY≈90.909` 不再回退为原生滚动。组件仍使用事件给出的 CSS 像素距离，不放大步长；触控板及 Ctrl+滚轮缩放手势保留原有处理。可在下方示例中切换 100%、110%、125% 页面缩放比较惯性。

```vue
<script setup lang="ts">
import { BingScrollbar } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const items = Array.from({ length: 18 }, (_, index) => `滚动内容 ${index + 1}`)
</script>

<template>
  <p>可切换浏览器 100%、110%、125% 缩放后再滚动，比较组件惯性与原生滚动。</p>
  <div class="comparison">
    <div><p>组件平滑插值</p><BingScrollbar height="260px" :smooth="{ duration: 400, stepSize: 100, respectReducedMotion: true }" ariaLabel="平滑滚动示例">
      <p v-for="item in items" :key="item" class="row">{{ item }}</p>
    </BingScrollbar></div>
    <div><p>浏览器原生纵向滚动</p><BingScrollbar height="260px" :smooth="false" ariaLabel="原生滚动示例">
      <p v-for="item in items" :key="item" class="row">{{ item }}</p>
    </BingScrollbar></div>
  </div>
</template>

<style scoped>
.comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 20px; }
.comparison > div { min-width: 0; }
.row { margin: 0 10px; padding: 18px 8px; border-bottom: 1px solid var(--bing-border); }
</style>
```

## 主动滚动

通过 ref 可以调用 `scrollTo`、`scrollBy` 和 `update`。这些方法适合目录定位、日志面板跳到底部、内容异步变化后重新计算滑块。

数字参数立即设置纵向位置或增量；对象参数转给浏览器原生方法。`stop()` 只取消组件自己的插值，不能停止 `scrollTo({ behavior: 'smooth' })` 产生的浏览器动画。组件会自动观察尺寸；修改 Vue 内容后如需手动更新，应先 `await nextTick()`。

`handleWheel(event)` 可转交外部滚轮事件，返回是否消费，消费时组件内部会调用 `preventDefault()`。外部监听不要设为 passive，也不要无条件使用 `.prevent`，否则无法保留未消费事件的默认行为。示例的虚线区域可实际演示这一点。

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingScrollbar, type BingScrollbarExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scrollbar = ref<BingScrollbarExpose | null>(null)
const count = ref(36)
const feedback = ref('等待调用')
function top() { scrollbar.value?.scrollTo(0); feedback.value = 'scrollTo(0)' }
function down() { scrollbar.value?.scrollBy(120); feedback.value = 'scrollBy(120)' }
function bottom() { scrollbar.value?.scrollTo({ top: 9999, behavior: 'smooth' }); feedback.value = '原生平滑滚动到底部' }
function stop() { scrollbar.value?.stop(); feedback.value = '停止组件插值' }
async function add() { count.value += 10; await nextTick(); scrollbar.value?.update(); feedback.value = '已追加并更新' }
function forwardWheel(event: WheelEvent) {
  feedback.value = `外部滚轮消费：${scrollbar.value?.handleWheel(event) ?? false}`
}
</script>

<template>
  <div class="forward" @wheel="forwardWheel">在这里使用滚轮，将事件转交给下方列表。</div>
  <BingScrollbar ref="scrollbar" height="260px" always ariaLabel="日志列表">
    <div class="logs"><p v-for="index in count" :key="index">{{ index }}：组件状态已同步。</p></div>
  </BingScrollbar>
  <div class="actions">
    <BingButton size="sm" :throttle="false" @click="top">顶部</BingButton>
    <BingButton size="sm" :throttle="false" @click="down">下移 120</BingButton>
    <BingButton size="sm" :throttle="false" @click="bottom">底部</BingButton>
    <BingButton size="sm" :throttle="false" @click="stop">停止组件插值</BingButton>
    <BingButton size="sm" :throttle="false" @click="add">追加并更新</BingButton>
  </div>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.forward { padding: 12px; border: 1px dashed var(--bing-border); }
.logs { padding: 10px; }
.logs p { margin: 0; padding: 12px; border-bottom: 1px solid var(--bing-border); }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
</style>
```

## 自定义滚动元素

0.6.0 新增 `viewport` 插槽，可以把自定义滚动条接到原生 textarea 等真实滚动元素。将 `viewportRef` 作为 ref 回调、`viewportAttrs` 整体绑定到同一个 DOM 元素；不要把组件实例或包裹层当作视口。

此插槽替换默认 viewport，组件不再额外创建 region 或 tabindex。业务负责原生元素的标签、尺寸、overflow、readonly/disabled 及焦点样式。原生输入框保留文本编辑和光标方向键，不会被改造成普通滚动区域；输入会触发轨道更新，程序修改文本后可等待 nextTick 再调用 update()。

下面的编辑器可输入、切换只读、追加内容和程序滚动；自定义滚动条只负责同步已有视口。

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingCheckbox, BingScrollbar, type BingScrollbarExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scrollbar = ref<BingScrollbarExpose | null>(null)
const readonly = ref(false)
const text = ref(Array.from({ length: 30 }, (_, index) => `日志 ${index + 1}：可以编辑的原生文本`).join('\n'))
async function append() { text.value += '\n追加日志：程序更新后重新测量'; await nextTick(); scrollbar.value?.update() }
</script>

<template>
  <div class="actions">
    <BingCheckbox v-model="readonly" label="只读编辑器" />
    <BingButton variant="secondary" @click="append">追加日志</BingButton>
    <BingButton variant="secondary" @click="scrollbar?.scrollTo(180)">滚动到 180</BingButton>
  </div>
  <BingScrollbar ref="scrollbar" :height="220" always>
    <template #viewport="{ viewportRef, viewportAttrs }">
      <textarea :ref="viewportRef" v-bind="viewportAttrs" v-model="text" class="text-viewport" :readonly="readonly" aria-label="自定义日志编辑器" />
    </template>
  </BingScrollbar>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 12px; }
.text-viewport { display: block; box-sizing: border-box; width: 100%; height: 100%; resize: none; overflow: auto; padding: 12px 24px 12px 12px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-surface-solid); color: var(--bing-heading); font: inherit; line-height: 1.6; }
.text-viewport:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: -2px; }
</style>
```

## Props

| 属性                  | 类型                                      | 默认值         | 说明                                                                                            |
| ------------------- | --------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `height`            | `string \| number`                      | `undefined` | 滚动容器高度；数字会转为 px。                                                                              |
| `maxHeight`         | `string \| number`                      | `undefined` | 滚动容器最大高度；数字会转为 px。                                                                            |
| `minThumbSize`      | `number`                                | `28`        | 滚动条滑块最小尺寸。内部还会保证至少 12px。                                                                      |
| `overflowTolerance` | `number`                                | `1`         | 溢出容差，实际值至少为 1px；溢出必须大于该值才显示自定义轨道。                                                             |
| `vertical`          | `boolean`                               | `true`      | 是否启用纵向自定义轨道与组件插值；false 不会将原生 viewport 的 overflow-y 关闭。                                        |
| `horizontal`        | `boolean`                               | `false`     | 是否启用横向自定义滚动条。打开后 Shift + 滚轮会映射为横向滚动。                                                          |
| `always`            | `boolean`                               | `false`     | 是否始终显示滚动条轨道。false 时 hover、滚动、拖拽或聚焦时显示。                                                        |
| `disabled`          | `boolean`                               | `false`     | 隐藏轨道、移除 tabindex 并将 viewport overflow 设为 hidden；实例滚动方法仍可改变位置。                                 |
| `focusable`         | `boolean`                               | `true`      | 出现溢出且未禁用时，是否让 viewport 可聚焦并支持键盘滚动。                                                            |
| `smooth`            | `boolean \| BingScrollbarSmoothOptions` | `true`      | 启用组件滚轮与键盘插值，或传对象覆盖配置。false 时普通纵向滚动交给浏览器；横向 Shift+滚轮兼容处理仍保留。                                   |
| `ariaLabel`         | `string`                                | `undefined` | 默认 viewport 的名称；显式传入非空名称时即使没有溢出也设置 region。未传时，可聚焦 viewport 的名称为“可滚动内容”。自定义 viewport 插槽自行设置名称。 |

## 平滑配置

`smooth` 传入 `BingScrollbarSmoothOptions` 对象时支持以下字段。未提供的字段继续使用默认值。

| 选项                     | 类型        | 默认值     | 说明                                                               |
| ---------------------- | --------- | ------- | ---------------------------------------------------------------- |
| `duration`             | `number`  | `400`   | 单次滚动冲量的动画时长，单位毫秒；设为 0 时立即更新。                                     |
| `stepSize`             | `number`  | `100`   | 滚轮输入归一化后的基础步长；页面缩放后仍以事件的 CSS 像素距离计算，不按设备像素放大。                    |
| `pulseScale`           | `number`  | `4`     | 脉冲缓动曲线强度。                                                        |
| `accelerationDelta`    | `number`  | `50`    | 连续滚轮输入触发加速的最大间隔，单位毫秒。                                            |
| `accelerationMax`      | `number`  | `3`     | 连续输入的最大加速倍率。                                                     |
| `keyboardStep`         | `number`  | `50`    | 方向键每次滚动的基础距离。                                                    |
| `keyboard`             | `boolean` | `true`  | viewport 聚焦时是否平滑处理方向键、PageUp、PageDown、Home、End 和空格。              |
| `smoothTouchpad`       | `boolean` | `false` | 是否对触控板输入应用插值；默认保留触控板的原生高精度滚动。                                    |
| `respectReducedMotion` | `boolean` | `true`  | 需要减少动效时是否停用插值并保留原生滚动；策略来自 ConfigProvider 的 reducedMotion，默认跟随系统。 |

## Events

| 事件       | 参数      | 说明                                                                          |
| -------- | ------- | --------------------------------------------------------------------------- |
| `scroll` | `Event` | 转发内部 viewport 原生事件；在处理函数内同步读取 event.currentTarget 的 scrollTop / scrollLeft。 |

## Expose

| 成员                   | 类型                                             | 说明                                                                        |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| `handleWheel(event)` | `(event: WheelEvent) => boolean`               | 把外部 wheel 事件交给当前 viewport；返回值表示事件是否被组件消费。                                 |
| `scrollTo(options)`  | `(options: ScrollToOptions \| number) => void` | 取消组件插值并定位；数字立即设置纵向 scrollTop，对象传给原生 viewport.scrollTo，可用 left 与 behavior。 |
| `scrollBy(options)`  | `(options: ScrollToOptions \| number) => void` | 取消组件插值并相对滚动；数字立即设置纵向增量，对象传给原生 viewport.scrollBy。                          |
| `stop()`             | `() => void`                                   | 取消组件自己的插值队列；不取消 scrollTo / scrollBy 对象参数触发的浏览器原生 smooth 动画。               |
| `update()`           | `() => void`                                   | 同步重新计算轨道与滑块。组件也会自动观察尺寸；Vue 内容变化后手动调用时先 await nextTick()。                  |
| `viewport`           | `HTMLElement \| null`                          | 内部原生滚动 viewport。                                                          |

## 插槽

`BingScrollbarSlots` 与 `BingScrollbarViewportSlotProps` 均从包根导出。

| 插槽              | 参数                                                 | 说明                                                        |
| --------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `default`       | `-`                                                | 默认 div viewport 内的滚动内容。提供 viewport 插槽时由自定义元素替代整个默认视口。     |
| `viewport`      | `BingScrollbarViewportSlotProps`                   | 0.6.0 新增。将 viewportRef 和 viewportAttrs 绑定到同一个真实 DOM 滚动元素。 |
| `viewportRef`   | `(element: unknown) => void`                       | 通过 Vue ref 回调注册原生元素；组件实例不会被识别为 HTMLElement。               |
| `viewportAttrs` | `{ class; onScroll; onWheel; onKeydown; onInput }` | 整体 v-bind，保留隐藏原生滚动条及事件处理；不提供角色、名称、tabindex、禁用或尺寸样式。       |
