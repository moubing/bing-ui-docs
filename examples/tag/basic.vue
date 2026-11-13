<script setup lang="ts">
import { ref } from 'vue'
import { BingTag } from '@moubing/bing-ui'
import type { BingTagProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingTagProps = {
  "label": "Aurora",
  "size": "md",
  "tone": "primary",
  "variant": "glass",
  "closable": true,
  "disabled": false
}
// @docs-options:end
const closeCount = ref(0)
function handleClose(_event: MouseEvent) { closeCount.value += 1 }
</script>

<template>
  <!-- close 只通知业务；本例只计数，所以标签仍然显示。 -->
  <BingTag v-bind="options" @close="handleClose" />
  <p role="status">关闭事件：{{ closeCount }}</p>
</template>
