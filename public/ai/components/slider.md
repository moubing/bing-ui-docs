# BingSlider

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export slider；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

范围和步长是正文宽度演示参数，保存仅写入本地响应式变量，没有请求或 Cookie。

单值或范围滑块，原生 range 负责焦点、读屏、label 与表单提交，自绘轨道和滑块负责指针操作。单值使用数字，range 使用元组；精确数字输入和偏好持久化由业务处理。

## 连续更新与结束提交

v-model 连续更新，change 在指针结束、键盘松开或失焦时为已接受的变化提交一次。方向键单步，Shift+方向键十倍步长；Home/End 到端点，PageUp/PageDown 为范围 10% 且不小于 step。Esc 撤销拖动并阻止外层 Esc。为滑块提供 label 或 ariaLabel，带单位时使用 formatValueText。

触屏点按轨道在松手时生效，横向滑块上的纵向滑动保留滚动。拖动直接跟随，点击轨道和外部恢复默认有短过渡，减少动态效果时立即到位。受控拒绝时拖动期间保留预览，结束后回到父级接受值。

step 从 min 起算。若最大值不在刻度上，最后一个可选值为不超过 max 的合法刻度；非法值只在显示和交互时规范化，不主动回写受控模型。表单容器的禁用、描述和错误状态通过公共表单上下文继承。

滑块方向由自身的 orientation 决定，放入 BingDialog 或纵向 BingScrollbar 后仍默认横向。点击下方“在弹窗中调整”，可在弹窗内修改同一宽度；轨道拖动、键盘调整与双击恢复默认保持一致。

```vue
<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingButton, BingCheckbox, BingDialog, BingSlider } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const id = `width-${useId()}`
const value = ref(880)
const saved = ref(880)
const commits = ref(0)
const disabled = ref(false)
const open = ref(false)
const valueText = (next: number) => `正文宽度 ${next} 像素`
function save(next: number) { saved.value = next; commits.value++ }
</script>

<template>
  <div style="display: grid; gap: 16px;">
    <label :for="id">正文宽度：{{ value }}px</label>
    <BingSlider :id="id" v-model="value" :min="640" :max="1800" :step="20"
      :disabled="disabled" :format-value-text="valueText" @change="save" />
    <BingCheckbox v-model="disabled" label="禁用滑块" />
    <p role="status">已提交：{{ saved }}px；提交次数：{{ commits }}</p>
    <BingButton variant="secondary" @click="open = true">在弹窗中调整</BingButton>
  </div>
  <BingDialog v-model="open" title="正文宽度设置" :width="480" :show-peek="false" :overlay-blur="false"
    close-on-confirm confirm-text="完成">
    <div style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; padding-block: 20px;">
      <p>正文宽度：{{ value }}px</p>
      <BingSlider v-model="value" :min="640" :max="1800" :step="20" :reset-value="880"
        :disabled="disabled" tooltip="auto" :format-tooltip="next => `${next}px`"
        ariaLabel="弹窗正文宽度" :format-value-text="valueText" @change="save" />
      <BingButton variant="secondary" :disabled="disabled" @click="value = 880">恢复默认宽度</BingButton>
    </div>
  </BingDialog>
</template>
```

## 尺寸、刻度、气泡与范围

tooltip 默认 never。auto 在操作时显示，formatTooltip 控制可见文案；它与读屏的 formatValueText 分开。气泡上方预留空间。离散档位由 marks 与 snapToMarks 指定。范围两端不交叉，可设置 minDistance；两个原生 input 共用 name，表单通过 getAll(name) 读取两个值，分别提供 thumbAriaLabels。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingSlider, type BingSliderMark } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const range = ref<[number, number]>([20, 70])
const level = ref(50)
const marks: BingSliderMark[] = [{ value: 0, label: '低' }, { value: 25, label: '舒适' }, { value: 50, label: '标准' }, { value: 100, label: '高' }]
const submitted = ref('尚未提交')
</script>
<template>
  <div class="slider-range-demo">
    <BingSlider v-model="range" range name="budget" :thumb-aria-labels="['预算下限', '预算上限']" :min-distance="10" tooltip="always" :format-tooltip="value => value + ' 元'" @change="submitted = JSON.stringify($event)" />
    <p role="status">预算 {{ range[0] }}–{{ range[1] }}；最终提交：{{ submitted }}</p>
    <BingSlider v-model="level" :marks="marks" snap-to-marks tooltip="auto" ariaLabel="离散档位" />
    <BingSlider :default-value="35" size="sm" status="success" ariaLabel="小尺寸成功状态" />
    <BingSlider :default-value="55" size="lg" status="warning" ariaLabel="大尺寸警告状态" />
    <BingSlider :default-value="65" disabled ariaLabel="禁用滑块" />
  </div>
