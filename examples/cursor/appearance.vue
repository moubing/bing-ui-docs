<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingInput } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const color = ref('#2563eb')
const outline = ref('#ffffff')
const size = ref(36)
const customHotspot = ref(false)
const count = ref(0)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <div class="controls">
    <label>主体色<input v-model="color" type="color" aria-label="光标主体色" /></label>
    <label>描边色<input v-model="outline" type="color" aria-label="光标描边色" /></label>
    <label>尺寸（px）<BingInput :model-value="size" type="number" :min="8" :max="128" ariaLabel="外观光标尺寸" block @update:model-value="size = Number($event)" /></label>
    <BingButton @click="customHotspot = !customHotspot">{{ customHotspot ? '恢复默认热点' : '使用热点 [8, 8]' }}</BingButton>
  </div>
  <BingCursor v-if="mounted" :color="color" :outline-color="outline" :size="size" :hotspot="customHotspot ? [8, 8] : undefined">
    <div class="appearance-zone">
      <BingButton @click="count++">测试点击：{{ count }}</BingButton>
      <div class="appearance-target" v-bind="{ 'data-bing-cursor': 'zoom-in' }">移动到此处查看放大光标</div>
    </div>
  </BingCursor>
  <p>热点是图片中对应点击位置的坐标，通常使用内置默认值。尺寸或颜色变化后无需重新挂载组件。</p>
</template>

<style scoped>
.controls { display: flex; flex-wrap: wrap; gap: 16px; align-items: end; }
.controls label { display: grid; gap: 8px; max-width: 180px; font-size: 14px; }
input[type="color"] { width: 56px; height: 36px; padding: 3px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-surface-solid); }
.appearance-zone { display: grid; gap: 16px; margin-top: 16px; }
.appearance-zone .bing-button { justify-self: start; }
.appearance-target { padding: 24px; border: 1px dashed var(--bing-border); border-radius: 8px; }
p { color: var(--bing-text-secondary); font-size: 14px; line-height: 1.6; }
</style>
