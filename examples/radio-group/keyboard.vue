<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadioGroup } from '@moubing/bing-ui'
import type { BingRadioGroupOption, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingRadioGroupOption[] = [
  { label: '第一步', value: 'step-1', description: '确认基础信息。' },
  { label: '第二步', value: 'step-2', description: '此项禁用，会被方向键跳过。', disabled: true },
  { label: '第三步', value: 'step-3', description: '检查文档示例。' },
]
const step = ref<BingRadioValue | null>('step-1')
const eventLog = ref('等待操作')
const focusCount = ref(0)
const blurCount = ref(0)
function handleChange(value: BingRadioValue, event: Event) {
  eventLog.value = `change：${String(value)}；原始事件：${event.type}`
}
function handleFocus(_event: FocusEvent) { focusCount.value += 1 }
function handleBlur(_event: FocusEvent) { blurCount.value += 1 }
</script>

<template>
  <BingRadioGroup
    v-model="step" :options="items" direction="column"
    id="doc-steps" name="doc-steps" ariaLabel="文档步骤"
    @change="handleChange" @focus="handleFocus" @blur="handleBlur"
  />
  <p role="status">当前值：{{ step }}；{{ eventLog }}</p>
  <p>进入组：{{ focusCount }}；离开组：{{ blurCount }}</p>
  <BingButton>组外按钮</BingButton>
</template>
