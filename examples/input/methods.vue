<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput, type BingInputExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const inputRef = ref<BingInputExpose | null>(null)
const value = ref<string | number | null>('可以通过 ref 控制')
const selection = ref('未选择')
function selectText() {
  inputRef.value?.select()
  const element = inputRef.value?.input
  selection.value = element ? element.value.slice(element.selectionStart ?? 0, element.selectionEnd ?? 0) : '未选择'
}
</script>

<template>
  <BingInput ref="inputRef" v-model="value" block ariaLabel="实例方法输入" />
  <div style="display: flex; gap: 12px; margin-top: 12px">
    <BingButton size="sm" @click="inputRef?.focus()">focus</BingButton>
    <BingButton size="sm" @click="inputRef?.blur()">blur</BingButton>
    <BingButton size="sm" @click="selectText">select</BingButton>
  </div>
  <p role="status">选中文本：{{ selection }}</p>
</template>
