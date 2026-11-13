# BingFormItem

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export form-item；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

前两个示例中的 options 是演示参数，不代表组件默认值；组件默认值以属性表为准。第三个示例演示原生 input 接入。业务保存只在本地显示结果，不发送请求。

BingFormItem 是 BingForm 里的字段容器，负责标签、必填标记、字段跨度、帮助/错误消息、可访问性属性和控件上下文注入。它不会自己定义校验规则，而是通过`prop` 连接 Form 的 schema 错误。

`prop` 必须与 Form 的 model/schema 字段路径对应，控件的 `v-model` 也绑定同一字段。没有 Form schema 时，`required` 只显示星号，不会产生必填校验。若通过 Form 的 `submit` 回调保存数据，必须先判断 `payload.valid`；校验失败时该回调仍会触发。

## 标签与消息

`labelPosition` 可以覆盖单个字段的标签位置；`help` 和校验错误共用消息槽，出现错误时会用第一条错误替换帮助文本，并过渡消息内容与高度。清空错误后重新显示帮助文本，字段值保留；减少动态效果偏好下消息直接更新。

`showMessage=false` 只隐藏消息区域，不会清除错误或关闭校验，插槽的 `invalid` 仍可为 true。`disabled`、`size` 和 `labelWidth` 由 Form 传入，均不是 FormItem 的属性。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput, BingSelect } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormProps, BingFormItemProps, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type MessageOptions = Pick<BingFormProps, 'labelPosition' | 'labelWidth' | 'disabled'>
  & Pick<BingFormItemProps, 'required' | 'showMessage'>

const options: MessageOptions = {
  "labelPosition": "left",
  "labelWidth": "104px",
  "required": true,
  "showMessage": true,
  "disabled": false
}

const formRef = ref<BingFormExpose | null>(null)
const result = ref('等待校验')
const model = reactive({ name: '', role: null as BingSelectModelValue })
const roleOptions = [
  { label: '设计系统', value: 'design-system' },
  { label: '前端开发', value: 'frontend' },
  { label: '内容运营', value: 'operation' },
]
const schema = z.object({
  name: z.string().min(2, '请输入至少 2 个字符'),
  role: z.string({ message: '请选择负责方向' }),
})

async function validate() {
  const valid = await formRef.value?.validate()
  result.value = valid ? '字段表单通过校验' : '字段表单存在错误'
}

function clearErrors() {
  formRef.value?.clearValidate()
  result.value = '已清空字段错误'
}
</script>

<template>
  <BingForm
    ref="formRef" :model="model" :schema="schema" layout="stack"
    :label-position="options.labelPosition" :label-width="options.labelWidth" :disabled="options.disabled"
  >
    <BingFormItem
      prop="name" label="字段名称" :required="options.required" :show-message="options.showMessage"
      help="帮助文本和错误文本共用同一个消息槽。"
    >
      <BingInput :model-value="model.name" @update:model-value="model.name = String($event)" placeholder="输入后触发校验" block />
    </BingFormItem>
    <BingFormItem prop="role" label="负责方向" :required="options.required" :show-message="options.showMessage">
      <BingSelect v-model="model.role" :options="roleOptions" placeholder="选择方向" block />
    </BingFormItem>
  </BingForm>
  <BingButton :throttle="false" @click="validate">校验字段</BingButton>
  <BingButton :throttle="false" @click="clearErrors">清空错误</BingButton>
  <p role="status">{{ result }}</p>
