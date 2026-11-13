<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTag } from '@moubing/bing-ui'
import type { BingTagTone } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type FilterTag = { id: string; label: string; tone: BingTagTone }
const initial: FilterTag[] = [
  { id: 'docs', label: '文档', tone: 'primary' },
  { id: 'demo', label: '示例', tone: 'secondary' },
  { id: 'api', label: 'API', tone: 'success' },
]
const tags = ref<FilterTag[]>([...initial])
function removeTag(id: string) { tags.value = tags.value.filter(tag => tag.id !== id) }
function restoreTags() { tags.value = [...initial] }
</script>

<template>
  <div class="tags">
    <BingTag v-for="tag in tags" :key="tag.id" :label="tag.label" :tone="tag.tone" closable @close="removeTag(tag.id)" />
    <BingTag label="禁用" tone="neutral" closable disabled close-aria-label="移除禁用标签" />
  </div>
  <BingButton size="sm" variant="secondary" @click="restoreTags">恢复标签</BingButton>
  <p role="status">当前筛选：{{ tags.map(tag => tag.id).join(',') || '无' }}</p>
</template>

<style scoped>
.tags { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
</style>
