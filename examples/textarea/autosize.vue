<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const fixed = ref('固定行数 textarea\n适合高度稳定的备注框。')
const auto = ref('自动高度 textarea\n继续输入更多行时会自动增高。\n第三行内容。')
const limited = ref('最多 80 个字符，右下角显示计数。')
</script>

<template>
  <div class="textarea-stack">
    <BingTextarea v-model="fixed" :rows="4" resize="vertical" block ariaLabel="固定高度" />
    <BingTextarea v-model="auto" autosize :rows="3" block ariaLabel="自动增高" />
    <BingTextarea v-model="limited" :autosize="{ minRows: 3, maxRows: 6 }" :max-length="80" show-count block ariaLabel="限制高度与长度" />
  </div>
</template>

<style scoped>
.textarea-stack { display: grid; gap: 16px; max-width: 500px; }
</style>
