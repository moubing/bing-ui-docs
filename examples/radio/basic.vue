<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingRadio } from '@moubing/bing-ui'
import type { BingRadioProps, BingRadioValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingRadioProps = {
  "value": "docs",
  "label": "文档模式",
  "description": "为组件文档保留完整说明和示例。",
  "size": "md",
  "status": "default",
  "disabled": false
}
// @docs-options:end

const selected = ref<BingRadioValue | null>('docs')
const checked = computed(() => selected.value === options.value)
</script>

<template>
  <BingRadio id="radio-doc-mode" v-model="selected" v-bind="options" name="radio-doc-mode" />
  <p role="status">modelValue：{{ selected }}；value：{{ options.value }}；{{ checked ? '当前项已选中' : '当前项未选中' }}</p>
</template>
