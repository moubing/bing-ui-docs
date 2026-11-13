<script setup lang="ts">
// 根据生成的 Form 文档编写的新用例：角色多选至少一项，失败时不执行保存。
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingCheckboxGroup, BingForm, BingFormItem } from '@moubing/bing-ui'
import type { BingCheckboxGroupValue, BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const model = reactive({ roles: [] as BingCheckboxGroupValue[] })
const schema = z.object({ roles: z.array(z.string()).min(1, '至少选择一个角色') })
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
]
const saveCount = ref(0)
const result = ref('尚未保存')

function submit(payload: BingFormSubmitPayload) {
  if (!payload.valid) {
    result.value = '校验失败，未保存'
    return
  }
  // 本地模拟业务保存，用计数确认失败提交没有进入这个分支。
  saveCount.value += 1
  result.value = '已保存：' + JSON.stringify(model.roles)
}
</script>

<template>
  <BingForm :model="model" :schema="schema" layout="stack" @submit="submit">
    <BingFormItem prop="roles" label="角色" required>
      <BingCheckboxGroup v-model="model.roles" :options="roleOptions" />
    </BingFormItem>
    <BingButton html-type="submit" :throttle="false">保存角色</BingButton>
  </BingForm>
  <p role="status">{{ result }}</p>
  <p>已保存次数：<span id="save-count">{{ saveCount }}</span></p>
</template>
