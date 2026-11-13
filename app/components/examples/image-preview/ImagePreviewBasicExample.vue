<script setup lang="ts">
import { BingRadio, BingButton, BingCodeBlock, BingImage, BingImagePreview, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, currentCover, previewItems, initialIndexOptions, basicOpen, basicInitialIndex, normalizedInitialIndex, updateInitialIndex, basicCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview image-preview-demo-stage">
      <p class="preview-label">直接打开</p>
      <div class="image-preview-cover">
        <BingImage v-if="currentCover"
          :src="currentCover.src"
          :alt="currentCover.alt"
          aspect-ratio="16 / 9"
          width="100%"
          radius="lg"
          block
        />
      </div>
      <BingButton :throttle="false" @click="basicOpen = true">打开预览</BingButton>

        <BingImagePreview
          v-model="basicOpen"
          :items="previewItems"
          :initial-index="normalizedInitialIndex"
          ariaLabel="图片预览"
        />

    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">初始图片</p>
        <BingRadioGroup id="image-preview-control-1" name="image-preview-control-1"
          :model-value="basicInitialIndex"
          direction="row"
          size="sm"
          aria-label="初始图片"
          @update:model-value="updateInitialIndex">
          <BingRadio v-for="option in initialIndexOptions" :id="`image-preview-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>
      <p>
        打开后可以用工具栏缩放、旋转、重置，也可以用方向键切换图片、按 Escape 关闭。
      </p>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="basicCode" language="vue" title="代码示例" wrap />
</template>
