# BingCheckboxGroup

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export checkbox-group；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例的 options 是演示配置，不代表组件默认值。modelValue 是值数组；status 仅控制样式，实际校验规则由 Form schema 或业务提供。五个示例各自持有独立状态。

BingCheckboxGroup 是多选组容器，用于把多个 BingCheckbox 组合成同一个`v-model` 数组。它可以通过 `options` 快速生成选项，也可以用默认插槽手写复杂选项内容，并统一下发尺寸、禁用、状态、name、焦点和表单校验上下文。

## 基础配置

最常见的用法是传入 `options`，每个选项用 `value` 写入数组。`direction` 控制排列方式，`size` 和 `status` 会同步影响组内所有选项。

`BingCheckboxGroupValue` 是 `string | number`，选中模型必须是数组，例如 `ref<BingCheckboxGroupValue[]>([])`；它不是每项一个布尔值。每个选项使用唯一值，数字与字符串应保持类型一致。禁用控制用户操作，业务仍可通过赋值更新模型；“全选可用项”显式排除了禁用选项。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupProps, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingCheckboxGroupProps = {
  "direction": "wrap",
  "size": "md",
  "status": "default",
  "disabled": false
}

const items: BingCheckboxGroupOption[] = [
  { label: '键盘导航', value: 'keyboard', description: '支持 Tab、Space 与焦点反馈。' },
  { label: '动效反馈', value: 'motion', description: '开启悬浮、点击和选中动效。' },
  { label: '批量操作', value: 'batch', description: '允许一次选择多个操作对象。' },
  { label: '实验功能', value: 'labs', description: '暂时不可选。', disabled: true },
]
const selected = ref<BingCheckboxGroupValue[]>(['keyboard', 'motion'])
function selectAll() { selected.value = items.filter(item => !item.disabled).map(item => item.value) }
function clear() { selected.value = [] }
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-13" name="checkbox-doc-13" v-model="selected" :options="items" v-bind="options" ariaLabel="功能开关选项" />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="selectAll">全选可用项</BingButton>
    <BingButton size="sm" variant="ghost" @click="clear">清空</BingButton>
  </div>
  <p role="status">当前值：{{ selected.length ? selected.join('、') : '未选择' }}</p>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
</style>
```

## Options 自动渲染

`options` 适合结构统一的多选项。选项可以带 `description`，也可以在单个选项上设置 `disabled`，禁用状态会和 Group 的禁用状态一起计算。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '文档', value: 'docs' },
  { label: '示例', value: 'demo' },
  { label: '类型', value: 'types' },
]
const selected = ref<BingCheckboxGroupValue[]>(['docs'])
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-11" name="checkbox-doc-11" v-model="selected" :options="items" direction="row" size="sm" ariaLabel="文档范围" />
  <p>已选择：{{ selected.length ? selected.join('、') : '未选择' }}</p>
</template>
```

## 自定义选项内容

需要更复杂的排版时，可以在默认插槽里手写 `BingCheckbox`。子 Checkbox 会自动读取 Group 的 `modelValue`、`disabled`、`size`、`status` 和 `name`，因此只需要提供自己的 `value`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckbox, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const selected = ref<BingCheckboxGroupValue[]>(['design'])
</script>

<template>
  <!-- 默认插槽会替代 options；子 Checkbox 只需提供 value，无需各自绑定 v-model。 -->
  <BingCheckboxGroup id="checkbox-doc-10"
    v-model="selected" direction="column" name="review-scope" ariaLabel="评审范围"
    :options="[{ label: '这项不会显示', value: 'unused' }]"
  >
    <BingCheckbox value="design">
      <span class="rich-option"><strong>设计走查</strong><span>检查状态、间距和可访问名称。</span></span>
    </BingCheckbox>
    <BingCheckbox value="api">
      <span class="rich-option"><strong>API 对齐</strong><span>确认 props、slots 和 events 都有文档。</span></span>
    </BingCheckbox>
    <BingCheckbox value="demo">
      <span class="rich-option"><strong>示例验证</strong><span>保证示例能直接体现组件能力。</span></span>
    </BingCheckbox>
  </BingCheckboxGroup>
  <p role="status">已选择：{{ selected.join('、') }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; }
