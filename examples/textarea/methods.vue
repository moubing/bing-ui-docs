<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTextarea } from '@moubing/bing-ui'
import type { BingTextareaExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const textareaRef = ref<BingTextareaExpose | null>(null)
const note = ref('可以通过 ref 调用 focus、blur、select。')
const selectedText = ref('未选择')
function selectText() {
  textareaRef.value?.select()
  const element = textareaRef.value?.textarea
  selectedText.value = element ? element.value.slice(element.selectionStart, element.selectionEnd) : '未选择'
}
</script>

<template>
  <BingTextarea ref="textareaRef" v-model="note" block ariaLabel="实例方法示例" />
  <div class="actions">
    <BingButton size="sm" variant="secondary" @click="textareaRef?.focus()">focus</BingButton>
    <BingButton size="sm" variant="ghost" @click="textareaRef?.blur()">blur</BingButton>
    <BingButton size="sm" variant="ghost" @click="selectText">select</BingButton>
  </div>
  <p role="status">选中文本：{{ selectedText }}</p>
</template>

<style scoped>
.actions { display: flex; gap: 12px; margin-top: 12px; }
</style>
