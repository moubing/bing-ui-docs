<script setup lang="ts">
import { ref } from 'vue'
import { BingDatePicker, type BingDatePickerModelValue, type BingDatePickerProps, type BingDatePickerType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const date = ref<BingDatePickerModelValue>("2026/07/01")
const datetime = ref<BingDatePickerModelValue>("2026-07-01 09:30:00")
const month = ref<BingDatePickerModelValue>("2026-07")
const year = ref<BingDatePickerModelValue>("2026")
const time = ref<BingDatePickerModelValue>("09:30:00")
</script>

<template>
  <div class="stack">
    <div><p>date 单值</p><BingDatePicker id="date-picker-singles-date" v-model="date" type="date" valueFormat="YYYY/MM/DD" format="YYYY年MM月DD日" :showShortcuts="false" block ariaLabel="date单值" /><p>保存值：{{ JSON.stringify(date) }}</p></div>
    <div><p>datetime 单值</p><BingDatePicker id="date-picker-singles-datetime" v-model="datetime" type="datetime"  :showShortcuts="false" block ariaLabel="datetime单值" /><p>保存值：{{ JSON.stringify(datetime) }}</p></div>
    <div><p>month 单值</p><BingDatePicker id="date-picker-singles-month" v-model="month" type="month"  :showShortcuts="false" block ariaLabel="month单值" /><p>保存值：{{ JSON.stringify(month) }}</p></div>
    <div><p>year 单值</p><BingDatePicker id="date-picker-singles-year" v-model="year" type="year"  :showShortcuts="false" block ariaLabel="year单值" /><p>保存值：{{ JSON.stringify(year) }}</p></div>
    <div><p>time 单值</p><BingDatePicker id="date-picker-singles-time" v-model="time" type="time"  :showShortcuts="false" block ariaLabel="time单值" /><p>保存值：{{ JSON.stringify(time) }}</p></div>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 20px; max-width: 100%; }
.stack :deep(.bing-date-picker) { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.feedback { overflow-wrap: anywhere; }
</style>
