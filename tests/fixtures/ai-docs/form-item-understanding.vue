<script setup lang="ts">
// 根据生成的 FormItem 文档新写：嵌套字段 + 原生 textarea + 隐藏消息 + 保存保护。
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingForm, BingFormItem } from '@moubing/bing-ui'
import type { BingFormExpose, BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const formRef = ref<BingFormExpose | null>(null)
const model = reactive({ profile: { note: '' } })
const schema = z.object({ profile: z.object({ note: z.string().min(5, '配送备注至少 5 个字符') }) })
const showMessage = ref(true)
const disabled = ref(false)
const saved = ref(0)
const result = ref('尚未保存')

function descriptionId(field: { ariaDescribedby?: string; 'aria-describedby'?: string }) {
  return field.ariaDescribedby ?? field['aria-describedby']
}

async function validateNote() {
  await formRef.value?.validateField('profile.note')
}

function submit(payload: BingFormSubmitPayload) {
  if (!payload.valid) {
    result.value = '校验失败，未保存'
    return
  }
  saved.value += 1
  result.value = '已保存：' + model.profile.note
}
</script>

<template>
  <BingForm
    ref="formRef" :model="model" :schema="schema" layout="stack" size="sm"
    :disabled="disabled" :validate-trigger="['submit']" @submit="submit"
  >
    <BingFormItem prop="profile.note" label="配送备注" help="请说明配送要求。" :show-message="showMessage" required>
      <template #default="field">
        <textarea
          :id="field.id" v-model="model.profile.note" :disabled="field.disabled"
          :aria-describedby="descriptionId(field)" :aria-invalid="field.invalid"
          :class="['note--' + field.size, 'note--' + field.status]" @blur="validateNote"
        />
      </template>
    </BingFormItem>
    <BingButton html-type="submit" :disabled="disabled" :throttle="false">保存配送备注</BingButton>
  </BingForm>
  <label><input v-model="showMessage" type="checkbox">显示消息</label>
  <label><input v-model="disabled" type="checkbox">禁用备注</label>
  <p role="status">{{ result }}</p>
  <p>保存次数：<span id="save-count">{{ saved }}</span></p>
</template>
