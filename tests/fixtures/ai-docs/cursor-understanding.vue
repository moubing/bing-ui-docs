<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BingCursor, type BingCursorProps, type BingCursorType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const options = reactive<BingCursorProps>({ global: true, size: 32 })
const type = ref<BingCursorType>('default')
const visible = ref(false)
const disabledTarget = ref(false)
function capture(event: PointerEvent) { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId) }
</script>

<template>
  <div class="controls">
    <button id="unmount" @click="mounted = false">卸载</button>
    <button id="disable" @click="options.disabled = true">停用</button>
    <button id="enable" @click="options.disabled = false">启用</button>
    <button id="fixed" @click="options.type = 'zoom-out'">固定缩小</button>
    <button id="target-disable" @click="disabledTarget = true">禁用目标</button>
    <button id="style" @click="options.size = 500; options.color = '#52525b'; options.outlineColor = '#ffffff'; options.hotspot = [8, 9]">更新外观</button>
  </div>
  <BingCursor v-if="mounted" v-bind="options" @change="type = $event" @visibility-change="visible = $event" />
  <div id="plain" class="tile">普通区域</div>
  <button id="target" :disabled="disabledTarget" style="cursor: pointer">目标按钮</button>
  <div id="grab" class="tile" style="cursor: grab" @pointerdown="capture">带指针捕获的抓取区域</div>
  <div id="wait" class="tile" style="cursor: wait">忙碌状态</div>
  <div id="native" class="tile" v-bind="{ 'data-bing-cursor': 'native' }">原生区域</div>
  <select aria-label="原生选择"><option>保留原生光标</option></select>
  <p id="state">类型：{{ type }}；显示：{{ visible }}</p>
</template>

<style scoped>
.controls { display: flex; gap: 8px; flex-wrap: wrap; }
.tile { padding: 20px; margin: 12px 0; border: 1px solid var(--bing-border); }
</style>
