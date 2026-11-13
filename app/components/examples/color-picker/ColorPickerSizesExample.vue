<script setup lang="ts">
import { BingCodeBlock, BingColorPicker } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, productPresets, smallValue, mediumValue, largeValue, sizesCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸对比</p>
      <div class="color-picker-stack">
          <BingColorPicker v-model="smallValue" :presets="productPresets" size="sm" />
          <BingColorPicker v-model="mediumValue" :presets="productPresets" size="md" />
          <BingColorPicker v-model="largeValue" :presets="productPresets" size="lg" />
      </div>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="sizesCode" language="vue" title="代码示例" wrap />
</template>
