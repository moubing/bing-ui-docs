<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, BingButton, type BingDatePickerExpose, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const picker = ref<BingDatePickerExpose | null>(null)
const value = ref<BingDatePickerModelValue>('2026-07-01')
const feedback = ref('等待操作')
function open() { picker.value?.openPanel(); feedback.value = '已调用 openPanel()' }
function focus() { picker.value?.focus(); feedback.value = '已调用 focus()' }
function clear() { picker.value?.closePanel(); picker.value?.clear(); feedback.value = '已调用 clear()' }
</script>

<template>
  <BingDatePicker id="date-picker-methods" ref="picker" v-model="value" block ariaLabel="方法日期" />
  <div class="actions">
    <BingButton :throttle="false" variant="secondary" @click="open">打开面板</BingButton>
    <BingButton :throttle="false" variant="ghost" @click="focus">聚焦触发器</BingButton>
    <BingButton :throttle="false" variant="danger" @click="clear">清空</BingButton>
  </div>
  <p role="status">当前值：{{ JSON.stringify(value) }}；{{ feedback }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
