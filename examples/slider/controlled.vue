<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingCheckbox, BingInput, BingSlider, type BingInputValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const width = ref(880)
const accept = ref(true)
const commits = ref(0)
function update(value: BingInputValue) {
  if (accept.value && typeof value === 'number') width.value = value
}
</script>
<template>
  <div style="display: grid; gap: 18px; padding-top: 28px; min-width: 0">
    <BingCheckbox v-model="accept" label="接受更新" />
    <BingSlider :model-value="width" :min="640" :max="1800" :step="20" :reset-value="880" tooltip="auto" :format-tooltip="value => value + 'px'" ariaLabel="受控正文宽度" style="--bing-slider-color: var(--bing-accent)" @update:model-value="update" @change="commits++" />
    <BingInput :model-value="width" type="number" :min="640" :max="1800" :step="20" suffix="px" ariaLabel="精确正文宽度" @update:model-value="update" />
    <BingButton variant="secondary" @click="update(880)">恢复默认宽度</BingButton>
    <p role="status">已接受 {{ width }}px；提交 {{ commits }} 次</p>
    <p>关闭接受更新后持续拖动并停留，预览跟随手势，结束后回到已接受值。Esc 撤销本次拖动。</p>
  </div>
</template>
