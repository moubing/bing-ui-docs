# BingForm

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export form；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。三个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

布局示例中的 options 是示例选择的参数，不代表组件默认值；组件默认值以属性表为准。业务接口由使用方接入，示例不会发送保存请求。

BingForm 是表单容器，负责响应式布局、统一尺寸/禁用上下文、Zod schema 校验、提交事件和表单方法。具体字段标签、错误消息和控件关联由 BingFormItem 承接。

`schema` 使用从包入口导出的 `BingFormSchema` 类型，只要求 `safeParseAsync(data: unknown)` 返回校验结果 Promise：成功为 `{ success: true, data }`，失败为 `{ success: false, error: { issues: [{ path, message }] } }`。`path` 是字符串、数字或 symbol 组成的字段路径数组，`message` 是错误文本。现有 Zod schema 可直接传入，同步、异步规则和转换均兼容；使用 Zod 示例时需自行安装 `zod@^4`。从 0.12.4 起，公共声明不再引用 Zod，未安装 Zod 的项目也能在 `skipLibCheck: false` 下检查组件类型。

## 布局与校验

`layout` 提供 grid、stack、inline 三种排布；`columns` 控制 grid 列数，`gap` 控制间距（stack 只使用行间距）。尺寸 sm/md/lg 对应主要输入控件高度 32/36/40px，字段和控件默认继承 Form 的尺寸。

`BingFormItem.required` 只显示必填星号，不会自动增加校验规则。实际约束写在 Form 的 Zod `schema` 中，`FormItem.prop` 与 `model`、schema 的字段路径对应。例如数组至少选一项，需要 `z.array(z.string()).min(1, '至少选择一个通知渠道')`，并将同一个数组通过 `v-model` 传给 `BingCheckboxGroup`。

提交校验失败时仍会触发 `submit`，随后触发 `invalid`。业务回调必须先判断 `payload.valid`，失败时直接返回，避免执行保存。提交按钮使用 `BingButton` 的 `html-type="submit"`。

默认 `validateTrigger` 为 `'auto'`：首次输入时不立刻报错，离开字段或提交时校验；字段已有错误后，修改内容会自动复查。需要每次输入都校验时，显式设置 `['change', 'blur', 'submit']`。

如果配置中既没有 `auto` 也没有 `submit`，例如 `['manual']`，提交事件不会自动执行 schema 校验，`payload.valid` 会直接为 true。保存前应保留提交校验，或主动调用 `await formRef.value?.validate()`，只有返回 true 才执行保存。未传入 `schema` 时也不会执行规则校验。

默认 `focusOnError=true`，提交失败后聚焦页面顺序中的首个可用错误字段；`scrollToError` 独立控制滚动。异步校验期间继续编辑或改变焦点时不会再把焦点拉回。手动 `validate()` 可滚动定位错误，但不会主动聚焦；`validateField()` 只更新相关错误。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import {
  BingButton, BingCheckboxGroup, BingForm, BingFormItem,
  BingInput, BingRadioGroup, BingSelect, BingTextarea,
} from '@moubing/bing-ui'
import type {
  BingCheckboxGroupValue, BingFormExpose, BingFormProps, BingFormSchema,
  BingFormSubmitPayload, BingRadioValue, BingSelectModelValue,
} from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const options: BingFormProps = {
  "layout": "grid",
  "labelPosition": "top",
  "labelWidth": "112px",
  "size": "md",
  "columns": {
    "base": 1,
    "sm": 2,
    "xl": 3
  },
  "gap": {
    "row": "14px",
    "column": "18px"
  },
  "validateTrigger": [
    "auto"
  ],
  "disabled": false,
  "scrollToError": true,
  "focusOnError": true
}

