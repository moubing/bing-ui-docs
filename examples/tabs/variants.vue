<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTabs } from '@moubing/bing-ui'
import type { BingTabItem, BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: BingTabItem[] = [
  { value: 'overview', label: '总览' },
  { value: 'usage', label: '用法' },
  { value: 'metrics', label: '指标' },
  { value: 'disabled', label: '禁用项', disabled: true },
]
const pillValue = ref<BingTabValue>('overview')
const glassValue = ref<BingTabValue>('overview')
const softValue = ref<BingTabValue>('overview')
</script>

<template>
  <div class="variants">
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="pillValue" :items="items" variant="pill" size="sm" ariaLabel="pill 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="glassValue" :items="items" variant="glass" ariaLabel="glass 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
    <div class="tabs-toolbar">
      <span class="tabs-toolbar__label">REQ-11</span>
      <BingTabs v-model="softValue" :items="items" variant="soft" size="lg" ariaLabel="soft 样式" />
      <BingButton size="sm">保存版本</BingButton>
    </div>
  </div>
  <p>各组独立选中值：{{ pillValue }} / {{ glassValue }} / {{ softValue }}</p>
</template>

<style scoped>
.variants { display: grid; gap: 14px; min-width: 0; }
.tabs-toolbar { display: flex; align-items: center; gap: 12px; min-width: 0; }
.tabs-toolbar__label { flex-shrink: 0; font-size: 12px; line-height: 18px; }
.tabs-toolbar > .bing-button { flex-shrink: 0; margin-left: auto; }
</style>
