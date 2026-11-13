<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type RichTabItem = BingTabItem & { tone: string; count: number }
const items: RichTabItem[] = [
  { value: 'design', label: '设计', tone: '#fb7185', count: 12 },
  { value: 'develop', label: '开发', tone: '#38bdf8', count: 6 },
  { value: 'release', label: '发布', tone: '#34d399', count: 3 },
  { value: 'archive', label: '归档', tone: '#94a3b8', count: 0, disabled: true },
]
const active = ref<BingTabValue>('design')
const activeItem = computed(() => items.find(item => Object.is(item.value, active.value)))
// 插槽 item 的业务字段类型为 unknown，需要先缩窄再传给样式等强类型位置。
function tone(item: BingTabItem) { return typeof item.tone === 'string' ? item.tone : '#94a3b8' }
function count(item: BingTabItem) { return typeof item.count === 'number' ? item.count : 0 }
</script>

<template>
  <BingTabs v-model="active" :items="items" variant="glass" ariaLabel="任务阶段">
    <template #item="{ item, active: selected, disabled }">
      <span class="dot" :style="{ background: tone(item) }"></span>
      <span>{{ item.label }}</span>
      <small class="badge">{{ count(item) }}</small>
      <span v-if="selected" class="badge">当前</span>
      <span v-if="disabled" class="badge">不可选</span>
    </template>
  </BingTabs>
  <p aria-live="polite">{{ activeItem?.label }}，数量：{{ activeItem?.count }}</p>
</template>

<style scoped>
.dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; }
.badge { padding: 2px 6px; border: 1px solid currentColor; border-radius: 999px; font-size: 12px; }
</style>
