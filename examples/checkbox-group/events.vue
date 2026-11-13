<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckboxGroup } from '@moubing/bing-ui'
import type { BingCheckboxGroupOption, BingCheckboxGroupValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingCheckboxGroupOption[] = [
  { label: '站内提醒', value: 'inbox' },
  { label: '邮件', value: 'email' },
  { label: 'Webhook', value: 'webhook' },
]
const channels = ref<BingCheckboxGroupValue[]>(['email'])
const eventLog = ref('等待操作')
const focusCount = ref(0)
const blurCount = ref(0)
function handleChange(value: BingCheckboxGroupValue[], event: Event) {
  eventLog.value = `change：${value.join('、')}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { focusCount.value += 1 }
function handleBlur(_event: FocusEvent) { blurCount.value += 1 }
</script>

<template>
  <BingCheckboxGroup id="checkbox-doc-12" name="checkbox-doc-12"
    v-model="channels" :options="items" direction="column" status="success" ariaLabel="通知渠道"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">{{ eventLog }}</p>
  <p>进入组：{{ focusCount }}；离开组：{{ blurCount }}</p>
  <BingButton>组外按钮</BingButton>
</template>
