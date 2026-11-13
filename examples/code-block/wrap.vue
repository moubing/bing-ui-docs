<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const code = "const message = '这是一行刻意写得比较长的代码，用来观察 wrap 打开后是否保留缩进并在容器内自然换行，适合移动端文档或较窄的示例区域。'\n\nexport function previewMessage() {\n  return message.toUpperCase()\n}"
</script>

<template>
  <BingCodeBlock :code="code" language="ts" title="message.ts" :line-numbers="false" :copyable="false" wrap />
</template>
