<script setup lang="ts">
import { BingCodeBlock, BingDatePicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, rangeValues, rangeCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked"><div class="doc-example__preview date-picker-demo-stage"><div><p>date 范围</p><BingDatePicker id="date-picker-ranges-date" v-model="rangeValues.date" type="date" range :showShortcuts="false" block ariaLabel="date范围" /><p>保存值：{{ JSON.stringify(rangeValues.date) }}</p></div>
  <div><p>datetime 范围</p><BingDatePicker id="date-picker-ranges-datetime" v-model="rangeValues.datetime" type="datetime" range :showShortcuts="false" block ariaLabel="datetime范围" /><p>保存值：{{ JSON.stringify(rangeValues.datetime) }}</p></div>
  <div><p>time 范围</p><BingDatePicker id="date-picker-ranges-time" v-model="rangeValues.time" type="time" range :showShortcuts="false" block ariaLabel="time范围" /><p>保存值：{{ JSON.stringify(rangeValues.time) }}</p></div></div></div>

  </ClientOnly>

  <BingCodeBlock
      :code="rangeCode"
      language="vue"
      title="范围类型"
      max-height="320px"
    />
</template>
