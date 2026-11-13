<script setup lang="ts">
import { ref, reactive } from 'vue'
import { BingAppSwitcherTransition, BingButton, type BingAppSwitcherTransitionItem, type BingAppSwitcherTransitionProps, type BingAppSwitcherTransitionChangePayload, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type PanelKey = 'overview' | 'workflow' | 'metrics'
type DemoPanel = BingAppSwitcherTransitionItem & { value: PanelKey; title: string; summary: string; metric: string; accent: string }
const panels: DemoPanel[] = [
  {
    value: 'overview',
    label: '总览',
    title: '工作台总览',
    summary: '把当前模块的关键状态压缩成一个可快速阅读的卡片。',
    metric: '24',
    accent: '#52525b',
  },
  {
    value: 'workflow',
    label: '流程',
    title: '流程推进',
    summary: '用于展示从一个应用状态切换到另一个状态时的空间关系。',
    metric: '07',
    accent: '#71717a',
  },
  {
    value: 'metrics',
    label: '指标',
    title: '指标追踪',
    summary: '适合承载带有数据、摘要和下一步操作的复杂面板。',
    metric: '91%',
    accent: '#3f3f46',
  },
]
function field(item: BingAppSwitcherTransitionItem, key: string) { return typeof item[key] === 'string' ? item[key] : '' }

const active = ref<BingTabValue>('overview')
</script>

<template>
  <div class="frame">
    <BingAppSwitcherTransition v-model="active" :items="panels" ariaLabel="基础应用面板">
      <template #default="{ item, active }">
        <div class="panel" :class="{ 'is-active': active }" :inert="!active" :style="{ '--accent': field(item, 'accent') }">
        <span class="metric">{{ field(item, 'metric') }}</span>
        <div><p>{{ item.label }}</p><h3>{{ field(item, 'title') }}</h3><p>{{ field(item, 'summary') }}</p></div>
      </div>
      </template>
    </BingAppSwitcherTransition>
  </div>
  <p role="status">当前值：{{ active }}</p>
</template>

<style scoped>
.frame { width: 100%; overflow: hidden; }
.frame :deep(.bing-app-switcher-transition) { width: 100%; max-width: 100%; padding: 10px 8px 16px; }
.frame :deep(.bing-app-switcher-transition__stage) { min-height: 280px; }
.frame :deep(.bing-app-switcher-transition__card) { padding: 16px; }
.panel { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 18px; min-height: 100%; padding: 24px; border-radius: 8px; background: var(--bing-surface-soft, #f8fafc); color: var(--bing-text, #111827); }
.panel h3 { margin: 0; font-size: 24px; }
.panel p { margin: 10px 0; line-height: 1.6; }
.metric { display: grid; width: 84px; aspect-ratio: 1; place-items: center; border-radius: 8px; background: var(--accent, #71717a); color: white; font-size: 30px; font-weight: 400; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
@media (max-width: 640px) { .frame :deep(.bing-app-switcher-transition__stage) { min-height: 340px; } .panel { grid-template-columns: 1fr; padding: 16px; gap: 8px; } }
</style>
