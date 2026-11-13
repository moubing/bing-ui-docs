<script setup lang="ts">
import { ref } from 'vue'
import { BingDeckTransition, BingButton, type BingDeckTransitionItem, type BingDeckTransitionProps, type BingDeckTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
type PanelKey = 'plan' | 'build' | 'ship'
type DemoCard = BingDeckTransitionItem & { value: PanelKey; title: string; summary: string; step: string; accent: string }
const cards: DemoCard[] = [
  {
    value: 'plan',
    label: '规划',
    title: '确认组件边界',
    summary: '先读源码、类型和测试，把真实行为写进文档。',
    step: '01',
    accent: '#52525b',
  },
  {
    value: 'build',
    label: '编写',
    title: '组合交互示例',
    summary: '用默认插槽承载卡片内容，让文档里的示例真正可操作。',
    step: '02',
    accent: '#71717a',
  },
  {
    value: 'ship',
    label: '验证',
    title: '验证页面与示例',
    summary: '检查类型、导出内容和交互，让示例能独立运行。',
    step: '03',
    accent: '#3f3f46',
  },
]
function field(item: BingDeckTransitionItem, key: string) { const value = item[key]; return typeof value === 'string' ? value : '' }


const active = ref<BingTabValue>('plan')
</script>

<template>

  <div class="frame">
    <BingDeckTransition v-model="active" :items="cards" class="deck">
    <template #default="{ item, active, isAnimating }">
      <div class="story" :inert="!active" :class="{ 'is-animating': isAnimating }" :style="{ '--accent': field(item, 'accent') }">
        <span class="orb">{{ item.label }}</span><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p>
      </div>
    </template>

    </BingDeckTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.deck { width: min(900px, 100%); max-width: 100%; padding: 20px clamp(18px, 4vw, 44px) 74px; }
.story { display: grid; min-width: 0; align-content: center; gap: 16px; color: var(--bing-text, #111827); }
.orb { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-weight: 400; }
.story h3 { margin: 0; font-size: 1.45rem; line-height: 1.25; overflow-wrap: anywhere; }
.story p { margin: 0; line-height: 1.6; overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin: 16px 0; }
@media (max-width: 640px) { .deck { padding: 12px 8px 50px; } .deck :deep(.bing-deck-transition__stage) { min-height: 440px; } .deck :deep(.bing-deck-transition__card) { inset: 18px 8px 100px; padding: 18px; } }
</style>
