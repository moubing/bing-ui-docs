<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type RuleOptions = Pick<BingDatePickerProps, 'min' | 'max'>
// @docs-options:start
const options: RuleOptions = { "min": "2026-07-01", "max": "2026-07-31" }
// @docs-options:end
const date = ref<BingDatePickerModelValue>('2026-07-08')
const time = ref<BingDatePickerModelValue>('09:30:00')
const disabledDate: NonNullable<BingDatePickerProps['disabledDate']> = value => value.day() === 0 || value.day() === 6
const disabledTime: NonNullable<BingDatePickerProps['disabledTime']> = (_value, context) => context.unit === 'hour' && (context.value < 9 || context.value > 18)

</script>

<template>
  <div class="stack">
    <BingDatePicker id="date-picker-rule-date" v-model="date" v-bind="options" type="date" :disabledDate="disabledDate" :showShortcuts="false" block ariaLabel="工作日日期" />
    <BingDatePicker id="date-picker-rule-time" v-model="time" type="time" min="09:00:00" max="18:00:00" :minuteStep="15" :secondStep="30" :disabledTime="disabledTime" :showShortcuts="false" block ariaLabel="营业时间" />
  </div>
  <p class="feedback" role="status">日期：{{ JSON.stringify(date) }}；时间：{{ JSON.stringify(time) }}</p>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
