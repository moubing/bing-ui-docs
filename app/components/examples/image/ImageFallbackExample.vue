<script setup lang="ts">
import { BingCodeBlock, BingImage } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, brokenSrc, placeholderSrc, fallbackSrc, fallbackStatus, fallbackErrorCount, handleFallbackStatus, handleFallbackError, fallbackCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview image-demo-stage">
      <p class="preview-label">失败后回退</p>
      <ClientOnly v-if="examplesActive">
        <BingImage
          :src="brokenSrc"
          :fallback-src="fallbackSrc"
          :placeholder-src="placeholderSrc"
          alt="带回退图的示例"
          width="100%"
          aspect-ratio="16 / 9"
          radius="lg"
          block
          error-text="图片加载失败"
          @status-change="handleFallbackStatus"
          @error="handleFallbackError"
        />
      </ClientOnly>
      <p class="image-feedback">
        <span>状态：{{ fallbackStatus }}</span><span>错误事件：{{ fallbackErrorCount }}</span>
      </p>
    </div>
  </div>

  <BingCodeBlock :code="fallbackCode" language="vue" title="代码示例" wrap />
</template>
