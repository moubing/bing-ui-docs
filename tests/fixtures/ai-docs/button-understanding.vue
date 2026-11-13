<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingForm } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const submits = ref(0)
const resets = ref(0)
const actions = ref(0)
const focusLog = ref('等待焦点')
</script>

<template>
  <form @submit.prevent="submits++" @reset="resets++">
    <BingButton text-effect="none" @click="actions++" @focus="focusLog = 'focus'" @blur="focusLog = 'blur'">
      <template #prefix><span aria-hidden="true">＋</span></template>
      添加条目
      <template #suffix><span aria-hidden="true">→</span></template>
    </BingButton>
    <BingButton html-type="submit" :throttle="false">提交表单</BingButton>
    <BingButton html-type="reset" variant="ghost">重置表单</BingButton>
    <BingButton loading text-effect="none" html-type="submit">正在保存</BingButton>
    <BingButton loading ariaLabel="正在加载设置"><template #prefix><span aria-hidden="true">⚙</span></template></BingButton>
    <BingButton ariaLabel="打开设置" :throttle="false" @click="actions++">
      <template #prefix><span aria-hidden="true">⚙</span></template>
    </BingButton>
  </form>
  <BingForm :model="{}" size="sm" disabled>
    <BingButton>继承表单状态</BingButton>
    <BingButton :disabled="false" size="lg">覆盖表单状态</BingButton>
  </BingForm>
  <p role="status">提交：{{ submits }}；重置：{{ resets }}；普通操作：{{ actions }}；焦点：{{ focusLog }}</p>
</template>
