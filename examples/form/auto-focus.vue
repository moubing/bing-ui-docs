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
