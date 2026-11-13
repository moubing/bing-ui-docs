# BingResizable

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export resizable；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。五个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示配置。受控尺寸与位置需要接收各自更新事件；默认值在重置时重新应用。示例使用数值像素和有尺寸的父容器；contain 与比例、最小尺寸冲突时无法同时保证所有限制。

BingResizable 是可调整尺寸容器，用于代码面板、预览器、可拖拽编辑区域和需要用户临时改变尺寸的内容块。它支持多方向手柄、固定对边或镜像缩放、尺寸步进、比例锁定、父容器约束、键盘方向键调整，以及受控/非受控两种用法。

## 基础调整

默认只显示 `right`、`bottom` 和 `bottom-right` 三个手柄。拖拽变化时会先发送 update:size、update:position，再发送 resize；结束时再次提交更新，再发送 resize-end。Shift + 方向键使用四倍步长。Escape 会结束并提交当前调整，不会撤销。

defaultSize/defaultPosition 是非受控起始配置；开始保存用户调整后，修改默认值需配合 reset() 才会应用。下方“应用初始尺寸”用于这个场景。窄屏预览区可以横向滚动，拖拽画布保持足够空间。尺寸建议用像素数字，百分比、rem 等字符串的 CSS 显示与内部 parseFloat 数值并不等价。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose, type BingResizablePayload, type BingResizableProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingResizableProps = {
  "defaultSize": {
    "width": 320,
    "height": 200
  },
  "defaultPosition": {
    "x": 34,
    "y": 28
  },
  "minWidth": 180,
  "minHeight": 120,
  "maxWidth": 620,
  "maxHeight": 320,
  "mode": "fixed",
  "snapMode": "live",
  "directions": [
    "right",
    "bottom",
    "bottom-right"
  ],
  "step": 8,
  "disabled": false,
  "lockAspectRatio": false,
  "contain": true,
  "showSize": true
}
const panel = ref<BingResizableExpose | null>(null)
const feedback = ref('等待拖拽')
function report(name: string, payload: BingResizablePayload) {
  feedback.value = `${name}：${payload.direction}；${payload.size.width} x ${payload.size.height}；位置 ${payload.position.x},${payload.position.y}；${payload.event.type}`
}
</script>

<template>
  <div class="window"><div class="stage">
    <BingResizable ref="panel" v-bind="options" ariaLabel="可调整尺寸面板"
      @resize-start="report('开始', $event)" @resize="report('调整中', $event)" @resize-end="report('结束', $event)">
      <div class="content"><strong>Resizable panel</strong><p>拖拽边缘或角点，也可聚焦手柄后使用方向键。</p></div>
    </BingResizable>
  </div></div>
  <BingButton size="sm" :throttle="false" @click="panel?.reset()">恢复初始尺寸</BingButton>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.window { max-width: 100%; overflow: auto; padding: 12px; }
.stage { position: relative; width: 680px; height: 380px; border: 1px dashed var(--bing-border); }
.content { height: 100%; display: grid; place-content: center; padding: 20px; box-sizing: border-box; text-align: center; }
</style>
```

## 固定和镜像模式

`fixed` 模式会固定被拖拽方向的对边；`mirror` 模式会围绕中心对称缩放，所以尺寸变化时 `position` 也会同步变化。

```vue
<script setup lang="ts">
import { BingResizable, type BingResizableMode } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const modes: BingResizableMode[] = ['fixed', 'mirror']
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="display: flex; gap: 30px; width: 740px">
      <div v-for="mode in modes" :key="mode" style="position: relative; width: 350px; height: 280px; border: 1px dashed var(--bing-border)">
        <BingResizable :mode="mode" :default-size="{ width: 250, height: 150 }" :default-position="{ x: 40, y: 40 }"
          :directions="['right', 'bottom', 'bottom-right']" show-size :ariaLabel="`${mode} 模式示例`">
          <div style="padding: 24px"><strong>{{ mode }}</strong><p>{{ mode === 'fixed' ? '对边保持稳定' : '围绕中心缩放' }}</p></div>
        </BingResizable>
      </div>
    </div>
  </div>
