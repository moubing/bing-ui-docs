<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingResizable, type BingResizableExpose, type BingResizablePayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const events = ref<string[]>([])
const panel = ref<BingResizableExpose | null>(null)
const initialWidth = ref(280)
function record(name: string, payload?: BingResizablePayload) { events.value.push(payload ? `${name}:${payload.event.type}` : name) }
</script>

<template>
  <div style="max-width: 100%; overflow: auto; padding: 20px">
    <div style="position: relative; width: 620px; height: 230px">
      <BingResizable :size="{ width: 280, height: 160 }" :position="{ x: 30, y: 20 }" ariaLabel="没有同步的受控面板"
        @resize-start="record('start', $event)" @update:size="record('size')" @update:position="record('position')"
        @resize="record('resize', $event)" @resize-end="record('end', $event)">只传值不接收更新。</BingResizable>
    </div>
    <div style="position: relative; width: 280px; height: 150px">
      <BingResizable :default-size="{ width: 240, height: 135 }" :step="10" contain lock-aspect-ratio
        :directions="['right', 'bottom-right']" ariaLabel="约束冲突面板">边界可能改变比例。</BingResizable>
    </div>
    <div style="position: relative; width: 620px; height: 230px; margin-top: 40px">
      <BingResizable ref="panel" :default-size="{ width: initialWidth, height: 160 }" ariaLabel="默认值更新面板">更改默认值后重置。</BingResizable>
    </div>
  </div>
  <BingButton :throttle="false" @click="initialWidth = 360">改变默认值</BingButton>
  <BingButton :throttle="false" @click="panel?.reset()">应用默认值</BingButton>
  <p role="status">{{ JSON.stringify(events) }}</p>
</template>