</template>
```

## 字段跨度

`span` 用于 Form 的 grid 布局。它可以是数字，也可以按 `base`、`sm`、`md`、`lg`、`xl` 提供响应式值，并会自动限制在当前列数以内。

类型中的 `BingFormBreakpoint` 就是 `'base' | 'sm' | 'md' | 'lg' | 'xl'`；缺省断点继承前一个较小断点的值，从 1 开始。示例显式设置 Form 的列数为 `{ base: 1, sm: 2, xl: 3 }`，这是演示配置；Form 组件默认列数为 `{ base: 1, sm: 2, xl: 5 }`。

断点按 Form 容器宽度计算，`sm/md/lg/xl` 分别从 640/768/1024/1280px 起生效。因此宽屏页面里的窄预览区也可能只显示一列。新版 `stack` 会自动让字段占满单列，切换布局时可以保留原有 span，不会再产生隐式列。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput, BingSelect, BingTextarea } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormResponsiveNumber, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type SpanOptions = { titleSpan: BingFormResponsiveNumber; notesSpan: BingFormResponsiveNumber }

const options: SpanOptions = {
  "titleSpan": 1,
  "notesSpan": {
    "sm": 2,
    "xl": 3
  }
}

const formRef = ref<BingFormExpose | null>(null)
const result = ref('调整 span 后观察布局')
const model = reactive({ title: '', owner: '', type: null as BingSelectModelValue, notes: '' })
const typeOptions = [
  { label: '设计系统', value: 'design-system' },
  { label: '前端开发', value: 'frontend' },
  { label: '内容运营', value: 'operation' },
]
const schema = z.object({
  title: z.string().min(1, '请输入标题'),
  owner: z.string().min(1, '请输入负责人'),
  type: z.string({ message: '请选择类型' }),
  notes: z.string().max(120, '备注不能超过 120 个字符'),
})

async function validate() {
  const valid = await formRef.value?.validate()
  result.value = valid ? '布局表单通过校验' : '布局表单存在错误'
}
</script>

<template>
  <BingForm
    ref="formRef" :model="model" :schema="schema" layout="grid"
    :columns="{ base: 1, sm: 2, xl: 3 }" :gap="{ row: 14, column: 18 }"
  >
    <BingFormItem prop="title" label="标题" :span="options.titleSpan" required>
      <BingInput :model-value="model.title" @update:model-value="model.title = String($event)" placeholder="例如：新增组件文档" block />
    </BingFormItem>
    <BingFormItem prop="owner" label="负责人" required>
      <BingInput :model-value="model.owner" @update:model-value="model.owner = String($event)" placeholder="输入负责人" block />
    </BingFormItem>
    <BingFormItem prop="type" label="类型" required>
      <BingSelect v-model="model.type" :options="typeOptions" placeholder="选择类型" block />
    </BingFormItem>
    <BingFormItem prop="notes" label="备注" :span="options.notesSpan" help="span 变化会影响字段占列。">
      <BingTextarea v-model="model.notes" autosize show-count :max-length="120" />
    </BingFormItem>
  </BingForm>
  <BingButton :throttle="false" @click="validate">校验布局表单</BingButton>
  <p role="status">{{ result }}</p>
</template>
```

## 默认插槽参数

Input、Select、Textarea 等 Bing 控件会自动读取 FormItem 注入的上下文。原生 input 或自定义控件需要自行绑定 `v-model`，并从默认插槽读取 `id`、`status`、`ariaDescribedby`、`invalid`、`disabled` 和 `size`。

原生 input 不会自动通知 FormItem 校验；下面用 `@blur` 调用 `await formRef.value?.validateField('custom')`，提交时由 Form 校验。`size` 是 `sm/md/lg` 语义尺寸，不能直接赋给原生 input 的数字型 `size` 属性；示例通过 `custom-input--lg` 等样式类适配尺寸，通过 `custom-input--error` 展示错误状态。

0.6.0 发布包的插槽运行时名称仍为 `ariaDescribedby`，类型声明仍写成 `aria-describedby`。示例保留 `descriptionId` 兼容两种名称；传到 DOM 时使用 `aria-describedby`。

新版已为不同字段、控件及消息生成独立 ID。单个 Bing 控件会注册自己的实际 ID，字段标签可正确关联显式 id；CheckboxGroup/RadioGroup 使用 `aria-labelledby` 关联字段标签。原生或自定义控件仍需按下例绑定插槽 id 和消息属性；同一字段含多个独立控件时，要为每个控件提供独立的可访问名称。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const formRef = ref<BingFormExpose | null>(null)
const model = reactive({ custom: '' })
const disabled = ref(false)
const result = ref('尚未保存')
const schema = z.object({ custom: z.string().min(2, '自定义字段至少需要 2 个字符') })

