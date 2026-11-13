<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const longCode = Array.from({ length: 26 }, (_, index) => {
  const line = index + 1

  return `const metric${line.toString().padStart(2, '0')} = collectComponentSignal(source[${index}], { animated: true, density: 'compact' })`
}).join('\n')
</script>

<template>
  <div class="code-preview">
    <BingCodeBlock :code="longCode" language="ts" title="resizable-code.ts" resizable :highlight-lines="[4, [10, 13]]" :resizable-options="{
      defaultSize: { width: 720, height: 360 }, minWidth: 280, minHeight: 260,
      maxWidth: 920, maxHeight: 460, directions: ['right', 'bottom', 'bottom-right'],
      showSize: true, ariaLabel: '可调整尺寸的代码示例',
    }" />
  </div>
</template>

<style scoped>
.code-preview { max-width: 100%; overflow: auto; padding: 12px; }
</style>