const formRef = ref<BingFormExpose | null>(null)
const result = ref('等待提交')
const model = reactive({
  name: '',
  role: null as BingSelectModelValue,
  channels: ['inbox'] as BingCheckboxGroupValue[],
  density: 'comfortable' as BingRadioValue,
  description: '',
})
const roleOptions = [
  { label: '设计系统', value: 'design-system' },
  { label: '前端开发', value: 'frontend' },
]
const channelOptions = [
  { label: '站内消息', value: 'inbox' },
  { label: '邮件通知', value: 'email' },
]
const densityOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '舒展', value: 'comfortable' },
]
const schema = z.object({
  name: z.string().min(2, '请输入至少 2 个字符的项目名称'),
  role: z.string({ message: '请选择负责方向' }),
  channels: z.array(z.string()).min(1, '至少选择一个通知渠道'),
  density: z.string(),
  description: z.string().max(120, '描述不能超过 120 个字符'),
}) satisfies BingFormSchema

function handleSubmit(payload: BingFormSubmitPayload) {
  // submit 在校验失败时也会触发；必须先检查 valid。
  if (!payload.valid) {
    result.value = '校验失败，未执行保存'
    return
  }
  // 在这里接入业务保存逻辑；本示例只展示结果。
  result.value = '可以保存：' + JSON.stringify(model)
}
</script>

<template>
  <BingForm ref="formRef" :model="model" :schema="schema" v-bind="options" @submit="handleSubmit">
    <BingFormItem prop="name" label="项目名称" required>
      <BingInput :model-value="model.name" @update:model-value="model.name = String($event)" placeholder="例如：组件文档站" block />
    </BingFormItem>
    <BingFormItem prop="role" label="负责方向" required>
      <BingSelect v-model="model.role" :options="roleOptions" placeholder="选择方向" block />
    </BingFormItem>
    <BingFormItem prop="channels" label="通知渠道" :span="{ sm: 2, xl: 2 }" required>
      <BingCheckboxGroup v-model="model.channels" :options="channelOptions" />
    </BingFormItem>
    <BingFormItem prop="density" label="表单密度">
      <BingRadioGroup v-model="model.density" :options="densityOptions" direction="row" />
    </BingFormItem>
    <BingFormItem prop="description" label="说明" :span="{ sm: 2, xl: 3 }" help="最多 120 个字符">
      <BingTextarea v-model="model.description" autosize :max-length="120" />
    </BingFormItem>
    <BingFormItem :span="{ sm: 2, xl: 3 }">
      <BingButton html-type="submit" :throttle="false">提交</BingButton>
      <BingButton :throttle="false" @click="formRef?.clearValidate()">清空校验</BingButton>
    </BingFormItem>
  </BingForm>
  <p role="status">{{ result }}</p>
</template>
```

## 表单方法

通过 ref 可以主动触发表单校验、单字段校验、清空错误和重置字段。`validateField` 会保留其他字段的错误，只替换当前字段相关的错误。

这个示例里邮箱字段包含异步 refinement，Form 内部统一使用 `safeParseAsync`，所以同步和异步 Zod 规则可以混合使用。示例使用 `['manual']`，通过按钮主动调用校验方法；异步规则在本地模拟邮箱占用检查，没有请求远程接口。

`clearValidate()` 只清除错误，不修改字段值；`resetFields()` 将字段恢复到表单挂载时的初始快照，并清除错误，不等于把所有字段清空。方法示例重置后邮箱为 `taken@example.com`、昵称为 `Bo`。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormSchema } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const formRef = ref<BingFormExpose | null>(null)
const result = ref('等待方法调用')
const model = reactive({ email: 'taken@example.com', nickname: 'Bo' })
const schema = z.object({
  email: z.string().email('邮箱格式不正确').refine(
    async (value) => value !== 'taken@example.com',
    { message: '这个邮箱已经被占用' },
  ),
  nickname: z.string().min(3, '昵称至少需要 3 个字符'),
}) satisfies BingFormSchema

async function validateAll() {
  const valid = await formRef.value?.validate()
  result.value = valid ? '全部字段校验通过' : '表单中仍有错误'
}

async function validateEmail() {
  const valid = await formRef.value?.validateField('email')
  result.value = valid ? '邮箱校验通过' : '邮箱校验未通过'
}

function clearErrors() {
  formRef.value?.clearValidate()
  result.value = '已清空错误'
}

function resetFields() {
  formRef.value?.resetFields()
  result.value = '已恢复初始值'
}

function readErrors() {
  result.value = JSON.stringify(formRef.value?.getErrors() ?? {})
}
</script>

<template>
  <BingForm
    ref="formRef"
    :model="model"
    :schema="schema"
    layout="stack"
    label-position="left"
    label-width="86px"
    :validate-trigger="['manual']"
  >
    <BingFormItem prop="email" label="邮箱" required>
      <BingInput :model-value="model.email" @update:model-value="model.email = String($event)" block />
    </BingFormItem>
    <BingFormItem prop="nickname" label="昵称" required>
      <BingInput :model-value="model.nickname" @update:model-value="model.nickname = String($event)" block />
    </BingFormItem>
  </BingForm>
  <BingButton :throttle="false" @click="validateAll">校验全部</BingButton>
  <BingButton :throttle="false" @click="validateEmail">校验邮箱</BingButton>
  <BingButton :throttle="false" @click="clearErrors">清空错误</BingButton>
  <BingButton :throttle="false" @click="resetFields">重置字段</BingButton>
  <BingButton :throttle="false" @click="readErrors">读取错误</BingButton>
  <p role="status">{{ result }}</p>
</template>
```

