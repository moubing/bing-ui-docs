<script setup lang="ts">
import { ref } from 'vue'
import { BingInput, type BingInputProps } from '@moubing/bing-ui'
import { Search } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

type DemoOptions = Omit<BingInputProps, 'modelValue' | 'icon' | 'clearable'> & {
  initialValue: string | number | null; withIcon: boolean; clearMode: 'auto' | 'always' | 'never'
}
// @docs-options:start
const options: DemoOptions = {
  "initialValue": "Bing UI",
  "type": "text",
  "placeholder": "请输入内容",
  "size": "md",
  "status": "default",
  "clearMode": "auto",
  "block": true,
  "disabled": false,
  "withIcon": true
}
// @docs-options:end
const value = ref<string | number | null>(options.initialValue)
const clearable = options.clearMode === 'auto' ? undefined : options.clearMode === 'always'
</script>

<template>
  <BingInput v-model="value" :type="options.type" :placeholder="options.placeholder" :size="options.size"
    :status="options.status" :clearable="clearable" :block="options.block" :disabled="options.disabled"
    :icon="options.withIcon ? Search : undefined" icon-label="搜索" ariaLabel="基础输入框示例" />
  <p role="status">当前值：{{ value === '' ? '空' : value }}</p>
</template>
