<script setup lang="ts">
import { ref } from 'vue'
import { BingAutocomplete, BingIcon } from '@moubing/bing-ui'
import { ExternalLink } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'
const query = ref('REQ')
const result = ref('尚未操作')
const options = [
  { value: 'a', label: 'REQ-7（搜索结果可在当前页或新标签页打开）' },
  { value: 'b', label: 'REQ-4（页面布局）' },
  { value: 'c', label: 'REQ-9（不可访问）', disabled: true },
]
</script>
<template>
  <div style="display: grid; gap: 12px; width: 380px; max-width: 100%">
    <BingAutocomplete v-model="query" :options="options" :complete-on-select="false" :close-on-select="false"
      option-action-label="在新标签页打开" ariaLabel="带行尾操作的搜索" block
      @select="result = '当前页：' + $event.label" @option-action="result = '新标签页：' + $event.label">
      <template #option-action><BingIcon :icon="ExternalLink" :size="16" decorative /></template>
    </BingAutocomplete>
    <p role="status">{{ result }}</p>
  </div>
</template>
