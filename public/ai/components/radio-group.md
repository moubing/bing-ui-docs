# BingRadioGroup

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export radio-group；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例中的 options 是演示配置，不代表组件默认值。RadioGroup 使用单值模型，null 表示未选中；各组使用不同的 name 以保持独立。status 仅表示状态样式，实际校验规则由 Form schema 或业务提供。

BingRadioGroup 是单选组容器，用于在多个互斥选项中选择一个值。它支持 `options` 自动渲染、默认插槽自定义 Radio、方向/尺寸/状态统一下发、整组禁用、焦点事件和键盘方向键切换，适合表单单选、设置项和模式切换。

## 基础配置

使用 `v-model` 保存当前选中的单个值；`direction` 控制排列方式，`size` 和 `status` 会传给组内所有 Radio。

`BingRadioValue` 是 `string | number | boolean`，可用 `ref<BingRadioValue | null>(null)` 表示初始未选择。0 和 false 都可以是合法选项值，判断是否为空应与 null 比较。模板中的数字或布尔值使用绑定语法，例如 `:value="0"`、`:value="false"`，不要写成字符串属性。点击已选中的 Radio 不会反选；外部赋值为 null 才能清空。

新版为 Group 和每个 Radio 自动生成唯一 ID，默认 name 也会隔离不同组；普通多实例使用可省略 id/name，以下示例保留名称便于业务识别。`options` 渲染仍以 `String(value)` 作为 Vue key，因此同一 options 数组应避免混用 0 与 "0" 等字符串化后相同的值。

尺寸默认继承 Form，最终回退到 md；sm/md/lg 的圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px。整组禁用优先于子项的 `disabled=false`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioGroupProps, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingRadioGroupProps = {
  "direction": "wrap",
  "size": "md",
  "status": "default",
  "disabled": false
}

const items: BingRadioGroupOption[] = [
  { label: '标准模式', value: 'standard', description: '默认密度，适合常规表单。' },
  { label: '紧凑模式', value: 'compact', description: '减少垂直空间，适合工具栏。' },
  { label: '沉浸模式', value: 'immersive', description: '更适合展示型页面。' },
  { label: '实验模式', value: 'labs', description: '暂不可选。', disabled: true },
]
const selected = ref<BingRadioValue | null>('standard')
function selectRecommended() { selected.value = 'standard' }
function clear() { selected.value = null }
</script>

<template>
  <BingRadioGroup
    v-model="selected" :options="items" v-bind="options"
    id="display-mode" name="display-mode" ariaLabel="展示模式"
  />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="selectRecommended">选择推荐</BingButton>
    <BingButton size="sm" variant="ghost" @click="clear">清空外部值</BingButton>
  </div>
  <p role="status">当前值：{{ selected === null ? '未选择' : String(selected) }}</p>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
</style>
```

## Options 自动渲染

`options` 适合结构统一的单选项。每个选项至少需要 `label` 和 `value`，可选的 `description` 会显示为辅助说明。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingRadioGroupOption[] = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' },
]
const theme = ref<BingRadioValue | null>('system')
</script>

<template>
  <BingRadioGroup
    v-model="theme" :options="items" direction="row" size="sm"
    id="theme-mode" name="theme-mode" ariaLabel="主题模式"
  />
  <p>当前主题：{{ theme }}</p>
</template>
```

## 自定义选项内容

需要更复杂的选项排版时，可以在默认插槽里手写 `BingRadio`。子项只需要提供 `value`，选中状态和事件会交给 Group 统一处理。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scope = ref<BingRadioValue | null>('api')
</script>

<template>
  <!-- 默认插槽替代 options；子 Radio 只提供 value，不分别绑定 v-model。 -->
  <BingRadioGroup
    v-model="scope" direction="column" id="doc-scope" name="doc-scope" ariaLabel="文档范围"
    :options="[{ label: '这项不会显示', value: 'unused' }]"
  >
    <BingRadio value="usage">
      <span class="rich-option"><strong>使用说明</strong><span>先解释组件解决什么问题。</span></span>
    </BingRadio>
    <BingRadio value="api">
      <span class="rich-option"><strong>API 表格</strong><span>集中列出 props、slots 和 events。</span></span>
    </BingRadio>
    <BingRadio value="demo">
      <span class="rich-option"><strong>交互示例</strong><span>用真实组件演示变化。</span></span>
    </BingRadio>
  </BingRadioGroup>
  <p role="status">当前值：{{ scope }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; }
