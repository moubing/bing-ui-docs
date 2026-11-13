# BingCheckbox

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export checkbox；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例中的 options 是演示配置，不代表组件默认值。独立 Checkbox 使用布尔模型；组内 value 用于标识数组成员。indeterminate 由业务控制，decorative 仅呈现只读视觉标记。

BingCheckbox 是基础布尔选择组件，用于开关类确认、批量选择项和表单勾选项。它支持选中、半选、禁用、不同尺寸、圆角/圆形形状、主色/辅助色 tone，并能在 CheckboxGroup 与 FormItem 中继承上下文。

## 基础配置

使用 `v-model` 绑定布尔值；`indeterminate`用于展示“部分选中”的视觉状态，常见于父级批量选择。

独立使用时 `modelValue` 是 boolean，`change` 接收 `(value: boolean, event: Event)` 两个参数。放入 CheckboxGroup 后，为子项提供唯一 `value`，由 Group 的数组模型决定选中状态；不要再给子项分别绑定布尔模型，监听数组变化应使用 Group 的 change。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import type { BingCheckboxProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingCheckboxProps = {
  "label": "启用动效反馈",
  "size": "md",
  "shape": "rounded",
  "tone": "primary",
  "status": "default",
  "indeterminate": false,
  "disabled": false
}

const checked = ref(false)
</script>

<template>
  <BingCheckbox v-model="checked" v-bind="options" id="motion-feedback" name="motion-feedback" />
  <p role="status">当前值：{{ checked }}；半选参数：{{ options.indeterminate }}</p>
</template>
```

## 选中、半选与禁用

半选态由 `indeterminate` 单独控制，不会自动改变 `modelValue`。如果需要根据子项自动计算半选态，应该在业务层或 `BingCheckboxGroup` 外部处理。

组件没有 `update:indeterminate` 事件，也不会替业务计算“全选”。常用规则是：全部子项选中时父项 modelValue 为 true；已选数量大于 0 且少于总数时 indeterminate 为 true。父项点击后更新子项数组，再重新计算两个值。下面的固定半选项只用于展示独立的布尔值与半选外观。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const checked = ref(true)
const partialChecked = ref(false)
const circle = ref(true)
</script>

<template>
  <div class="states">
    <BingCheckbox v-model="checked" label="已选中" />
    <BingCheckbox v-model="partialChecked" indeterminate tone="secondary" label="部分选中" />
    <BingCheckbox :model-value="true" disabled label="禁用状态" />
    <BingCheckbox v-model="circle" shape="circle" label="圆形样式" />
  </div>
  <p>半选项的布尔模型：{{ partialChecked }}。固定的 indeterminate 仅用于对照展示，业务应根据子项重新计算它。</p>
</template>

<style scoped>
.states { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
```

## 尺寸、形状与颜色

`size` 可以使用 `sm`、`md`、`lg` 预设，方框尺寸依次为 16/18/20px，带标签时的最小点击高度为 32/36/40px；默认继承 Group/Form，没有上下文时使用 md。也可以传入数字自定义方框像素尺寸。`tone` 用于区分主色和辅助色。

新版会自动生成唯一 ID，点击各自标签可准确切换对应项。整组禁用后，子项即使显式设置 `disabled=false` 仍不可操作。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const small = ref(false)
const medium = ref(false)
const large = ref(false)
const custom = ref(true)
</script>

<template>
  <div class="sizes">
    <BingCheckbox v-model="small" size="sm" label="小尺寸" />
    <BingCheckbox v-model="medium" size="md" tone="secondary" label="辅助色" />
    <BingCheckbox v-model="large" size="lg" shape="circle" label="大尺寸圆形" />
    <BingCheckbox v-model="custom" :size="34" label="自定义 34px" />
  </div>
</template>

<style scoped>
.sizes { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
</style>
```

## 装饰模式

`decorative` 模式只渲染视觉状态，不渲染原生 `input`。它适合在 Select、Table 等复杂组件内部作为只读选择标记。

装饰标记带有 aria-hidden，保留选中动画，但没有悬停幽灵勾、按压缩放或扩展命中区。它不会取得焦点、切换状态或参与原生表单提交；外部按钮负责语义和键盘操作。

```vue
<script setup lang="ts">
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
</script>

<template>
  <div class="markers">
    <BingCheckbox decorative :model-value="false" size="sm" />
    <BingCheckbox decorative :model-value="true" size="md" />
    <BingCheckbox decorative :model-value="false" indeterminate size="lg" tone="secondary" />
    <BingCheckbox decorative :model-value="true" shape="circle" :size="34" />
  </div>
  <p>以上只读标记没有原生 input，也不会参与表单提交、焦点或点击切换。实际操作与可访问名称由外部交互容器提供。</p>
</template>

<style scoped>
.markers { display: flex; gap: 16px; align-items: center; }
</style>
```

## 事件反馈

单独使用时，点击会触发 `update:modelValue` 和 `change`。放在 CheckboxGroup 中时，子项会交给 Group 更新数组值。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const checked = ref(false)
const eventLog = ref('等待操作')
function handleChange(value: boolean, event: Event) {
  eventLog.value = `change：${value ? '已选中' : '未选中'}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { eventLog.value = 'focus：获得焦点' }
function handleBlur(_event: FocusEvent) { eventLog.value = 'blur：失去焦点' }
</script>

<template>
  <BingCheckbox
    v-model="checked" label="接收通知" id="receive-notification" name="receive-notification"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">{{ eventLog }}</p>
  <BingButton>移动焦点</BingButton>
</template>
```

## 交互与三态切换

未选、半选、选中共用可打断的 SVG 过渡，快速连点会落到最新状态。普通复选框支持按压与悬停预览；禁用只减淡控件，错误状态保留勾选颜色和外部错误轮廓。无文字时扩展命中区，不改变布局尺寸；相邻无文字控件需留足间距。可用 --bing-checkbox-stroke 调整勾线粗细，sm/md/lg 默认为 1.5/1.75/2px。减少动态效果直接更新状态。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingCheckbox } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const selected = ref([true, false, false])
const count = computed(() => selected.value.filter(Boolean).length)
function selectAll(value: boolean) { selected.value = selected.value.map(() => value) }
</script>

<template>
  <div class="choices">
    <BingCheckbox :model-value="count === 3" :indeterminate="count > 0 && count < 3" label="全选任务" @update:model-value="selectAll" />
    <BingCheckbox v-for="(_, index) in selected" :key="index" v-model="selected[index]" :label="'任务 ' + (index + 1)" />
    <BingCheckbox :model-value="true" disabled label="不可修改的任务" />
    <p role="status">已选 {{ count }} / 3</p>
  </div>
</template>

<style scoped>
.choices { display: grid; gap: 12px; }
.choices p { margin: 0; }
</style>
```

## 属性

| 属性                | 类型                                               | 默认值         | 说明                                                                                        |
| ----------------- | ------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------- |
| `id`              | `string`                                         | `undefined` | 原生 checkbox id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。                                        |
| `modelValue`      | `boolean`                                        | `false`     | 是否选中。                                                                                     |
| `indeterminate`   | `boolean`                                        | `false`     | 半选态，只影响视觉和原生 indeterminate。                                                               |
| `disabled`        | `boolean`                                        | `undefined` | 继承 Group/Form 禁用状态，无上下文时为 false；子项不能通过 false 解除整组禁用。                                      |
| `size`            | `'sm' \| 'md' \| 'lg' \| number`                 | `undefined` | 继承 Group/Form，其次 ConfigProvider，最终默认 md；方框为 16/18/20px，带标签的最小点击高度为 32/36/40px；数字设置方框像素尺寸。 |
| `shape`           | `'rounded' \| 'circle'`                          | `'rounded'` | 控件形状。                                                                                     |
| `tone`            | `'primary' \| 'secondary'`                       | `'primary'` | 颜色语义。                                                                                     |
| `label`           | `string`                                         | `undefined` | 右侧文本标签。                                                                                   |
| `ariaLabel`       | `string`                                         | `undefined` | 无可见标签时的可访问名称。                                                                             |
| `ariaDescribedby` | `string`                                         | `undefined` | 关联额外说明元素。                                                                                 |
| `status`          | `'default' \| 'error' \| 'success' \| 'warning'` | `undefined` | 状态样式；可继承 Group/FormItem 状态。                                                               |
| `name`            | `string`                                         | `undefined` | 原生 checkbox name；在 Group 内会继承 name。                                                       |
| `value`           | `string \| number`                               | `undefined` | 在 CheckboxGroup 内用于识别该选项。                                                                 |
| `decorative`      | `boolean`                                        | `false`     | 只渲染视觉控件，保留选中动画；没有 input、扩展命中区、悬停幽灵勾和按压反馈，语义及交互由外层负责。                                      |

## 插槽与事件

### 插槽

| 插槽        | 参数  | 说明                          |
| --------- | --- | --------------------------- |
| `default` | `-` | 自定义标签内容；会替代 label prop 的文本。 |

### 事件

| 事件                  | 参数                               | 说明                                                                                   |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------------ |
| `update:modelValue` | `boolean`                        | 选中状态变化时触发。                                                                           |
| `change`            | `(value: boolean, event: Event)` | 独立使用时返回布尔状态和原始事件；Group 内提供 value 的子项由 Group 发出数组变化，不再触发子项的 change/update:modelValue。 |
| `focus`             | `FocusEvent`                     | 获得焦点时触发。                                                                             |
| `blur`              | `FocusEvent`                     | 失去焦点时触发，并会通知 FormItem 校验。                                                            |
