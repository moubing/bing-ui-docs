<script setup lang="ts">
import { ref, useId } from 'vue'
import { BingButton, BingCheckbox, BingDialog, BingSlider } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const id = `width-${useId()}`
const value = ref(880)
const saved = ref(880)
const commits = ref(0)
const disabled = ref(false)
const open = ref(false)
const valueText = (next: number) => `正文宽度 ${next} 像素`
function save(next: number) { saved.value = next; commits.value++ }
</script>

<template>
  <div style="display: grid; gap: 16px;">
    <label :for="id">正文宽度：{{ value }}px</label>
    <BingSlider :id="id" v-model="value" :min="640" :max="1800" :step="20"
      :disabled="disabled" :format-value-text="valueText" @change="save" />
    <BingCheckbox v-model="disabled" label="禁用滑块" />
    <p role="status">已提交：{{ saved }}px；提交次数：{{ commits }}</p>
    <BingButton variant="secondary" @click="open = true">在弹窗中调整</BingButton>
  </div>
  <BingDialog v-model="open" title="正文宽度设置" :width="480" :show-peek="false" :overlay-blur="false"
    close-on-confirm confirm-text="完成">
    <div style="display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; padding-block: 20px;">
      <p>正文宽度：{{ value }}px</p>
      <BingSlider v-model="value" :min="640" :max="1800" :step="20" :reset-value="880"
        :disabled="disabled" tooltip="auto" :format-tooltip="next => `${next}px`"
        ariaLabel="弹窗正文宽度" :format-value-text="valueText" @change="save" />
      <BingButton variant="secondary" :disabled="disabled" @click="value = 880">恢复默认宽度</BingButton>
    </div>
  </BingDialog>
</template>
