<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const date = ref<BingDatePickerModelValue>(["2026-07-01","2026-07-15"])
const datetime = ref<BingDatePickerModelValue>(["2026-07-01 09:30:00","2026-07-15 18:00:00"])
const time = ref<BingDatePickerModelValue>(["09:00:00","18:00:00"])
</script>

<template>
  <div class="stack">
    <div><p>date 范围</p><BingDatePicker id="date-picker-ranges-date" v-model="date" type="date" range :showShortcuts="false" block ariaLabel="date范围" /><p>保存值：{{ JSON.stringify(date) }}</p></div>
    <div><p>datetime 范围</p><BingDatePicker id="date-picker-ranges-datetime" v-model="datetime" type="datetime" range :showShortcuts="false" block ariaLabel="datetime范围" /><p>保存值：{{ JSON.stringify(datetime) }}</p></div>
    <div><p>time 范围</p><BingDatePicker id="date-picker-ranges-time" v-model="time" type="time" range :showShortcuts="false" block ariaLabel="time范围" /><p>保存值：{{ JSON.stringify(time) }}</p></div>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