</style>
```

## 状态与事件

Group 会在根节点上设置 `role="group"` 与状态类名。当用户切换任意子项时，Group 会发出完整数组；焦点进入或离开整组时，也会分别触发`focus` 和 `blur`。

`change` 回调接收两个参数 `(value: BingCheckboxGroupValue[], event: Event)`，第一个是完整选中数组，不是本次点击的单个值或 payload 对象。焦点在同组子项之间移动时，不会重复触发组级 focus/blur。

`status="error"` 只控制状态样式，不会自动校验必选或最少数量。在 FormItem 中使用时，Form 的模型和 schema 路径通过 FormItem 的 `prop` 对应；例如 Zod 数组规则 `.min(1)` 才会要求至少一项。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '站内提醒', value: 'inbox' },
  { label: '邮件', value: 'email' },
  { label: 'Webhook', value: 'webhook' },
]
const channels = ref<BingCheckboxGroupValue[]>(['email'])
const eventLog = ref('等待操作')
const focusCount = ref(0)
const blurCount = ref(0)
function handleChange(value: BingCheckboxGroupValue[], event: Event) {
  eventLog.value = `change：${value.join('、')}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { focusCount.value += 1 }
function handleBlur(_event: FocusEvent) { blurCount.value += 1 }
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-12" name="checkbox-doc-12"
    v-model="channels" :options="items" direction="column" status="success" ariaLabel="通知渠道"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">{{ eventLog }}</p>
  <p>进入组：{{ focusCount }}；离开组：{{ blurCount }}</p>
  <BingButton>组外按钮</BingButton>
</template>
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '代码生成', value: 'code' },
  { label: '视觉回归', value: 'visual' },
  { label: '自动发布', value: 'release' },
]
const selected = ref<BingCheckboxGroupValue[]>(['code'])
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-9" name="checkbox-doc-9"
    v-model="selected" :options="items" status="error" direction="column"
    ariaLabel="发布检查项" ariaDescribedby="release-help"
  />
  <p id="release-help">error 只表示状态样式，不会自动校验最少选择数量；实际规则需在 Form schema 或业务中定义。</p>
  <p>当前值：{{ selected.join('、') }}</p>
</template>
```

## 刷选、范围选择与全选

dragSelect 和 rangeSelect 默认均为 false。开启后鼠标或触控笔可以跨项刷选，Shift + 点击从上次点击项选择范围，跳过禁用项；触摸保留原生滚动。刷选过程中模型即时更新，松开后发出一次 change；范围选择也只发出一次 change。全选和半选由业务计算，模型更新立即完成，级联仅影响显示节奏。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingCheckbox, BingCheckboxGroup, type BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const selected = ref<BingCheckboxGroupValue[]>([])
const changes = ref(0)
const options = [
  { label: '设计', value: 1 }, { label: '开发', value: 2 },
  { label: '已归档（禁用）', value: 3, disabled: true },
  { label: '测试', value: 4 }, { label: '发布', value: 5 },
]
const available = options.filter(option => !option.disabled).map(option => option.value)
const count = computed(() => available.filter(value => selected.value.includes(value)).length)
function selectAll(value: boolean) { selected.value = value ? [...available] : [] }
</script>

<template>
  <div class="batch">
    <BingCheckbox :model-value="count === available.length" :indeterminate="count > 0 && count < available.length" label="全选可用项" @update:model-value="selectAll" />
    <BingCheckboxGroup v-model="selected" :options="options" direction="column" drag-select range-select ariaLabel="批量选择" @change="changes++" />
    <p role="status">已选：{{ selected.join(', ') || '无' }}；change：{{ changes }}</p>
  </div>
</template>

<style scoped>
.batch { display: grid; gap: 18px; }
.batch p { margin: 0; }
</style>
```

