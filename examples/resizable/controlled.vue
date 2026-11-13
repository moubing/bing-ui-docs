<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose, type BingResizableResolvedSize, type BingResizablePosition } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const panel = ref<BingResizableExpose | null>(null)
const size = ref<BingResizableResolvedSize>({ width: 280, height: 160 })
const position = ref<BingResizablePosition>({ x: 40, y: 32 })
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 640px; height: 360px; border: 1px dashed var(--bing-border)">
      <BingResizable ref="panel" v-model:size="size" v-model:position="position"
        :default-size="{ width: 280, height: 160 }" :default-position="{ x: 40, y: 32 }"
        :directions="['left', 'right', 'bottom']" :step="10" show-size ariaLabel="受控面板">
        <div style="padding: 24px">同时同步尺寸和位置。</div>
        <template #handle="{ direction, active }"><span aria-hidden="true" :title="direction">{{ active ? '●' : '+' }}</span></template>
      </BingResizable>
    </div>
  </div>
  <BingButton size="sm" :throttle="false" @click="panel?.reset()">重置受控面板</BingButton>
  <p role="status">{{ JSON.stringify({ size, position }) }}</p>
</template>
