<script setup lang="ts">
import { BingCheckbox, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { smallSizeChecked, mediumSizeChecked, largeSizeChecked, customSizeChecked, sizesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">视觉组合</p>
      <div class="checkbox-demo-list">
        <ClientOnly>
          <BingCheckbox v-model="smallSizeChecked" size="sm" label="小尺寸" />
          <BingCheckbox v-model="mediumSizeChecked" size="md" tone="secondary" label="辅助色" />
          <BingCheckbox v-model="largeSizeChecked" size="lg" shape="circle" label="大尺寸圆形" />
          <BingCheckbox v-model="customSizeChecked" :size="34" label="自定义 34px" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="sizesCode" language="vue" title="代码示例" wrap />
</template>
