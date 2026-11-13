# BingSplitPane

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export split-pane；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。一个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

示例为了文档视口显式设置较小的最小宽度，不代表组件默认值。偏好与实际宽度分离，示例只显示提交结果。

水平分栏布局：左侧正文占据剩余空间，右侧栏按偏好宽度参与正常布局。组件负责尺寸和交互，业务决定何时切换抽屉、是否显示侧栏，以及如何保存偏好。

## 实际宽度与偏好宽度

sideSize 表示用户偏好。容器不足以容纳 minMainSize 与侧栏时，组件临时压缩侧栏，必要时低于 minSideSize；容器恢复后自动恢复偏好。这种约束变化不发送 update:sideSize，不能把当前实际宽度直接持久化。组件不内置 Cookie 或 localStorage。

拖动分隔条向左会扩大右侧栏；过程中的 resize 报告实际宽度，松手才提交模型并发送 resize-end。需要保存时读取 resize-end.preferredSize。没有移动的点击不会覆盖此前受压缩的偏好。方向键左右调整、Home/End 到当前边界，Enter 或双击恢复 defaultSideSize。

Esc、pointercancel、捕获丢失、窗口失焦、容器变窄或被隐藏、受控值或约束变化以及卸载会取消本次拖动。取消恢复已提交偏好，不发送模型更新或 resize-end。示例为了适配文档宽度显式使用更小的最小值，这些值不是组件默认值。

分栏被 KeepAlive 缓存（移出文档）或经 display:none、v-show 隐藏时，组件保留上次测得的容器宽度，不把隐藏期间的 0 宽当作容器变窄；重新显示时侧栏直接以原宽度渲染，正文宽度不跳动，业务也不必在重新显示后纠正滚动位置。显示状态下容器真实变窄仍按上述规则压缩。此行为自 0.12.2 起提供；0.12.1 及更早版本重新显示时，侧栏会先以 0 宽渲染一帧再展开。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingSplitPane } from '@moubing/bing-ui'
import type { BingSplitPaneCancelPayload, BingSplitPaneResizePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const size = ref(240)
const narrow = ref(false)
const log = ref('尚未调整')
function finish(value: BingSplitPaneResizePayload) { log.value = `提交偏好：${value.preferredSize}px` }
function cancel(value: BingSplitPaneCancelPayload) { log.value = `取消原因：${value.reason}` }
</script>

<template>
  <div style="display: grid; gap: 16px; min-width: 0;">
    <BingButton size="sm" variant="secondary" :throttle="false" style="justify-self: start" @click="narrow = !narrow">切换容器宽度</BingButton>
    <BingSplitPane v-model:side-size="size" :default-side-size="240" :min-side-size="100" :max-side-size="360" :min-main-size="180"
      :style="{ width: narrow ? '340px' : '100%', maxWidth: '100%', height: '240px', border: '1px solid var(--bing-border)' }"
      @resize-end="finish" @resize-cancel="cancel">
      <div style="padding: 12px;">正文区域。按 Esc 取消拖动，Enter 或双击恢复默认宽度。</div>
      <template #side="{ size: actual }"><div style="padding: 12px;">属性栏<br>{{ Math.round(actual) }}px</div></template>
    </BingSplitPane>
    <p role="status">偏好宽度：{{ size }}px；{{ log }}</p>
  </div>
</template>
```

## Props

| 属性                | 类型        | 默认值         | 说明                                      |
| ----------------- | --------- | ----------- | --------------------------------------- |
| `sideSize`        | `number`  | `undefined` | 右侧栏偏好宽度 px；受控时需接收 update:sideSize。      |
| `defaultSideSize` | `number`  | `320`       | 初始偏好与重置目标。                              |
| `minSideSize`     | `number`  | `160`       | 侧栏逻辑最小宽度，最小 0。                          |
| `maxSideSize`     | `number`  | `640`       | 侧栏逻辑最大宽度，不小于 minSideSize。               |
| `minMainSize`     | `number`  | `240`       | 正文优先保留的最小宽度；空间不足时侧栏可暂时小于 minSideSize。   |
| `keyboardStep`    | `number`  | `12`        | 方向键步长 px，最小 1。                          |
| `disabled`        | `boolean` | `false`     | 禁用拖动、键盘与重置，正在拖动时取消。                     |
| `ariaLabel`       | `string`  | `'调整侧栏宽度'`  | 分隔条名称。aria-valuenow/min/max 表达当前实际可调宽度。 |

## Slots

| 插槽        | 参数                 | 说明                |
| --------- | ------------------ | ----------------- |
| `default` | `-`                | 左侧正文。             |
| `side`    | `{ size: number }` | 右侧栏；size 是当前实际宽度。 |

## Events

| 事件                | 载荷                           | 说明                                                           |
| ----------------- | ---------------------------- | ------------------------------------------------------------ |
| `update:sideSize` | `number`                     | 只在松手、键盘操作或重置时提交改变后的偏好。容器约束与取消不会发送。                           |
| `resize-start`    | `BingSplitPaneResizePayload` | 一次指针、键盘或重置操作开始。                                              |
| `resize`          | `BingSplitPaneResizePayload` | 拖动中持续报告实际宽度；此时 preferredSize 仍是已提交的偏好。                       |
| `resize-end`      | `BingSplitPaneResizePayload` | 操作完成；preferredSize 是请求提交的偏好，适合由业务保存。                         |
| `resize-cancel`   | `BingSplitPaneCancelPayload` | 撤销本次拖动。容器变窄或被隐藏时 reason 为 container。之后不会再为该次操作发送 resize-end。 |

## 实例方法

| 方法        | 类型           | 说明                                       |
| --------- | ------------ | ---------------------------------------- |
| `reset()` | `() => void` | 恢复 defaultSideSize，遵守逻辑范围；disabled 时不操作。 |

## 公开类型

| 类型                                                              | 说明                                                                                             |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `BingSplitPaneProps / BingSplitPaneEmits / BingSplitPaneExpose` | 属性、事件与实例方法类型。                                                                                  |
| `BingSplitPaneResizePayload`                                    | \{ size: number; preferredSize: number; source: BingSplitPaneResizeSource \}                   |
| `BingSplitPaneResizeSource`                                     | 'pointer' \| 'keyboard' \| 'reset'                                                             |
| `BingSplitPaneCancelPayload`                                    | BingSplitPaneResizePayload & \{ reason: BingSplitPaneCancelReason \}                           |
| `BingSplitPaneCancelReason`                                     | 'escape' \| 'pointercancel' \| 'capture-lost' \| 'blur' \| 'container' \| 'props' \| 'unmount' |

组件不提供垂直分栏或多分隔条。左右内容区 min-width/min-height 为 0 并裁剪溢出；滚动由业务在插槽内放置 BingScrollbar。狭窄视口应由业务切换合适的面板布局。
