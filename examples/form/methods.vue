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
