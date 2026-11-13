<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingCursor, BingInput, BingSelect, type BingCursorType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const fixedType = ref<BingCursorType | 'auto'>('auto')
const size = ref(28)
const types: BingCursorType[] = ['default', 'pointer', 'not-allowed', 'text', 'grab', 'grabbing', 'move', 'crosshair', 'col-resize', 'row-resize', 'ew-resize', 'ns-resize', 'nwse-resize', 'nesw-resize', 'zoom-in', 'zoom-out']
const choices = ['auto', ...types].map(value => ({ label: value, value }))
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <div class="controls">
    <label>固定类型<BingSelect :model-value="fixedType" :options="choices" :clearable="false" ariaLabel="固定光标类型" @update:model-value="fixedType = $event as BingCursorType | 'auto'" /></label>
    <label>尺寸（px）<BingInput :model-value="size" type="number" block :min="8" :max="128" ariaLabel="光标尺寸" @update:model-value="size = Number($event)" /></label>
  </div>
  <BingCursor v-if="mounted" :type="fixedType" :size="size">
    <div class="fixed-zone">固定状态体验区：{{ fixedType }}</div>
    <div class="states">
      <div v-for="type in types" :key="type" class="state" v-bind="{ 'data-bing-cursor': type }">{{ type }}</div>
    </div>
  </BingCursor>
  <p>在方格之间移动查看光标状态；方格的显式状态优先于固定类型，图片由浏览器直接切换。</p>
</template>

<style scoped>
.controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.controls label { display: grid; gap: 8px; font-size: 14px; }
.fixed-zone { margin: 16px 0; padding: 24px 16px; background: var(--bing-surface-soft); border-radius: 8px; }
.states { display: grid; grid-template-columns: repeat(auto-fit, minmax(126px, 1fr)); gap: 8px; }
.state { border: 1px solid var(--bing-border); border-radius: 6px; padding: 18px 12px; font-size: 14px; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
