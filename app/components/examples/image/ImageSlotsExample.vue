<script setup lang="ts">
import { BingButton, BingCodeBlock, BingImage } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, slotSrc, photoSrc, slotErrorCount, slotImageKey, handleSlotError, resetSlotImage, slotCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview image-demo-stage">
      <p class="preview-label">自定义错误态</p>
      <ClientOnly v-if="examplesActive">
        <BingImage
          :key="slotImageKey"
          :src="slotSrc"
          alt="错误槽示例"
          width="100%"
          aspect-ratio="16 / 9"
          block
          radius="lg"
          @error="handleSlotError"
        >
          <template #error="{ src, retry }">
            <div class="image-error-slot">
              <strong>图片没有加载成功</strong>
              <span>{{ src }}</span>
              <BingButton :throttle="false" @click.stop="retry">重试</BingButton>
            </div>
          </template>
        </BingImage>
      </ClientOnly>
      <p class="image-feedback">
        <span>错误事件：{{ slotErrorCount }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        <code>error</code> 插槽会收到失败的 <code>src</code> 和 <code>retry()</code>。这里的数据故意损坏，重试仍然失败；使用有效图片会修改 src 并恢复显示。
      </p>
      <BingButton :throttle="false" @click="slotSrc = photoSrc">使用有效图片</BingButton>
      <BingButton :throttle="false" @click="resetSlotImage">重置示例</BingButton>
    </div>
  </div>

  <BingCodeBlock :code="slotCode" language="vue" title="代码示例" wrap />
</template>
