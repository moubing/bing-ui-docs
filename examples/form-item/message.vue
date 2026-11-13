<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput, BingSelect } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormProps, BingFormItemProps, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type MessageOptions = Pick<BingFormProps, 'labelPosition' | 'labelWidth' | 'disabled'>
  & Pick<BingFormItemProps, 'required' | 'showMessage'>

// @docs-options:start
const options: MessageOptions = {
  "labelPosition": "left",
  "labelWidth": "104px",
  "required": true,
  "showMessage": true,
  "disabled": false
}
// @docs-options:end

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