## 自动校验与键盘提示

此示例省略 `validateTrigger` 和 `focusOnError`，直接使用新版默认行为。先输入一个字符再按 Tab，可观察首次失焦报错；继续补全时错误自动消失。提交失败会定位首个错误字段。

实验性 `nextStepHint` 默认关闭，勾选后提示实际下一个 Tab 落点；它不会跳过浏览器的正常焦点顺序，也不代表字段已校验通过。焦点离开表单、表单禁用或关闭开关时提示消失；本例校验通过后主动关闭提示。含清除按钮、弹层或自定义控件时，下一落点可能仍在当前字段内，此时不显示跨字段提示。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingCheckbox, BingForm, BingFormItem, BingInput } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const formRef = ref<BingFormExpose | null>(null)
const model = reactive({ name: '', email: '' })
const nextStepHint = ref(false)
const result = ref('首次输入不报错，离开字段后检查')
const schema = z.object({
  name: z.string().min(2, '姓名至少 2 个字符'),
  email: z.string().email('请输入有效邮箱'),
})
function submit(payload: BingFormSubmitPayload) {
  if (!payload.valid) { result.value = '校验失败，请完成表单'; return }
  nextStepHint.value = false
  result.value = '校验通过，可执行保存'
}
</script>

<template>
  <BingCheckbox v-model="nextStepHint" label="显示下一项提示（实验性）" />
  <!-- 使用默认 auto 校验、focusOnError=true；提示只辅助观察，不改变 Tab 顺序。 -->
  <BingForm ref="formRef" :model="model" :schema="schema" layout="stack" :next-step-hint="nextStepHint" @submit="submit">
    <BingFormItem prop="name" label="姓名" required>
      <BingInput :model-value="model.name" @update:model-value="model.name = String($event)" :clearable="false" block />
    </BingFormItem>
    <BingFormItem prop="email" label="邮箱" required>
      <BingInput :model-value="model.email" @update:model-value="model.email = String($event)" type="email" :clearable="false" block />
    </BingFormItem>
    <BingButton html-type="submit">保存资料</BingButton>
  </BingForm>
  <BingButton variant="secondary" @click="formRef?.clearValidate()">清除校验状态</BingButton>
  <p role="status">{{ result }}</p>
</template>

