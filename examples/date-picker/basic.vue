<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerChangePayload, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
// @docs-options:start
const options: BingDatePickerProps = { "type": "date", "range": false, "size": "md", "status": "default", "placeholder": "选择日期", "clearable": true, "showShortcuts": true, "block": true, "disabled": false, "locale": "zh-CN" }
// @docs-options:end
function createSampleValue(type: BingDatePickerType, range: boolean): BingDatePickerModelValue {
  const singleMap: Record<BingDatePickerType, string> = {
    date: '2026-07-01',
    datetime: '2026-07-01 09:30:00',
    month: '2026-07',
    year: '2026',
    time: '09:30:00',
  }

  const rangeMap: Record<BingDatePickerType, [string, string]> = {
    date: ['2026-07-01', '2026-07-15'],
    datetime: ['2026-07-01 09:30:00', '2026-07-15 18:00:00'],
    month: ['2026-07', '2026-09'],
    year: ['2026', '2028'],
    time: ['09:00:00', '18:00:00'],
  }

  return range ? rangeMap[type] : singleMap[type]
}
const value = ref<BingDatePickerModelValue>(createSampleValue(options.type ?? 'date', options.range ?? false))
const feedback = ref('等待选择')
function changed(payload: BingDatePickerChangePayload) { feedback.value = 'change：' + JSON.stringify(payload.value) }
function confirmed(payload: BingDatePickerChangePayload) { feedback.value = 'confirm：' + JSON.stringify(payload.value) }
</script>

<template>
  <BingDatePicker id="date-picker-basic" :key="JSON.stringify([options.type, options.range, options.disabled])" v-model="value" v-bind="options" startPlaceholder="开始" endPlaceholder="结束" ariaLabel="选择日期值" @change="changed" @confirm="confirmed" />
  <p class="feedback" role="status">当前值：{{ JSON.stringify(value) }}；{{ feedback }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