</template>
```

## 约束和比例

`contain` 在调整过程中参考父容器内容盒裁剪尺寸和位置，不会在初始化或父容器变化时自动修正。`lockAspectRatio` 使用每次操作开始时的宽高比；此例同时展示 right、bottom 和 bottom-right 手柄。

0.12.5 修复角手柄的尺寸突跳：指针位移投影到起始宽高比的对角线上，横纵方向互换、反向或轻微抖动时尺寸连续变化。边手柄及键盘方向键仍按对应轴调整；角手柄按起始长边吸附（宽大于等于高使用 step.x，否则使用 step.y），吸附轴在一次操作内保持不变。live 允许预期的网格步进，end 在松手时才吸附。例如 500×250 从右下角移动 (100,100) 到 (100,101)，无步进和边界限制时由 620×310 连续变为 620.4×310.2。

父容器约束在比例计算之后生效，到达边界可能改变比例；最小尺寸大于父容器时也无法保证完全放入。示例为允许的最大尺寸预留足够空间，并避免互相冲突的限制。

```vue
<script setup lang="ts">
import { BingResizable } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 620px; height: 350px; border: 1px dashed var(--bing-border)">
      <BingResizable contain lock-aspect-ratio :directions="['right', 'bottom', 'bottom-right']"
        :default-size="{ width: 320, height: 180 }" :default-position="{ x: 24, y: 24 }"
        :min-width="220" :max-width="520" :step="12" snap-mode="end" show-size ariaLabel="比例锁定面板">
        <div style="padding: 24px"><strong>16:9 preview</strong><p>保持比例，在预留足够空间的父容器中调整。</p></div>
      </BingResizable>
    </div>
  </div>
</template>
```

## 实例方法

通过 ref 可以读取当前尺寸和位置，或重置到初始状态。受控模式下依然需要用`update:size` 和 `update:position` 同步外部状态。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const panel = ref<BingResizableExpose | null>(null)
const feedback = ref('尚未读取')
function read() {
  const size = panel.value?.getSize()
  const position = panel.value?.getPosition()
  feedback.value = size && position ? `${size.width} x ${size.height} / x ${position.x}, y ${position.y}` : '尚未挂载'
}
function reset() { panel.value?.reset(); read() }
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 560px; height: 270px; border: 1px dashed var(--bing-border)">
      <BingResizable ref="panel" :default-size="{ width: 300, height: 170 }" :default-position="{ x: 26, y: 24 }" show-size ariaLabel="可读取尺寸的面板">
        <div style="padding: 24px">通过 ref 读取和重置。</div>
      </BingResizable>
    </div>
  </div>
  <BingButton size="sm" :throttle="false" @click="read">读取尺寸</BingButton>
  <BingButton size="sm" variant="ghost" :throttle="false" @click="reset">重置</BingButton>
  <p role="status">{{ feedback }}</p>
</template>
```

## 受控尺寸和位置

同时使用 v-model:size 与 v-model:position 保存调整结果。只传入 size/position 而不接收更新时，拖拽期间会显示临时结果，结束后返回外部值。reset() 在受控模式下也只通过 update 事件通知，所以必须同步两项状态。handle 插槽替换手柄内容，外部按钮语义及键盘操作由组件保留。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose, type BingResizableResolvedSize, type BingResizablePosition } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const panel = ref<BingResizableExpose | null>(null)
const size = ref<BingResizableResolvedSize>({ width: 280, height: 160 })
const position = ref<BingResizablePosition>({ x: 40, y: 32 })
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 640px; height: 360px; border: 1px dashed var(--bing-border)">
      <BingResizable ref="panel" v-model:size="size" v-model:position="position"
        :default-size="{ width: 280, height: 160 }" :default-position="{ x: 40, y: 32 }"
        :directions="['left', 'right', 'bottom']" :step="10" show-size ariaLabel="受控面板">
        <div style="padding: 24px">同时同步尺寸和位置。</div>
        <template #handle="{ direction, active }"><span aria-hidden="true" :title="direction">{{ active ? '●' : '+' }}</span></template>
      </BingResizable>
    </div>
  </div>
  <BingButton size="sm" :throttle="false" @click="panel?.reset()">重置受控面板</BingButton>
  <p role="status">{{ JSON.stringify({ size, position }) }}</p>
