<script setup lang="ts">
import { BingCodeBlock, BingColorPicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, neutralPresets, presetValue, presetsCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview color-picker-demo-stage">
      <p class="preview-label">预设色板</p>
        <BingColorPicker
          v-model="presetValue"
          :presets="neutralPresets"
          copy-label="复制颜色"
          copied-label="已复制"
          block
          aria-label="选择中性色"
        />
      <div class="color-picker-summary">
        <span class="color-picker-swatch" :style="{ background: presetValue }" />
        <span>
          <strong>{{ presetValue }}</strong>
          <small>点击面板里的色块可快速写入预设颜色。</small>
        </span>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        色板会保留传入顺序。浅色和白色建议放在边框明显的容器中，避免和面板背景混在一起。
      </p>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="presetsCode" language="vue" title="代码示例" wrap />
</template>
