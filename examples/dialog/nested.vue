<script setup lang="ts">
import { onDeactivated, reactive, ref } from 'vue'
import { z } from 'zod'
import { BingButton, BingDialog, BingForm, BingFormItem, BingInput, BingSelect, type BingFormSubmitPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const open = ref(false)
const confirmOpen = ref(false)
const model = reactive({ name: '', visibility: 'private' })
const feedback = ref('请完成项目名称')
const schema = z.object({ name: z.string().min(2, '项目名称至少 2 个字符'), visibility: z.enum(['private', 'team']) })
const options = [{ label: '仅自己', value: 'private' }, { label: '团队可见', value: 'team' }]
function submit(payload: BingFormSubmitPayload) { feedback.value = payload.valid ? '表单校验通过' : '请修正项目名称' }
onDeactivated(() => { confirmOpen.value = false; open.value = false })
</script>

<template>
  <BingButton @click="open = true">编辑项目设置</BingButton>
  <BingDialog v-model="open" title="项目设置" :show-footer="false">
    <BingForm :model="model" :schema="schema" layout="stack" @submit="submit">
      <BingFormItem prop="name" label="项目名称" required>
        <BingInput :model-value="model.name" @update:model-value="model.name = String($event)" />
      </BingFormItem>
      <BingFormItem prop="visibility" label="可见范围">
        <BingSelect :model-value="model.visibility" @update:model-value="model.visibility = String($event)" :options="options" :clearable="false" ariaLabel="可见范围" />
      </BingFormItem>
      <BingButton html-type="submit">检查表单</BingButton>
    </BingForm>
    <p class="feedback" role="status">{{ feedback }}</p>
    <BingButton variant="secondary" @click="confirmOpen = true">二次确认</BingButton>
    <BingDialog v-model="confirmOpen" title="确认项目范围" close-on-confirm @confirm="feedback = '已确认范围：' + model.visibility">
      <p>这是第二层弹窗，关闭后返回项目设置。</p>
    </BingDialog>
  </BingDialog>
</template>

<style scoped>
.feedback { margin-block: 12px; color: var(--bing-text-secondary); }
</style>
