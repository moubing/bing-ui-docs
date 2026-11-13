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

// @docs-options:start
const options: BingFormProps = {
  "layout": "grid",
  "labelPosition": "top",
  "labelWidth": "112px",
  "size": "md",
  "columns": { "base": 1, "sm": 2, "xl": 3 },
  "gap": { "row": "14px", "column": "18px" },
  "validateTrigger": ["auto"],
  "disabled": false,
  "scrollToError": true,
  "focusOnError": true
}
// @docs-options:end

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
