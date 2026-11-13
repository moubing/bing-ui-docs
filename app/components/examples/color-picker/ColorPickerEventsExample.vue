<script setup lang="ts">
import { BingButton, BingCodeBlock, BingColorPicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, productPresets, eventPicker, eventValue, eventLog, handleChange, handleCopy, handleCopyError, handleOpen, handleClose, eventsCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview color-picker-demo-stage">
      <p class="preview-label">事件预览</p>
        <BingColorPicker
          ref="eventPicker"
          :modelValue="eventValue"
          ariaLabel="事件颜色"
          :presets="productPresets"
          block
          @change="handleChange"
          @copy="handleCopy"
          @copy-error="handleCopyError"
          @open="handleOpen"
          @close="handleClose"
        />
      <p class="select-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>此例使用 change.rgba 保存透明度；颜色值：{{ eventValue }}</p>
      <div class="date-picker-action-row">
        <BingButton :throttle="false" @click="eventPicker?.focus()">聚焦</BingButton>
        <BingButton :throttle="false" @click="eventPicker?.blur()">失焦</BingButton>
        <BingButton :throttle="false" @click="eventPicker?.openPanel()">打开面板</BingButton>
        <BingButton :throttle="false" @click="eventPicker?.closePanel()">关闭面板</BingButton>
      </div>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="eventsCode" language="vue" title="代码示例" wrap />
</template>
