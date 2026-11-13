<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput, BingSelect, BingTextarea } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormResponsiveNumber, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type SpanOptions = { titleSpan: BingFormResponsiveNumber; notesSpan: BingFormResponsiveNumber }

// @docs-options:start
const options: SpanOptions = {
  "titleSpan": 1,
  "notesSpan": { "sm": 2, "xl": 3 }
}
// @docs-options:end

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
