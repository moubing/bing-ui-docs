<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingRadio } from '@moubing/bing-ui'
import type { BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const selected = ref<BingRadioValue | null>('none')
const eventLog = ref('等待操作')
function handleChange(value: BingRadioValue, event: Event) {
  eventLog.value = `change：已选中 ${String(value)}；原始事件：${event.type}`
}
function handleFocus() { eventLog.value = 'focus：获得焦点' }
function handleBlur() { eventLog.value = 'blur：失去焦点' }
function reset() {
  // 改为不匹配 value 的值即可取消选中，也可以设为 null。
  selected.value = 'none'
  eventLog.value = '已重置'
}
</script>

<template>
  <BingRadio id="radio-email" v-model="selected" name="radio-email" value="email" label="邮件通知" description="点击后写入 email。" @change="handleChange" @focus="handleFocus" @blur="handleBlur" />
  <BingButton size="sm" variant="ghost" @click="reset">重置</BingButton>
  <p role="status">当前值：{{ selected }}；{{ eventLog }}</p>
</template>
