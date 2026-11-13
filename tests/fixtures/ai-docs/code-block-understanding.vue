<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import type { BingCodeBlockCopyPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const code = "const value = '<tag>'\nconsole.log(value)\n"
const language = ref('not-a-language')
const highlightError = ref(false)
const copied = ref('尚未复制')
function onCopy(payload: BingCodeBlockCopyPayload) { copied.value = `${payload.language}:${payload.code === code}` }
</script>

<template>
  <BingCodeBlock :code="code" :language="language" theme="vitesse-light" :highlight-lines="[0, -2, 1.5, 2, [3, 2], [1, 1], 99]" @highlight-error="highlightError = true" @copy="onCopy" />
  <BingButton @click="language = 'ts'">启用已知语言</BingButton>
  <p role="status">发生过高亮错误：{{ highlightError }}；复制：{{ copied }}</p>
</template>
