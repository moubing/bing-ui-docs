<script setup lang="ts">
import { BingCodeBlock, BingImage, BingImagePreview } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, previewItems, galleryOpen, galleryCurrentIndex, openGallery, galleryCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview image-preview-demo-stage">
      <p class="preview-label">点击缩略图打开</p>
      <div class="image-preview-grid">
        <button
          v-for="(item, index) in previewItems"
          :key="item.src"
          class="image-preview-thumb"
          :aria-label="item.alt"
          type="button"
          @click="openGallery(index)"
        >
          <BingImage :src="item.src" :alt="item.alt" aspect-ratio="4 / 3" width="100%" radius="lg" block />
          <span>{{ item.caption }}</span>
        </button>
      </div>
      <p class="image-preview-feedback">
        <span>当前索引：{{ galleryCurrentIndex }}</span>
      </p>

        <BingImagePreview
          v-model="galleryOpen"
          v-model:current-index="galleryCurrentIndex"
          :items="previewItems"
          ariaLabel="受控图片预览"
        />

    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="galleryCode" language="vue" title="代码示例" wrap />
</template>
