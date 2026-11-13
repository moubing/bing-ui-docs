<script setup lang="ts">
import { ref } from 'vue'
import { BingTextarea } from '@moubing/bing-ui'
import type { BingTextareaProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingTextareaProps = {
  "placeholder": "请输入说明内容",
  "size": "md",
  "status": "default",
  "rows": 4,
  "autosize": { "minRows": 3, "maxRows": 6 },
  "resize": "vertical",
  "showCount": true,
  "clearable": true,
  "smoothCaret": true,
  "block": true,
  "disabled": false,
  "readonly": false,
  "maxLength": 120
}
// @docs-options:end
const value = ref('BingTextarea 适合备注、描述、长文案编辑和多行反馈。')
</script>

<template>
  <BingTextarea v-model="value" v-bind="options" ariaLabel="基础 Textarea 示例" />
  <p role="status">字符数：{{ value.length }}</p>
</template>
