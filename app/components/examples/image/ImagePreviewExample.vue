<script setup lang="ts">
import { BingCodeBlock, BingImage } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, previewFeedback, galleryItems, previewCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">点击任意图片打开预览</p>
      <div class="image-grid image-grid--gallery">
        <ClientOnly v-if="examplesActive">
          <BingImage
            v-for="(item, index) in galleryItems"
            :key="item.src"
            :src="item.src"
            :alt="item.alt"
            :preview-aria-label="'预览' + item.alt"
            @preview-open="previewFeedback = '打开：' + item.caption"
            @preview-close="previewFeedback = '关闭原因：' + $event.reason"
            :preview-items="galleryItems"
            :preview-initial-index="index"
            preview
            preview-downloadable
            width="100%"
            aspect-ratio="4 / 3"
            block
            radius="lg"
          />
        </ClientOnly>
      </div>
      <p class="image-feedback">{{ previewFeedback }}</p>
    </div>
  </div>

  <BingCodeBlock :code="previewCode" language="vue" title="代码示例" wrap />
</template>