</template>
<style scoped>
.slider-range-demo { display: grid; gap: 24px; padding: 36px 8px 12px; min-width: 0; }
</style>
```

## 竖向与双击恢复

vertical 从下到上增大，不随 RTL 翻转，默认高 200px；触屏纵向意图才启动。双击滑块恢复 resetValue，范围模式恢复整个元组。越界按住时仅滑块外观弹性变化，模型仍受约束，松手回弹；减少动态效果关闭弹性。保留恢复按钮供键盘与触屏使用，竖向气泡左侧预留空间。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingSlider } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const volume = ref(40)
const range = ref<[number, number]>([20, 80])
</script>
<template>
  <div class="slider-vertical-demo">
    <div class="slider-vertical-demo__tracks">
      <BingSlider v-model="volume" orientation="vertical" :reset-value="40" tooltip="always" :format-tooltip="value => value + '%'" ariaLabel="竖向音量" />
      <BingSlider v-model="range" range orientation="vertical" :reset-value="[20, 80]" :thumb-aria-labels="['竖向下限', '竖向上限']" :min-distance="10" tooltip="auto" />
    </div>
    <p>向上增大，双击滑块恢复；越过边缘持续按住，再松手观察弹性。</p>
    <BingButton variant="secondary" @click="volume = 40; range = [20, 80]">恢复默认</BingButton>
    <p role="status">音量 {{ volume }}；范围 {{ range.join('–') }}</p>
  </div>
</template>
<style scoped>
.slider-vertical-demo { display: grid; gap: 16px; }
.slider-vertical-demo__tracks { display: flex; gap: 80px; padding: 24px 0 12px 56px; }
</style>
```

## 受控预览与恢复默认

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox, BingInput, BingSlider, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const width = ref(880)
const accept = ref(true)
const commits = ref(0)
function update(value: BingInputValue) {
  if (accept.value && typeof value === 'number') width.value = value
}
</script>
<template>
  <div style="display: grid; gap: 18px; padding-top: 28px; min-width: 0">
    <BingCheckbox v-model="accept" label="接受更新" />
    <BingSlider :model-value="width" :min="640" :max="1800" :step="20" :reset-value="880" tooltip="auto" :format-tooltip="value => value + 'px'" ariaLabel="受控正文宽度" style="--bing-slider-color: var(--bing-accent)" @update:model-value="update" @change="commits++" />
    <BingInput :model-value="width" type="number" :min="640" :max="1800" :step="20" suffix="px" ariaLabel="精确正文宽度" @update:model-value="update" />
    <BingButton variant="secondary" @click="update(880)">恢复默认宽度</BingButton>
    <p role="status">已接受 {{ width }}px；提交 {{ commits }} 次</p>
    <p>关闭接受更新后持续拖动并停留，预览跟随手势，结束后回到已接受值。Esc 撤销本次拖动。</p>
  </div>
