<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingCarouselTransition, BingButton, type BingCarouselTransitionItem, type BingCarouselTransitionProps, type BingCarouselTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'snapshot' | 'activity' | 'insight'
type DemoPanel = BingCarouselTransitionItem & { value: PanelKey; title: string; summary: string; badge: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'snapshot',
    label: '概览',
    title: '当前状态快照',
    summary: '用一张固定宽度的面板承载当前模块最重要的概览信息。',
    badge: 'Now',
    accent: '#52525b',
  },
  {
    value: 'activity',
    label: '动态',
    title: '最近活动',
    summary: '横向滑动可以保留前后面板的空间方向，适合连续内容。',
    badge: '12',
    accent: '#71717a',
  },
  {
    value: 'insight',
    label: '洞察',
    title: '下一步洞察',
    summary: '默认插槽可以渲染任意业务内容，而不是只展示纯文本。',
    badge: 'AI',
    accent: '#3f3f46',
  },
]
function field(item: BingCarouselTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('snapshot')
const counts = reactive<Record<string, number>>({})
function increment(value: BingTabValue) { const key = String(value); counts[key] = (counts[key] ?? 0) + 1 }
</script>

<template>
  <div class="frame">
    <BingCarouselTransition v-model="active" :items="panels" :loop="false" ariaLabel="滚轮轮播面板">
      <template #default="{ item, index, active, isAnimating }">
        <div class="panel" :inert="!active" :class="{ 'is-animating': isAnimating }">
          <div><p>第 {{ index + 1 }} 个面板</p><h3>{{ item.label }}</h3><p>{{ active ? '当前展示' : '后台保留' }} · {{ isAnimating ? '切换中' : '静止' }}</p></div>
          <BingButton :throttle="false" @click="increment(item.value)">{{ item.label }}计数：{{ counts[String(item.value)] ?? 0 }}</BingButton>
        </div>
      </template>
    </BingCarouselTransition>
  </div>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-carousel-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-carousel-transition__viewport) { min-height: 280px; }
.frame :deep(.bing-carousel-transition__panel) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.badge { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-carousel-transition__viewport) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
