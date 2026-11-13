<script setup lang="ts">
import { BingCodeBlock, BingDatePicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, singleValues, typeCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked"><div class="doc-example__preview date-picker-demo-stage"><div><p>date 单值</p><BingDatePicker id="date-picker-singles-date" v-model="singleValues.date" type="date" valueFormat="YYYY/MM/DD" format="YYYY年MM月DD日" :showShortcuts="false" block ariaLabel="date单值" /><p>保存值：{{ JSON.stringify(singleValues.date) }}</p></div>
  <div><p>datetime 单值</p><BingDatePicker id="date-picker-singles-datetime" v-model="singleValues.datetime" type="datetime"  :showShortcuts="false" block ariaLabel="datetime单值" /><p>保存值：{{ JSON.stringify(singleValues.datetime) }}</p></div>
  <div><p>month 单值</p><BingDatePicker id="date-picker-singles-month" v-model="singleValues.month" type="month"  :showShortcuts="false" block ariaLabel="month单值" /><p>保存值：{{ JSON.stringify(singleValues.month) }}</p></div>
  <div><p>year 单值</p><BingDatePicker id="date-picker-singles-year" v-model="singleValues.year" type="year"  :showShortcuts="false" block ariaLabel="year单值" /><p>保存值：{{ JSON.stringify(singleValues.year) }}</p></div>
  <div><p>time 单值</p><BingDatePicker id="date-picker-singles-time" v-model="singleValues.time" type="time"  :showShortcuts="false" block ariaLabel="time单值" /><p>保存值：{{ JSON.stringify(singleValues.time) }}</p></div></div></div>

  </ClientOnly>

  <BingCodeBlock
      :code="typeCode"
      language="vue"
      title="单值类型"
      max-height="360px"
    />
</template>
