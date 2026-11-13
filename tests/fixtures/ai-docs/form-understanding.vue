<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem, BingInput } from '@moubing/bing-ui'
import type { BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 独立应用：提交期间继续编辑，异步结果只检查最新模型且不抢焦点。
const model = reactive({ account: '占用账号', note: '' })
const pending = ref(false)
const result = ref('等待提交')
let checked = false
let finish: (() => void) | undefined
const schema = z.object({
  account: z.string().refine(async value => {
    if (!checked) {
      pending.value = true
      await new Promise<void>(resolve => { finish = resolve })
      checked = true
      pending.value = false
    }
    return value !== '占用账号'
  }, '该账号已占用'),
  note: z.string().min(2, '说明至少 2 个字符'),
})
function submit(payload: BingFormSubmitPayload) {
  result.value = payload.valid ? '允许保存' : '校验失败，未保存'
}
</script>

<template>
  <BingForm :model="model" :schema="schema" :validate-trigger="['submit']" :scroll-to-error="false" layout="stack" @submit="submit">
    <BingFormItem prop="account" label="账号"><BingInput :model-value="model.account" @update:model-value="model.account = String($event)" /></BingFormItem>
    <BingFormItem prop="note" label="说明"><BingInput :model-value="model.note" @update:model-value="model.note = String($event)" /></BingFormItem>
    <BingButton html-type="submit">提交检查</BingButton>
  </BingForm>
  <BingButton v-if="pending" @click="finish?.()">完成模拟检查</BingButton>
  <p role="status">{{ result }}</p>
</template>