## 属性

新版为 Group 与子 Checkbox 自动生成唯一 ID，默认 name 在组内统一、组间独立。示例显式提供名称便于业务识别，普通多实例使用可省略 id/name。`ariaLabel` 提供组名，`ariaDescribedby` 关联说明元素的 ID。

尺寸默认继承 Form，最终回退到 md；sm/md/lg 的方框为 16/18/20px，带标签的最小点击高度为 32/36/40px。整组禁用优先于子项的 `disabled=false`，启用组后，单项禁用仍然生效。

| 属性                | 类型                                               | 默认值         | 说明                                                              |
| ----------------- | ------------------------------------------------ | ----------- | --------------------------------------------------------------- |
| `dragSelect`      | `boolean`                                        | `false`     | 鼠标或触控笔跨项拖动连续选择，跳过禁用项；触摸保留原生滚动。                                  |
| `rangeSelect`     | `boolean`                                        | `false`     | Shift + 点击选择上次点击锚点到当前项之间的可用项。                                   |
| `id`              | `string`                                         | `undefined` | Group 根节点 id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。                |
| `modelValue`      | `BingCheckboxGroupValue[]`                       | `[]`        | 当前选中的值数组；每一项来自 option.value 或子 Checkbox 的 value。                |
| `options`         | `BingCheckboxGroupOption[]`                      | `[]`        | 通过配置自动渲染子 Checkbox。传入默认插槽时，插槽内容会替代 options 渲染。                  |
| `disabled`        | `boolean`                                        | `undefined` | 继承 Form，最终默认 false；true 禁用所有子项，false 可覆盖表单禁用；启用整组时仍保留选项自己的禁用状态。 |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `undefined` | 整组选项尺寸；继承 Form，其次 ConfigProvider，最终默认 md，方框为 16/18/20px。        |
| `direction`       | `'row' \| 'column' \| 'wrap'`                    | `'wrap'`    | 控制选项排列方向。                                                       |
| `name`            | `string`                                         | `undefined` | 子 Checkbox 的原生 name；默认生成组内统一、组间唯一的名称。                           |
| `ariaLabel`       | `string`                                         | `undefined` | Group 的可访问名称。                                                   |
| `ariaDescribedby` | `string`                                         | `undefined` | 关联额外说明元素；在 BingFormItem 内会合并表单说明。                               |
| `status`          | `'default' \| 'error' \| 'success' \| 'warning'` | `undefined` | 整组状态样式；在 BingFormItem 内可继承校验状态。                                 |

## Option 结构

| 字段            | 类型                 | 默认值         | 说明                        |
| ------------- | ------------------ | ----------- | ------------------------- |
| `label`       | `string`           | `必填`        | 自动渲染模式下的选项主文案。            |
| `value`       | `string \| number` | `必填`        | 写入 modelValue 的选项值。       |
| `disabled`    | `boolean`          | `false`     | 是否禁用当前选项。                 |
| `description` | `string`           | `undefined` | 选项描述文案；自动渲染时展示在 label 下方。 |

## 插槽与事件

### 插槽

| 插槽        | 参数  | 说明                                  |
| --------- | --- | ----------------------------------- |
| `default` | `-` | 自定义子 Checkbox 列表；使用插槽时不会渲染 options。 |

### 事件

| 事件                  | 参数                                                | 说明                                               |
| ------------------- | ------------------------------------------------- | ------------------------------------------------ |
| `update:modelValue` | `BingCheckboxGroupValue[]`                        | 选中项数组变化时触发。                                      |
| `change`            | `(value: BingCheckboxGroupValue[], event: Event)` | 普通切换和 Shift 范围选择提交一次；刷选期间模型即时更新，结束时仅发出一次 change。 |
| `focus`             | `FocusEvent`                                      | 焦点从组外进入任意子 Checkbox 时触发一次。                       |
| `blur`              | `FocusEvent`                                      | 焦点离开整组时触发，并通知 FormItem 进行 blur 校验。               |
