<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const noResize = ref('禁止拖拽调整')
const vertical = ref('只允许垂直调整')
const error = ref('撑满父容器并显示错误状态')
</script>

<template>
  <div class="textarea-stack">
    <BingTextarea v-model="noResize" resize="none" ariaLabel="禁止拖拽" />
    <BingTextarea v-model="vertical" resize="vertical" status="success" ariaLabel="垂直调整" />
    <BingTextarea v-model="error" status="error" block ariaLabel="错误状态" />
  </div>
</template>

<style scoped>
.textarea-stack { display: grid; gap: 16px; }
</style>
