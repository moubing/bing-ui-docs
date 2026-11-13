<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const panel = ref<BingResizableExpose | null>(null)
const feedback = ref('尚未读取')
function read() {
  const size = panel.value?.getSize()
  const position = panel.value?.getPosition()
  feedback.value = size && position ? `${size.width} x ${size.height} / x ${position.x}, y ${position.y}` : '尚未挂载'
}
function reset() { panel.value?.reset(); read() }
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 12px">
    <div style="position: relative; width: 560px; height: 270px; border: 1px dashed var(--bing-border)">
      <BingResizable ref="panel" :default-size="{ width: 300, height: 170 }" :default-position="{ x: 26, y: 24 }" show-size ariaLabel="可读取尺寸的面板">
        <div style="padding: 24px">通过 ref 读取和重置。</div>
      </BingResizable>
    </div>
  </div>
  <BingButton size="sm" :throttle="false" @click="read">读取尺寸</BingButton>
  <BingButton size="sm" variant="ghost" :throttle="false" @click="reset">重置</BingButton>
  <p role="status">{{ feedback }}</p>
</template>
