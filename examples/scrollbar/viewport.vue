<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { BingButton, BingCheckbox, BingScrollbar, type BingScrollbarExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const scrollbar = ref<BingScrollbarExpose | null>(null)
const readonly = ref(false)
const text = ref(Array.from({ length: 30 }, (_, index) => `日志 ${index + 1}：可以编辑的原生文本`).join('\n'))
async function append() { text.value += '\n追加日志：程序更新后重新测量'; await nextTick(); scrollbar.value?.update() }
</script>

<template>
  <div class="actions">
    <BingCheckbox v-model="readonly" label="只读编辑器" />
    <BingButton variant="secondary" @click="append">追加日志</BingButton>
    <BingButton variant="secondary" @click="scrollbar?.scrollTo(180)">滚动到 180</BingButton>
  </div>
  <BingScrollbar ref="scrollbar" :height="220" always>
    <template #viewport="{ viewportRef, viewportAttrs }">
      <textarea :ref="viewportRef" v-bind="viewportAttrs" v-model="text" class="text-viewport" :readonly="readonly" aria-label="自定义日志编辑器" />
    </template>
  </BingScrollbar>
</template>

<style scoped>
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 12px; }
.text-viewport { display: block; box-sizing: border-box; width: 100%; height: 100%; resize: none; overflow: auto; padding: 12px 24px 12px 12px; border: 1px solid var(--bing-border); border-radius: 6px; background: var(--bing-surface-solid); color: var(--bing-heading); font: inherit; line-height: 1.6; }
.text-viewport:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: -2px; }
</style>
