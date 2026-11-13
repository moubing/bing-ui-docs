::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingConfigProvider {#overview}

BingConfigProvider 为一棵子树统一设置默认尺寸、浮层层级基准和 JS 动效策略。它只提供上下文，不渲染额外的 DOM 元素，可以包住整个应用，也可以只包住某个区域。自 0.12.0 起提供。

优先级始终是“组件显式 props 优先”：Provider 只给没有自己指定值的组件提供默认值。嵌套 Provider 只覆盖自己设置的字段，未设置的字段继续继承外层；最外层没有 Provider 时，组件保持各自原来的默认值。

:::section{id="size" class="doc-section"}
## 全局尺寸

`size` 作用于未显式传入尺寸的组件。下例外层 Provider 可在 sm / md / lg 之间切换：输入框、选择器、继承尺寸的按钮和标签随之变化，显式 `size="sm"` 的按钮保持不变；嵌套的 Provider 只把 `size` 覆盖为 sm，其余配置仍继承外层。

在表单中，BingForm / BingFormItem 的尺寸上下文比 Provider 更近，因此优先于 Provider；Form 自身未设置 `size` 时再读取 Provider。Provider 的 `size` 只接受 sm / md / lg，Button 的 xs / xl 需要在按钮上显式设置。各组件的完整解析顺序见下方的“尺寸解析顺序”。

::config-provider-size-example
::
:::

:::section{id="z-index" class="doc-section"}
## 浮层层级

`zIndex` 是浮层的层级基准，默认 2000。Dialog、Toast、预览、选择器面板和提示在基准上加固定偏移，所以抬高基准时它们之间的相对顺序不变。没有 Provider 时得到的层级与 0.12.0 之前完全一致。

当页面里已有层级较高的固定元素（例如第三方客服挂件或宿主应用的顶栏）时，用 Provider 整体抬高 Bing UI 的浮层，比逐个组件设置 `zIndex` 更不容易遗漏。下例中挂件固定为 2500：基准为 2000 时，弹窗遮罩位于挂件下方；切换到 3000 后遮罩会盖住挂件。示例只在弹窗打开时显示挂件，以免遮挡文档页面。

组件显式传入的 `zIndex` 仍然优先。同时打开多个浮层时，后打开的浮层不会低于先打开的浮层，例如弹窗内展开的选择器面板始终位于弹窗上方。

::config-provider-layers-example
::
:::

:::section{id="motion" class="doc-section"}
## 动效策略

`reducedMotion` 控制 GSAP 等 JS 驱动的动效：`user`（默认）跟随系统的减少动态效果设置；`always` 始终减少，适合在应用内提供“关闭动画”开关；`never` 忽略系统设置，始终完整播放。下例切换策略后，拆字跳动、Tabs 指示器和按钮点击碎屑会一起响应，常驻动画会立即重建。

该策略只影响 JS 动效。组件样式里通过 CSS 媒体查询 `prefers-reduced-motion` 实现的降级（例如部分过渡和流光渐变的隐藏）仍跟随系统设置。Scrollbar、Tabs 和转场组件的 `respectReducedMotion` 等组件级开关继续生效：关闭后该组件不再减少动效，开启时才读取 Provider 策略。

从 0.12.4 起，Tooltip 即使共用一个浮层，也会在打开、切换和关闭时使用对应触发器的局部策略。下例两个提示分别固定为 `never` 和 `always`，可连续悬停比较完整动画与立即显示；它们覆盖外层策略，其他演示仍跟随上方选项。

::config-provider-motion-example
::

自定义组件需要与 Bing UI 使用同一策略时，在 Provider 的后代组件中调用 `useReducedMotion()`。它返回一个实时判断函数；传入 `onChange` 可以在系统设置或 Provider 策略变化时重建常驻动画。

```ts
// FloatingBadge.vue 的 <script setup lang="ts">，模板中为 <span ref="badge">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { gsap } from 'gsap'
import { useReducedMotion } from '@moubing/bing-ui'

const badge = useTemplateRef<HTMLElement>('badge')
const shouldReduceMotion = useReducedMotion({ onChange: () => setupLoop() })
let loop: gsap.core.Tween | undefined

function setupLoop() {
  loop?.kill()
  loop = undefined
  if (badge.value) gsap.set(badge.value, { clearProps: 'transform' })
  if (!badge.value || shouldReduceMotion()) return
  loop = gsap.to(badge.value, { y: -4, repeat: -1, yoyo: true, duration: 0.6 })
}

onMounted(setupLoop)
onBeforeUnmount(() => loop?.kill())
```
:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

### 插槽 {#slots}

::docs-api-table{name="slots"}
::
:::

:::section{id="size-order" class="doc-section"}
## 尺寸解析顺序

箭头左侧优先。未列出的组件不读取 Provider 的 `size`，例如 BingIcon 仍默认为 md，BingCard 没有尺寸档位。

::docs-api-table{name="sizes"}
::
:::

:::section{id="layers" class="doc-section"}
## 浮层层级表

默认值对应基准 2000。设置 `zIndex` 为 3000 时，表中每一项都增加 1000，例如 Tooltip 为 4200。

::docs-api-table{name="layers"}
::
:::

:::section{id="functions" class="doc-section"}
## 组合式函数

均从 `@moubing/bing-ui` 导入。`useBingConfig` 与 `useReducedMotion` 读取的是调用位置所在组件的上层 Provider，因此不能在放置 Provider 的同一个组件里读取它提供的配置，需要在其后代组件中调用。

::docs-api-table{name="functions"}
::
:::

:::section{id="types" class="doc-section"}
## 公开类型

::docs-api-table{name="types"}
::

Provider 基于 Vue 的 provide / inject，Teleport 到 `body` 的浮层同样能读取配置。配置不会跨越独立创建的 Vue 应用实例；多个应用需要各自放置 Provider。
:::
::::
