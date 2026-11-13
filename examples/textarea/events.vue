<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const note = ref('试着输入、清除、聚焦或失焦。')
const log = ref('等待操作')
const key = ref('未按键')
function handleInput(value: string, event: Event) { log.value = `input：${value.length} 个字符；原始事件：${event.type}` }
function handleClear() { log.value = 'clear：已清空' }
function handleFocus() { log.value = 'focus：获得焦点' }
function handleBlur() { log.value = 'blur：失去焦点' }
function handleKeydown(event: KeyboardEvent) { key.value = event.key }
</script>

<template>
  <BingTextarea v-model="note" clearable show-count :max-length="100" block ariaLabel="事件示例" @input="handleInput" @clear="handleClear" @focus="handleFocus" @blur="handleBlur" @keydown="handleKeydown" />
  <BingButton variant="ghost">移出焦点</BingButton>
  <p role="status">{{ log }}</p>
  <p>最近按键：{{ key }}</p>
</template>
