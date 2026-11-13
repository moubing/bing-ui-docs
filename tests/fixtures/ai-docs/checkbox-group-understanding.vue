<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const channels = ref<BingCheckboxGroupValue[]>(['email'])
const content = ref<BingCheckboxGroupValue[]>(['docs'])
const disabled = ref(false)
</script>

<template>
  <BingCheckboxGroup v-model="channels" ariaLabel="通知渠道" :disabled="disabled">
    <BingCheckbox value="email" label="邮件" :disabled="false" />
    <BingCheckbox value="sms" label="短信" disabled />
  </BingCheckboxGroup>
  <BingCheckboxGroup v-model="content" ariaLabel="订阅内容" :options="[
    { value: 'docs', label: '文档更新', description: '订阅组件文档和使用示例的更新，较长说明应正常换行' },
    { value: 'release', label: '版本发布' },
  ]" />
  <BingButton @click="disabled = !disabled">切换整组禁用</BingButton>
  <p role="status">渠道：{{ channels.join(',') }}；内容：{{ content.join(',') }}</p>
</template>