</style>
```

## 键盘切换与事件

Group 会监听 `ArrowRight`、`ArrowDown`、`ArrowLeft` 和`ArrowUp`。当焦点在组内时，方向键会移动到下一个可用 Radio，并跳过禁用项。

方向键移动焦点时会同时选中目标，首尾循环；此组件没有 Tabs 的 manual 激活模式或 loop 属性。`change` 接收 `(value: BingRadioValue, event: Event)` 两个参数，不是 payload 对象。focus/blur 按整个组的边界触发，组内换焦点不会重复触发。

`status="error"` 只表示状态样式，必选规则仍需由 Form schema 或业务校验；在 FormItem 中使用时，模型字段和 schema 路径需通过 FormItem 的 `prop` 对应。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingRadioGroupOption[] = [
  { label: '第一步', value: 'step-1', description: '确认基础信息。' },
  { label: '第二步', value: 'step-2', description: '此项禁用，会被方向键跳过。', disabled: true },
  { label: '第三步', value: 'step-3', description: '检查文档示例。' },
]
const step = ref<BingRadioValue | null>('step-1')
const eventLog = ref('等待操作')
const focusCount = ref(0)
const blurCount = ref(0)
function handleChange(value: BingRadioValue, event: Event) {
  eventLog.value = `change：${String(value)}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { focusCount.value += 1 }
function handleBlur(_event: FocusEvent) { blurCount.value += 1 }
</script>

<template>
  <BingRadioGroup
    v-model="step" :options="items" direction="column"
    id="doc-steps" name="doc-steps" ariaLabel="文档步骤"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">当前值：{{ step }}；{{ eventLog }}</p>
  <p>进入组：{{ focusCount }}；离开组：{{ blurCount }}</p>
  <BingButton>组外按钮</BingButton>
</template>
```

## 属性

| 属性                | 类型                                               | 默认值         | 说明                                                              |
| ----------------- | ------------------------------------------------ | ----------- | --------------------------------------------------------------- |
| `id`              | `string`                                         | `undefined` | Group 根节点 id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。                |
| `modelValue`      | `BingRadioValue \| null`                         | `null`      | 当前选中的值。                                                         |
| `options`         | `BingRadioGroupOption[]`                         | `[]`        | 通过配置自动渲染子 Radio。传入默认插槽时，插槽内容会替代 options 渲染。                     |
| `disabled`        | `boolean`                                        | `undefined` | 继承 Form，最终默认 false；true 禁用所有子项，false 可覆盖表单禁用；启用整组时仍保留选项自己的禁用状态。 |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `undefined` | 整组选项尺寸；继承 Form，其次 ConfigProvider，最终默认 md，圆点控件为 16/18/20px。      |
| `direction`       | `'row' \| 'column' \| 'wrap'`                    | `'wrap'`    | 控制选项排列方向。                                                       |
| `name`            | `string`                                         | `undefined` | 子 Radio 的原生 name；默认生成组内统一、组间唯一的名称。                              |
| `ariaLabel`       | `string`                                         | `undefined` | Radiogroup 的可访问名称。                                              |
| `ariaDescribedby` | `string`                                         | `undefined` | 关联额外说明元素；在 BingFormItem 内会合并表单说明。                               |
| `status`          | `'default' \| 'error' \| 'success' \| 'warning'` | `undefined` | 整组状态样式；在 BingFormItem 内可继承校验状态。                                 |

## Option 结构

| 字段            | 类型                            | 默认值         | 说明                        |
| ------------- | ----------------------------- | ----------- | ------------------------- |
| `label`       | `string`                      | `必填`        | 自动渲染模式下的选项主文案。            |
| `value`       | `string \| number \| boolean` | `必填`        | 写入 modelValue 的选项值。       |
| `disabled`    | `boolean`                     | `false`     | 是否禁用当前选项。                 |
| `description` | `string`                      | `undefined` | 选项描述文案；自动渲染时展示在 label 下方。 |

## 插槽与事件

### 插槽

| 插槽        | 参数  | 说明                               |
| --------- | --- | -------------------------------- |
| `default` | `-` | 自定义子 Radio 列表；使用插槽时不会渲染 options。 |

### 事件

| 事件                  | 参数                                      | 说明                                       |
| ------------------- | --------------------------------------- | ---------------------------------------- |
| `update:modelValue` | `BingRadioValue`                        | 选中值变化时触发。                                |
| `change`            | `(value: BingRadioValue, event: Event)` | 子 Radio 原生 change 后触发，两个参数分别为最新选中值与原始事件。 |
| `focus`             | `FocusEvent`                            | 焦点从组外进入任意子 Radio 时触发一次。                  |
| `blur`              | `FocusEvent`                            | 焦点离开整组时触发，并通知 FormItem 进行 blur 校验。       |