</template>
```

## 属性

| 属性                     | 类型                                     | 默认值                                   | 说明                                                           |
| ---------------------- | -------------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| `size`                 | `BingResizableSize`                    | `undefined`                           | 受控尺寸。拖拽中有内部临时预览，结束后回到传入值；需监听 update:size 或用 v-model:size 同步。 |
| `defaultSize`          | `BingResizableSize`                    | `{ width: 320, height: 220 }`         | 非受控模式下的初始尺寸。                                                 |
| `position`             | `Partial<BingResizablePosition>`       | `undefined`                           | 受控位置。                                                        |
| `defaultPosition`      | `Partial<BingResizablePosition>`       | `{ x: 0, y: 0 }`                      | 非受控模式下的初始位置。                                                 |
| `minWidth / minHeight` | `number \| string`                     | `80`                                  | 最小宽高；字符串会按 parseFloat 参与计算，样式值会原样输出。                         |
| `maxWidth / maxHeight` | `number \| string`                     | `undefined`                           | 最大宽高。                                                        |
| `mode`                 | `'fixed' \| 'mirror'`                  | `'fixed'`                             | fixed 固定对边；mirror 围绕中心对称调整，并同步 position。                     |
| `snapMode`             | `'live' \| 'end'`                      | `'live'`                              | step 吸附时机。live 拖拽中吸附，end 松手时吸附。                              |
| `directions`           | `BingResizableDirection[]`             | `['right', 'bottom', 'bottom-right']` | 允许拖拽的方向。                                                     |
| `step`                 | `number \| { x?: number; y?: number }` | `1`                                   | 尺寸吸附步进。锁定比例的角手柄按起始长边吸附：宽大于等于高用 x，否则用 y。Shift + 方向键使用 4 倍步进。  |
| `disabled`             | `boolean`                              | `false`                               | 是否禁用拖拽和键盘调整。                                                 |
| `lockAspectRatio`      | `boolean`                              | `false`                               | 按每次操作开始时的宽高比调整，保留角手柄。角点位移连续投影到比例线上；边手柄和键盘仍按对应轴调整。            |
| `contain`              | `boolean`                              | `false`                               | 是否把尺寸和位置限制在父容器内容盒内。                                          |
| `showSize`             | `boolean`                              | `false`                               | 拖拽时是否显示当前宽高。                                                 |
| `handleSize`           | `number`                               | `12`                                  | 手柄基础尺寸，最小会限制为 6。                                             |
| `ariaLabel`            | `string`                               | `undefined`                           | 根节点 role="group" 的可访问名称。                                     |

## 手柄方向

| 方向                                                  | 说明                                         |
| --------------------------------------------------- | ------------------------------------------ |
| `top / right / bottom / left`                       | 边手柄，分别调整对应方向。                              |
| `top-left / top-right / bottom-left / bottom-right` | 角手柄，同时调整两个方向。lockAspectRatio 为 true 时仍会显示。 |

## 插槽

| 插槽        | 参数                      | 说明                      |
| --------- | ----------------------- | ----------------------- |
| `default` | `-`                     | 可调整尺寸的内容区域。             |
| `handle`  | `{ direction, active }` | 自定义手柄内容。未传时使用组件内置图标和线条。 |

## 事件

失去窗口焦点等中断会提交已调整的值，但不一定发送 resize-end；不要把状态同步仅放在 resize-end 中。

| 事件                | 参数                          | 说明                                             |
| ----------------- | --------------------------- | ---------------------------------------------- |
| `update:size`     | `BingResizableResolvedSize` | 尺寸提交时触发。非受控模式也会触发。                             |
| `update:position` | `BingResizablePosition`     | 位置提交时触发。fixed 模式拖拽 left/top，或 mirror 模式缩放时会变化。 |
| `resize-start`    | `BingResizablePayload`      | 拖拽或键盘调整开始时触发。                                  |
| `resize`          | `BingResizablePayload`      | 尺寸或位置发生变化时触发。                                  |
| `resize-end`      | `BingResizablePayload`      | 拖拽结束或一次键盘调整完成时触发。                              |

## 实例接口

| 成员              | 类型                                | 说明                                                                 |
| --------------- | --------------------------------- | ------------------------------------------------------------------ |
| `reset()`       | `() => void`                      | 重置为 defaultSize 和 defaultPosition，并触发 update:size/update:position。 |
| `getSize()`     | `() => BingResizableResolvedSize` | 读取数值状态；CSS 字符串按 parseFloat 解析，不等同于所有情况下的 DOM 测量尺寸。                 |
| `getPosition()` | `() => BingResizablePosition`     | 读取当前显示位置。                                                          |

## 参数类型

| 类型                          | 结构                                                                                                                                                                         | 说明                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `BingResizableSize`         | `{ width?: number \| string; height?: number \| string }`                                                                                                                  | 输入尺寸。建议使用像素数字，避免 CSS 单位与内部数值计算不一致。        |
| `BingResizableResolvedSize` | `{ width: number; height: number }`                                                                                                                                        | 事件和读取方法中的数值尺寸。                            |
| `BingResizablePosition`     | `{ x: number; y: number }`                                                                                                                                                 | 相对布局原点的像素偏移；不是任意拖动位置的组件。                  |
| `BingResizableDelta`        | `{ x: number; y: number }`                                                                                                                                                 | 指针相对本次操作起点的位移，或一次键盘操作的位移。                 |
| `BingResizablePayload`      | `{ direction: BingResizableDirection; size: BingResizableResolvedSize; position: BingResizablePosition; delta: BingResizableDelta; event: PointerEvent \| KeyboardEvent }` | resize-start / resize / resize-end 的完整参数。 |
| `BingResizableDirection`    | `'top' \| 'right' \| 'bottom' \| 'left' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`                                                                   | 有效手柄方向。                                   |
| `BingResizableStep`         | `number \| { x?: number; y?: number }`                                                                                                                                     | 两轴步长，可分别配置。                               |
