<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose, type BingResizablePayload, type BingResizableProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// @docs-options:start
const options: BingResizableProps = {
  "defaultSize": { "width": 320, "height": 200 },
  "defaultPosition": { "x": 34, "y": 28 },
  "minWidth": 180,
  "minHeight": 120,
  "maxWidth": 620,
  "maxHeight": 320,
  "mode": "fixed",
  "snapMode": "live",
  "directions": ["right", "bottom", "bottom-right"],
  "step": 8,
  "disabled": false,
  "lockAspectRatio": false,
  "contain": true,
  "showSize": true
}
// @docs-options:end
const panel = ref<BingResizableExpose | null>(null)
const feedback = ref('等待拖拽')
function report(name: string, payload: BingResizablePayload) {
  feedback.value = `${name}：${payload.direction}；${payload.size.width} x ${payload.size.height}；位置 ${payload.position.x},${payload.position.y}；${payload.event.type}`
}
</script>

<template>
  <div class="window"><div class="stage">
    <BingResizable ref="panel" v-bind="options" ariaLabel="可调整尺寸面板"
      @resize-start="report('开始', $event)" @resize="report('调整中', $event)" @resize-end="report('结束', $event)">
      <div class="content"><strong>Resizable panel</strong><p>拖拽边缘或角点，也可聚焦手柄后使用方向键。</p></div>
    </BingResizable>
  </div></div>
  <BingButton size="sm" :throttle="false" @click="panel?.reset()">恢复初始尺寸</BingButton>
  <p role="status">{{ feedback }}</p>
</template>

<style scoped>
.window { max-width: 100%; overflow: auto; padding: 12px; }
.stage { position: relative; width: 680px; height: 380px; border: 1px dashed var(--bing-border); }
.content { height: 100%; display: grid; place-content: center; padding: 20px; box-sizing: border-box; text-align: center; }
</style>
