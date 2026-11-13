# BingRadio

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export radio；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。四个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

基础示例中的 options 是演示配置，不代表组件默认值。Radio 比较模型与 value 的值和类型；同组共用模型及 name，每项 id 唯一。组内选择由 RadioGroup 更新和发出变化事件。

BingRadio 是单选项组件，用于在一组选项中选择一个值。它支持主文案、描述文案、尺寸、禁用、状态和 GSAP 选中动效；独立使用时直接更新自己的`v-model`，放进 BingRadioGroup 后会自动接入组内的值、name、尺寸和状态。

## 基础配置

单个 Radio 的核心是 `modelValue` 与 `value` 的比较。当二者相等时，当前项就是选中状态；点击当前项会把它的 `value` 写回 `v-model`。

`BingRadioValue` 为 `string | number | boolean`，比较使用严格相等。`value="0"` 是字符串，`:value="0"` 才是数字；布尔值同样使用绑定，例如 `:value="false"`。模型可设为 `null` 表示未选择；再次点击已选项不会反选。

新版会为每个 Radio 自动生成唯一 ID，无须为了避免重复而手工指定。同一组独立 Radio 仍需共用模型和 `name`，不同业务组选用不同 `name`；需要统一键盘导航和组级状态时使用 RadioGroup。

RadioGroup 的 `options` 模式也会生成唯一子项 ID。需要业务指定的子项 ID 时，可采用下方的默认插槽写法。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingRadio } from '@moubing/bing-ui'
import type { BingRadioProps, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingRadioProps = {
  "value": "docs",
  "label": "文档模式",
  "description": "为组件文档保留完整说明和示例。",
  "size": "md",
  "status": "default",
  "disabled": false
}

const selected = ref<BingRadioValue | null>('docs')
const checked = computed(() => selected.value === options.value)
</script>

<template>
  <BingRadio id="radio-doc-mode" v-model="selected" v-bind="options" name="radio-doc-mode" />
  <p role="status">modelValue：{{ selected }}；value：{{ options.value }}；{{ checked ? '当前项已选中' : '当前项未选中' }}</p>
</template>
```

## 尺寸、描述与状态

`description` 会让 Radio 进入带说明的排版，控件与文案顶部对齐。`status` 常用于表单校验，独立使用或在 RadioGroup 中都可以继承到视觉状态。

`status` 只控制视觉状态，不会自动建立必选规则。下面五项共用一个选中值，用于对比尺寸与状态。sm/md/lg 的圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px；默认继承 RadioGroup/Form，最终回退到 md。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 同组独立 Radio 共用模型和 name，每项的 id 与 value 不同。
const selected = ref<BingRadioValue | null>('md')
</script>

<template>
  <div class="radio-states">
    <BingRadio id="radio-state-sm" v-model="selected" name="radio-states" value="sm" size="sm" label="小尺寸" />
    <BingRadio id="radio-state-md" v-model="selected" name="radio-states" value="md" size="md" label="中尺寸" description="带描述文本时，控件会和内容顶部对齐。" />
    <BingRadio id="radio-state-lg" v-model="selected" name="radio-states" value="lg" size="lg" label="大尺寸" />
    <BingRadio id="radio-state-error" v-model="selected" name="radio-states" value="error" status="error" label="错误状态" />
    <BingRadio id="radio-state-disabled" v-model="selected" name="radio-states" value="disabled" disabled label="禁用状态" />
  </div>
  <p role="status">当前值：{{ selected }}</p>
</template>

<style scoped>
.radio-states { display: grid; gap: 16px; }
</style>
```

## 放在 RadioGroup 中

当 BingRadio 放进 BingRadioGroup 时，子项会通过上下文读取 Group 的 `modelValue`、`disabled`、`size`、`status` 和 `name`。这种写法适合每个选项都需要自定义内容的场景。

组内只给 Group 绑定 `v-model`，每个 Radio 提供不同的 `value`，从 Group 监听 `change(value, event)`；组内 Radio 不再单独发出 `update:modelValue` 或 `change`。不要为子项设置不同的 name，避免破坏原生单选分组。整组禁用优先于子项的 `disabled=false`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingRadio, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mode = ref<BingRadioValue | null>('compact')
const eventLog = ref('等待组内变化')
function handleGroupChange(value: BingRadioValue, event: Event) {
  eventLog.value = `Group change：${String(value)}；原始事件：${event.type}`
}
</script>

<template>
  <BingRadioGroup id="display-mode" v-model="mode" direction="column" name="display-mode" ariaLabel="展示方案" @change="handleGroupChange">
    <BingRadio id="display-mode-default" value="default">
      <span class="rich-option"><strong>默认方案</strong><span>适合大多数页面。</span></span>
    </BingRadio>
    <BingRadio id="display-mode-compact" value="compact">
      <span class="rich-option"><strong>紧凑方案</strong><span>适合信息密度更高的面板。</span></span>
    </BingRadio>
    <BingRadio id="display-mode-immersive" value="immersive">
      <span class="rich-option"><strong>沉浸方案</strong><span>适合展示型页面。</span></span>
    </BingRadio>
  </BingRadioGroup>
  <p role="status">当前方案：{{ mode }}；{{ eventLog }}</p>
</template>

<style scoped>
.rich-option { display: grid; gap: 4px; }
.rich-option > span { font-size: 13px; opacity: .7; }
</style>
```

## 事件反馈

独立使用时，Radio 被选中才会触发 `update:modelValue` 和 `change`。如果它已经处于选中状态，再点击不会产生新的值变化。

`change` 处理函数接收 `(value: BingRadioValue, event: Event)` 两个参数。原生 input 的字符串 value 与组件发出的模型类型不同，业务优先读取第一个参数。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadio } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const selected = ref<BingRadioValue | null>('none')
const eventLog = ref('等待操作')
function handleChange(value: BingRadioValue, event: Event) {
  eventLog.value = `change：已选中 ${String(value)}；原始事件：${event.type}`
}
function handleFocus() { eventLog.value = 'focus：获得焦点' }
function handleBlur() { eventLog.value = 'blur：失去焦点' }
function reset() {
  // 改为不匹配 value 的值即可取消选中，也可以设为 null。
  selected.value = 'none'
  eventLog.value = '已重置'
}
</script>

<template>
  <BingRadio id="radio-email" v-model="selected" name="radio-email" value="email" label="邮件通知" description="点击后写入 email。" @change="handleChange" @focus="handleFocus" @blur="handleBlur" />
  <BingButton size="sm" variant="ghost" @click="reset">重置</BingButton>
  <p role="status">当前值：{{ selected }}；{{ eventLog }}</p>
</template>
```

## 属性

| 属性                | 类型                                               | 默认值         | 说明                                                                                    |
| ----------------- | ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------- |
| `id`              | `string`                                         | `undefined` | 原生 radio id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。                                       |
| `modelValue`      | `BingRadioValue \| null`                         | `null`      | 当前选中的值；放在 RadioGroup 内时由 Group 接管。                                                    |
| `value`           | `BingRadioValue`                                 | `true`      | 当前 Radio 代表的值，选中时写入 modelValue。                                                       |
| `disabled`        | `boolean`                                        | `undefined` | 继承 RadioGroup/Form 禁用状态，无上下文时为 false；子项不能通过 false 解除整组禁用。                             |
| `size`            | `'sm' \| 'md' \| 'lg'`                           | `undefined` | 继承 RadioGroup/Form，其次 ConfigProvider，最终默认 md；圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px。 |
| `label`           | `string`                                         | `undefined` | 右侧主文案。                                                                                |
| `description`     | `string`                                         | `undefined` | 右侧辅助说明文案。                                                                             |
| `ariaLabel`       | `string`                                         | `undefined` | 无可见标签时的可访问名称。                                                                         |
| `ariaDescribedby` | `string`                                         | `undefined` | 关联额外说明元素；独立使用并放在 FormItem 内时会合并表单说明。                                                  |
| `status`          | `'default' \| 'error' \| 'success' \| 'warning'` | `undefined` | 状态样式；在 RadioGroup/FormItem 内会继承校验状态。                                                  |
| `name`            | `string`                                         | `undefined` | 原生 radio name；放在 RadioGroup 内会继承 Group 的统一 name。                                      |

## 插槽与事件

### 插槽

| 插槽            | 参数  | 说明                            |
| ------------- | --- | ----------------------------- |
| `default`     | `-` | 自定义主标签内容；会替代 label prop。      |
| `description` | `-` | 自定义描述内容；会替代 description prop。 |

### 事件

| 事件                  | 参数                                      | 说明                                       |
| ------------------- | --------------------------------------- | ---------------------------------------- |
| `update:modelValue` | `BingRadioValue`                        | 独立使用时，当前 Radio 被选中后触发。                   |
| `change`            | `(value: BingRadioValue, event: Event)` | 独立使用时选中后触发，接收两个参数；组内由 Group 发出，子项不再单独触发。 |
| `focus`             | `FocusEvent`                            | 获得焦点时触发。                                 |
| `blur`              | `FocusEvent`                            | 失去焦点时触发；独立使用时会通知 FormItem blur 校验。       |