// 0.6.0 的运行时使用 camelCase，发布类型仍使用 kebab-case；兼容两者。
function descriptionId(field: { ariaDescribedby?: string; 'aria-describedby'?: string }) {
  return field.ariaDescribedby ?? field['aria-describedby']
}

async function validateCustom() {
  // 原生 input 不会注入 Bing 控件上下文，失焦时显式调用字段校验。
  await formRef.value?.validateField('custom')
}

function submit(payload: BingFormSubmitPayload) {
  if (!payload.valid) {
    result.value = '校验失败，未保存'
    return
  }
  result.value = '可以保存：' + model.custom
}
</script>

<template>
  <BingForm
    ref="formRef" :model="model" :schema="schema" layout="stack" size="lg"
    :disabled="disabled" :validate-trigger="['submit']" @submit="submit"
  >
    <BingFormItem prop="custom" label="自定义控件" help="失焦或提交时校验，至少输入 2 个字符。" required>
      <template #default="field">
        <input
          :id="field.id" v-model="model.custom" class="custom-input"
          :aria-describedby="descriptionId(field)" :aria-invalid="field.invalid"
          :disabled="field.disabled" :class="['custom-input--' + field.status, 'custom-input--' + field.size]"
          @blur="validateCustom"
        >
      </template>
    </BingFormItem>
    <BingButton html-type="submit" :disabled="disabled" :throttle="false">保存自定义字段</BingButton>
  </BingForm>
  <label><input v-model="disabled" type="checkbox">禁用自定义字段</label>
  <p role="status">{{ result }}</p>
</template>

<style scoped>
.custom-input { box-sizing: border-box; width: 100%; padding: 8px 12px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-control-bg); color: var(--bing-text); font: inherit; }
.custom-input--error { border-color: var(--bing-danger-strong); }
.custom-input--lg { min-height: 40px; }
.custom-input:focus-visible { outline: 2px solid var(--bing-accent); outline-offset: 2px; }
.custom-input:disabled { opacity: .5; }
</style>
```

## 属性

| 属性              | 类型                                                      | 默认值         | 说明                                                                    |
| --------------- | ------------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `prop`          | `string`                                                | `undefined` | 字段路径。用于读取 Form schema 错误，也用于 validateField 和 clearValidate。           |
| `label`         | `string`                                                | `undefined` | 字段标签。                                                                 |
| `required`      | `boolean`                                               | `false`     | 是否显示必填星号；实际校验仍由 schema 决定。                                            |
| `span`          | `number \| Partial<Record<BingFormBreakpoint, number>>` | `1`         | grid 布局的字段占列数，限制在 1 到对应断点的 Form columns 之间；缺省断点继承较小断点。stack 布局自动占满单列。 |
| `help`          | `string`                                                | `undefined` | 帮助文本；没有错误时显示在消息区域。                                                    |
| `showMessage`   | `boolean`                                               | `true`      | 是否保留并显示消息区域；false 不会关闭 schema 校验或清空错误。                                |
| `labelPosition` | `'top' \| 'left'`                                       | `undefined` | 覆盖当前字段的标签位置；未传时继承 Form。                                               |

## 插槽参数

| 参数                | 类型                     | 说明                                                                                          |
| ----------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `id`              | `string`               | 传给自定义控件的唯一 id，对应 label for；每个字段自动生成独立值。                                                     |
| `status`          | `'default' \| 'error'` | 运行时有错误为 error，否则为 default；发布包类型声明为 string。                                                  |
| `ariaDescribedby` | `string \| undefined`  | 运行时的消息节点 id；无消息或 showMessage=false 时为 undefined。0.6.0 发布类型仍误写为 aria-describedby，完整示例兼容两种名称。 |
| `invalid`         | `boolean`              | 是否存在错误。                                                                                     |
| `disabled`        | `boolean`              | 从 Form 继承的禁用状态。                                                                             |
| `size`            | `'sm' \| 'md' \| 'lg'` | 从 Form 继承的尺寸；Form 未设置时取 ConfigProvider，否则 md。                                               |
