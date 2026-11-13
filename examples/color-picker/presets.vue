<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const neutralPresets: BingColorPickerPresetInput[] = [
  '#111827',
  '#334155',
  '#64748b',
  '#94a3b8',
  '#cbd5e1',
  '#f8fafc',
  '#ffffff',
  '#ec4899',
]
const color = ref('#0ea5e9')
</script>

<template>
  <BingColorPicker v-model="color" :presets="neutralPresets" copyLabel="复制颜色" copiedLabel="已复制" block ariaLabel="选择中性色" />
  <p class="summary" role="status"><span class="swatch" :style="{ background: color }" />当前颜色：{{ color }}</p>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
