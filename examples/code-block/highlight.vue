<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { BingCodeBlock, BingSelect } from '@moubing/bing-ui'
import type { BingCodeBlockHighlightLine, BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const longCode = Array.from({ length: 26 }, (_, index) => {
  const line = index + 1

  return `const metric${line.toString().padStart(2, '0')} = collectComponentSignal(source[${index}], { animated: true, density: 'compact' })`
}).join('\n')
const singleLines = ref<number[]>([6])
const rangeStart = ref(12)
const rangeEnd = ref(16)
const lineOptions = Array.from({ length: 26 }, (_, index) => ({ label: '第 ' + (index + 1) + ' 行', value: index + 1 }))
const rangeEndOptions = computed(() => lineOptions.filter(option => option.value >= rangeStart.value))
const highlightedLines = computed<BingCodeBlockHighlightLine[]>(() => [...singleLines.value, [rangeStart.value, rangeEnd.value]])
watch(rangeStart, start => { if (rangeEnd.value < start) rangeEnd.value = start })
// Select 的事件类型包含单值、数组和 null；先收窄再写入行号状态。
function updateSingleLines(value: BingSelectModelValue) {
  singleLines.value = Array.isArray(value) ? value.filter((item): item is number => typeof item === 'number') : []
}
function updateRangeStart(value: BingSelectModelValue) { if (typeof value === 'number') rangeStart.value = value }
function updateRangeEnd(value: BingSelectModelValue) { if (typeof value === 'number') rangeEnd.value = value }
</script>

<template>
  <div class="highlight-controls">
    <BingSelect :model-value="singleLines" :options="lineOptions" multiple block searchable clearable :show-select-all="false" :panel-max-height="300" placeholder="选择单独高亮的行" ariaLabel="选择单独高亮的代码行" @update:model-value="updateSingleLines" />
    <BingSelect :model-value="rangeStart" :options="lineOptions" block searchable :clearable="false" :panel-max-height="300" placeholder="起始行" ariaLabel="选择闭区间起始行" @update:model-value="updateRangeStart" />
    <BingSelect :model-value="rangeEnd" :options="rangeEndOptions" block searchable :clearable="false" :panel-max-height="300" placeholder="结束行" ariaLabel="选择闭区间结束行" @update:model-value="updateRangeEnd" />
  </div>
  <BingCodeBlock :code="longCode" language="ts" title="metrics.ts" language-label="TypeScript" :highlight-lines="highlightedLines" :max-height="280" />
  <p role="status">高亮：{{ JSON.stringify(highlightedLines) }}</p>
</template>

<style scoped>
.highlight-controls { display: grid; gap: 12px; margin-bottom: 16px; }
</style>
