<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingInputValue>('')
</script>
<template>
  <div style="display: grid; gap: 16px; min-width: 0">
    <div class="button-flex-demo"><BingInput v-model="value" block ariaLabel="并排搜索" placeholder="输入内容" /><BingButton>搜索</BingButton></div>
    <div class="button-flex-demo"><BingButton class="button-flex-demo__shrink">允许主动收缩的一段很长的操作文字</BingButton><BingButton variant="secondary">取消</BingButton></div>
    <p>按钮默认 flex-shrink: 0；输入侧 min-width: 0。确需收缩的按钮显式设置 flex-shrink: 1 和 min-width: 0，长文显示省略号。</p>
  </div>
</template>
<style scoped>
.button-flex-demo { display: flex; gap: 8px; min-width: 0; max-width: 320px; }
.button-flex-demo :deep(.bing-input) { flex: 1; min-width: 0; }
.button-flex-demo__shrink { flex-shrink: 1; min-width: 0; }
</style>
