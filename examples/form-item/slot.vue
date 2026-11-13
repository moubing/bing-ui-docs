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
