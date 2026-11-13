<script setup lang="ts">
import { ref } from 'vue'
import { BingColorPicker, type BingColorPickerProps, type BingColorPickerPresetInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const productPresets: BingColorPickerPresetInput[] = [
  { label: '冰粉', value: '#ec4899' },
  { label: '玫瑰红', value: '#f43f5e' },
  { label: '琥珀橙', value: '#f59e0b' },
  { label: '柔金', value: '#eab308' },
  { label: '青柠绿', value: '#84cc16' },
  { label: '翡翠绿', value: '#10b981' },
  { label: '青色', value: '#06b6d4' },
  { label: '天蓝', value: '#0ea5e9' },
  { label: '亮蓝', value: '#3b82f6' },
  { label: '靛蓝', value: '#6366f1' },
  { label: '紫罗兰', value: '#8b5cf6' },
  { label: '品红', value: '#d946ef' },
  { label: '蓝灰', value: '#334155' },
  { label: '石墨黑', value: '#111827' },
  { label: '瓷白', value: '#f8fafc' },
  { label: '浅粉', value: '#fdf2f8' },
]
// @docs-options:start
const options: BingColorPickerProps = { "size": "md", "status": "default", "block": true, "glass": true, "disabled": false, "minWidth": 180, "panelWidth": 320 }
// @docs-options:end
const color = ref('#ec4899')
</script>

<template>
  <BingColorPicker v-model="color" :presets="productPresets" v-bind="options" ariaLabel="选择主题颜色" />
  <p class="summary" role="status"><span class="swatch" :style="{ background: color }" />当前颜色：{{ color }}</p>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: 18px; max-width: 100%; }
.stack :deep(.bing-color-picker) { max-width: 100%; }
.summary { display: flex; align-items: center; gap: 12px; margin: 16px 0; overflow-wrap: anywhere; }
.swatch { width: 40px; height: 40px; flex: 0 0 auto; border: 1px solid var(--bing-border); border-radius: 10px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
</style>