</template>
```

0.18.0 保留根节点、禁用 / 状态类和 --bing-slider-color，新增轨道、滑块颜色与尺寸变量。内部 DOM 已调整，原生 range 伪元素覆盖需迁移；指针测试按 .bing-slider / .bing-slider\_\_thumb 的几何位置操作，键盘继续操作 input。

0.18.4 修正了祖先容器的 is-vertical 类误触发滑块竖向样式的问题，方向样式只作用于滑块自身；放在弹窗或纵向滚动区时无需额外覆盖组件内部样式。

| 公开变量                         | 用途                |
| ---------------------------- | ----------------- |
| `--bing-slider-color`        | 已选轨道与滑块强调色        |
| `--bing-slider-track-color`  | 未选轨道颜色            |
| `--bing-slider-track-height` | 轨道粗细              |
| `--bing-slider-thumb-size`   | 滑块尺寸              |
| `--bing-slider-thumb-border` | 滑块边框（完整 border 值） |
| `--bing-slider-hit-height`   | 操作区域厚度            |

## Props

| 属性                                             | 类型                           | 默认值                                         | 说明                                                                                |
| ---------------------------------------------- | ---------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| `modelValue`                                   | `number \| [number, number]` | `undefined`                                 | 受控值，range=true 时使用元组；单值模板事件仍推断 number。                                            |
| `defaultValue`                                 | `number \| [number, number]` | `0（范围为 [min, max]）`                         | 非受控初始值，按范围和步长规范化。                                                                 |
| `orientation`                                  | `BingSliderOrientation`      | `'horizontal'`                              | 方向由滑块自身决定，不继承弹窗或滚动容器的方向。vertical 从下到上递增，不随 RTL 翻转；默认高度 200px，可通过 style.height 调整。 |
| `resetValue`                                   | `number \| [number, number]` | `undefined`                                 | 双击滑块恢复规范化后的值；范围模式恢复整个元组。仍应提供可发现的恢复按钮。                                             |
| `size`                                         | `BingSliderSize`             | `继承 FormItem / Form / ConfigProvider，否则 md` | sm / md / lg 控制轨道、滑块和命中区域。                                                        |
| `range`                                        | `boolean`                    | `false`                                     | 双滑块，两端不交叉。                                                                        |
| `minDistance`                                  | `number`                     | `0`                                         | 两端最小间距，向上对齐步长，并限制为可用跨度。                                                           |
| `thumbAriaLabels`                              | `[string, string]`           | `undefined`                                 | 两个滑块各自的完整可访问名称，例如最低价格 / 最高价格。                                                     |
| `tooltip`                                      | `BingSliderTooltipMode`      | `'never'`                                   | auto 在操作或键盘聚焦时显示，结束后延迟 600ms 隐藏；always 始终显示。                                      |
| `formatTooltip`                                | `(value: number) => string`  | `undefined`                                 | 格式化可见气泡；不替代 formatValueText 的读屏说明。                                                |
| `marks`                                        | `BingSliderMark[]`           | `[]`                                        | 数字或 \{ value, label? \} 刻度。                                                       |
| `snapToMarks`                                  | `boolean`                    | `false`                                     | 只选择有效刻度，不受 step 限制；无有效刻度时回退 step。                                                 |
| `min / max`                                    | `number`                     | `0 / 100`                                   | 可选范围；max 小于 min 时视为同值并禁用操作。                                                       |
| `step`                                         | `number`                     | `1`                                         | 有限正数，非法值回退 1。合法刻度从 min 起算，不超过 max。                                                |
| `disabled`                                     | `boolean`                    | `undefined`                                 | 未指定时继承 Form/FormItem 禁用状态。                                                        |
| `id / name`                                    | `string`                     | `undefined`                                 | 保留原生 label、form 和表单提交；范围模式两个 input 共用 name。                                       |
| `status`                                       | `BingControlStatus`          | `undefined`                                 | 继承表单状态；error 提供错误色和 aria-invalid。                                                 |
| `ariaLabel / ariaLabelledby / ariaDescribedby` | `string`                     | `undefined`                                 | 原生滑块可访问名称及描述；优先用 label for 或 FormItem 标签。                                         |
| `formatValueText`                              | `(value: number) => string`  | `undefined`                                 | 生成 aria-valuetext，例如“正文宽度 880 像素”。                                                |

## Events

| 事件                  | 载荷                           | 说明                                         |
| ------------------- | ---------------------------- | ------------------------------------------ |
| `update:modelValue` | `number \| [number, number]` | 操作中连续更新规范化值；受控父级可拒绝或修正。                    |
| `change`            | `number \| [number, number]` | 指针结束、键盘松开或失焦时，为本次已接受变化提交一次；重复值和 Esc 撤销不提交。 |
| `focus / blur`      | `FocusEvent`                 | 原生焦点事件；blur 同时通知表单。                        |

## 实例方法

| 成员                       | 类型                                      | 说明                  |
| ------------------------ | --------------------------------------- | ------------------- |
| `input`                  | `HTMLInputElement \| null`              | 第一个原生 range，兼容原有用法。 |
| `inputs`                 | `HTMLInputElement[]`                    | 全部原生 range；范围模式两个。  |
| `focus(index?) / blur()` | `(index?: number) => void / () => void` | 聚焦指定滑块（默认 0）或移出焦点。  |

## 公开类型

| 类型                                                     | 说明                                                   |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `BingSliderProps / BingSliderEmits / BingSliderExpose` | 属性、事件与实例方法类型，从 @moubing/bing-ui 导入。                  |
| `BingSliderValue / BingSliderModelValue<Range>`        | number \| \[number, number\]；泛型根据 range 收窄。          |
| `BingSliderOrientation`                                | 'horizontal' \| 'vertical'                           |
| `BingSliderSize / BingSliderTooltipMode`               | 'sm' \| 'md' \| 'lg' / 'auto' \| 'always' \| 'never' |
| `BingSliderMark`                                       | number \| \{ value: number; label?: string \}        |
| `BingControlStatus`                                    | 'default' \| 'error' \| 'success' \| 'warning'       |

多个实例应使用不同的 id；独立示例通过 useId 生成。需要数值框时并列使用 BingInput，以同一业务状态连接。