<style scoped>
.bing-form { margin-block: 12px; }
</style>
```

## 属性

| 属性                | 类型                                                                          | 默认值                                    | 说明                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `model`           | `Record<string, unknown>`                                                   | `undefined`                            | 表单数据对象；resetFields 会回到挂载时的快照。                                                                                              |
| `schema`          | `BingFormSchema`                                                            | `undefined`                            | 提供 safeParseAsync 的校验接口，兼容 Zod schema；0.12.4 起公共类型不再导入可选的 Zod 包。validate 和 submit 通过此接口执行校验。                               |
| `layout`          | `'grid' \| 'stack' \| 'inline'`                                             | `'grid'`                               | 表单布局模式。                                                                                                                    |
| `columns`         | `number \| Partial<Record<BingFormBreakpoint, number>>`                     | `{ base: 1, sm: 2, xl: 5 }`            | grid 布局下的响应式列数；BingFormBreakpoint = 'base' \| 'sm' \| 'md' \| 'lg' \| 'xl'。                                                |
| `gap`             | `string \| number \| { row?: string \| number; column?: string \| number }` | `{ row: 12, column: 16 }`              | 字段之间的行列间距。                                                                                                                 |
| `labelPosition`   | `'top' \| 'left'`                                                           | `'top'`                                | 字段标签位置。                                                                                                                    |
| `labelWidth`      | `string \| number`                                                          | `112`                                  | left 标签模式下的标签宽度。                                                                                                           |
| `size`            | `'sm' \| 'md' \| 'lg'`                                                      | `undefined（继承 ConfigProvider，否则 'md'）` | 向 FormItem 和表单控件传递的尺寸上下文；优先于 ConfigProvider。0.12.0 起未传时不再预填 md。                                                            |
| `disabled`        | `boolean`                                                                   | `false`                                | 下发表单禁用上下文，同时阻止表单 submit 回调；控件显式传入 false 可覆盖继承。                                                                             |
| `validateTrigger` | `BingFormValidateTrigger \| BingFormValidateTrigger[]`                      | `'auto'`                               | BingFormValidateTrigger = 'auto' \| 'change' \| 'blur' \| 'submit' \| 'manual'；auto 在失焦和提交时校验，有错误的字段在修改时复查；manual 仅主动调用方法。 |
| `scrollToError`   | `boolean`                                                                   | `true`                                 | validate() 或提交失败时滚动到首个可用错误字段，与聚焦开关独立。                                                                                      |
| `focusOnError`    | `boolean`                                                                   | `true`                                 | 提交失败后聚焦首个可用错误字段；异步等待期间继续编辑或改变焦点时不抢焦点，validate() 本身不主动聚焦。                                                                   |
| `nextStepHint`    | `boolean`                                                                   | `false`                                | 实验性：提示实际下一个 Tab 落点，不改变键盘顺序；失焦或禁用时隐藏，业务保存成功后可关闭。                                                                            |

## 事件与方法

### 事件

| 事件        | 参数                                                                         | 说明                                                                                     |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `submit`  | `{ valid: boolean; errors: Record<string, string[]>; event: SubmitEvent }` | 校验失败也会触发，业务保存前必须检查 valid；如果 validateTrigger 不包含 auto 或 submit，则不执行提交校验，valid 直接为 true。 |
| `invalid` | `{ valid: boolean; errors: Record<string, string[]> }`                     | 提交校验失败时，在 submit 之后触发。                                                                 |

### 暴露方法

| 方法                     | 返回值                | 说明                                                                         |
| ---------------------- | ------------------ | -------------------------------------------------------------------------- |
| `validate()`           | `Promise<boolean>` | 校验整个表单，并更新所有字段错误。                                                          |
| `validateField(prop)`  | `Promise<boolean>` | 执行 schema 校验，只更新 prop 路径相关的错误，保留其他字段错误。                                    |
| `clearValidate(prop?)` | `void`             | 清空全部错误，或只清空某个字段相关错误。                                                       |
| `resetFields()`        | `void`             | 把 model 重置为表单挂载时的快照，并清空校验。                                                 |
| `getErrors()`          | `BingFormErrors`   | 返回当前错误对象的拷贝；BingFormErrors = Record\<string, string\[\]\>，键为字段路径，值为错误消息数组。 |
