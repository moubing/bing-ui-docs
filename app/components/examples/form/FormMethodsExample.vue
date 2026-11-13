<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'
import methodsSource from '~~/examples/form/methods.vue?raw'
import { BingButton, BingCodeBlock, BingForm, BingFormItem, BingInput } from '@moubing/bing-ui'
import type { BingFormErrors, BingFormExpose } from '@moubing/bing-ui'

const methodFormRef = ref<BingFormExpose | null>(null)
const methodLog = ref('等待方法调用')

const methodModel = reactive({
  email: 'taken@example.com',
  nickname: 'Bo',
})

const methodSchema = z.object({
  email: z
    .string()
    .email('邮箱格式不正确')
    .refine(async (value) => value !== 'taken@example.com', {
      message: '这个邮箱已经被占用',
    }),
  nickname: z.string().min(3, '昵称至少需要 3 个字符'),
})

const methodsCode = methodsSource.replaceAll('\r\n', '\n').trim()

async function validateAll() {
  const valid = await methodFormRef.value?.validate()
  methodLog.value = valid ? 'validate()：通过' : `validate()：${formatErrorCount(methodFormRef.value?.getErrors() ?? {})}`
}

async function validateEmail() {
  const valid = await methodFormRef.value?.validateField('email')
  methodLog.value = valid ? 'validateField(email)：通过' : 'validateField(email)：未通过'
}

function clearErrors() {
  methodFormRef.value?.clearValidate()
  methodLog.value = 'clearValidate()：已清空错误'
}

function resetMethodForm() {
  methodFormRef.value?.resetFields()
  methodLog.value = 'resetFields()：已恢复初始值'
}

function readErrors() {
  methodLog.value = `getErrors()：${JSON.stringify(methodFormRef.value?.getErrors() ?? {})}`
}

function formatErrorCount(errors: BingFormErrors) {
  const count = Object.values(errors).reduce((total, messages) => total + messages.length, 0)

  return `${count} 条错误`
}
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview form-demo-panel">
      <ClientOnly>
        <BingForm
          ref="methodFormRef"
          :model="methodModel"
          :schema="methodSchema"
          layout="stack"
          label-position="left"
          label-width="86px"
          :validate-trigger="['manual']"
        >
          <BingFormItem prop="email" label="邮箱" required>
            <BingInput v-model="methodModel.email" block />
          </BingFormItem>
          <BingFormItem prop="nickname" label="昵称" required>
            <BingInput v-model="methodModel.nickname" block />
          </BingFormItem>
        </BingForm>
      </ClientOnly>

      <div class="form-demo-actions">
        <BingButton variant="primary" :throttle="false" @click="validateAll">
          校验全部
        </BingButton>
        <BingButton variant="secondary" :throttle="false" @click="validateEmail">
          校验邮箱
        </BingButton>
        <BingButton variant="secondary" :throttle="false" @click="clearErrors">
          清空错误
        </BingButton>
        <BingButton variant="secondary" :throttle="false" @click="resetMethodForm">
          重置字段
        </BingButton>
        <BingButton variant="ghost" :throttle="false" @click="readErrors">
          读取错误
        </BingButton>
      </div>

      <p class="form-demo-feedback">
        <span>{{ methodLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <slot />
    </div>
  </div>

  <BingCodeBlock :code="methodsCode" language="vue" title="代码示例" wrap />
</template>
