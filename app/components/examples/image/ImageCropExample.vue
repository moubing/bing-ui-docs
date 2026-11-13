<script setup lang="ts">
import { BingCodeBlock, BingImage } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, photoSrc, portraitSrc, cropCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">裁剪对比</p>
      <div class="image-grid">
        <ClientOnly v-if="examplesActive">
          <BingImage :src="photoSrc" alt="cover 示例" fit="cover" position="center" aspect-ratio="16 / 9" block radius="lg" />
          <BingImage :src="photoSrc" alt="contain 示例" fit="contain" aspect-ratio="16 / 9" block radius="lg" />
          <BingImage :src="portraitSrc" alt="portrait 示例" fit="cover" position="top" aspect-ratio="3 / 4" block radius="lg" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="cropCode" language="vue" title="代码示例" wrap />
</template>
