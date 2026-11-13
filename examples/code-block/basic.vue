<script setup lang="ts">
import { ref } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'
import type { BingCodeBlockProps, BingCodeBlockCopyPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// code 是要展示的文本，不会作为组件执行。
// @docs-options:start
const options: BingCodeBlockProps = {
  "code": "\u003cscript setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst visible = ref(false)\n\nfunction openDialog() {\n  visible.value = true\n}\n\u003c/script>\n\n\u003ctemplate>\n  \u003cBingButton @click=\"openDialog\">打开弹窗\u003c/BingButton>\n  \u003cBingDialog v-model=\"visible\" title=\"发布确认\">\n    当前文档会进入公开状态。\n  \u003c/BingDialog>\n\u003c/template>",
  "language": "vue",
  "theme": "auto",
  "title": "usage.vue",
  "languageLabel": "Vue",
  "lineNumbers": true,
  "copyable": true,
  "wrap": false,
  "maxHeight": "360px",
  "highlightLines": [
    [
      8,
      12
    ]
  ]
}
// @docs-options:end
const copyLog = ref('等待复制')
const highlightLog = ref('高亮状态正常')
function handleCopy(payload: BingCodeBlockCopyPayload) { copyLog.value = `已复制 ${payload.language}，共 ${payload.code.length} 个字符` }
function handleCopyError(error: Error) { copyLog.value = '复制失败：' + error.message }
function handleHighlightError(error: Error) { highlightLog.value = '高亮失败，已回退纯文本：' + error.message }
</script>

<template>
  <BingCodeBlock v-bind="options" @copy="handleCopy" @copy-error="handleCopyError" @highlight-error="handleHighlightError" />
  <p role="status">{{ copyLog }}；{{ highlightLog }}</p>
</template>
