<script setup lang="ts">
import { BingTooltip, type BingTooltipPlacement } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const items: Array<{ placement: BingTooltipPlacement; label: string }> = [
  { placement: 'top', label: '上方' }, { placement: 'right', label: '右侧' },
  { placement: 'bottom', label: '下方' }, { placement: 'left', label: '左侧' },
]
</script>

<template>
  <div class="board">
    <BingTooltip v-for="item in items" :id="`placement-${item.placement}`" :key="item.placement"
      :content="`优先方向：${item.placement}，空间不足时自动选择其他方向。`" trigger="click"
      :placement="item.placement" align="center" :open-delay="0" :offset="12" :interactive="false">
      <template #default="{ triggerProps }"><button type="button" class="anchor" v-bind="triggerProps">{{ item.label }}</button></template>
    </BingTooltip>
  </div>
</template>

<style scoped>
.board { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; padding: 110px 20px; }
.anchor { padding: 10px 16px; border: 1px solid var(--bing-border); border-radius: 8px; color: inherit; background: transparent; font: inherit; cursor: pointer; }
</style>
