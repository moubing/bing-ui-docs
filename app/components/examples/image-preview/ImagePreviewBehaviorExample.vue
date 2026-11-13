<script setup lang="ts">
import { BingButton, BingCheckbox, BingCodeBlock, BingImagePreview } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, previewItems, behaviorOpen, lastChangeText, lastCloseReason, downloadCount, showToolbar, showCounter, downloadable, loop, closeOnEsc, closeOnOverlay, lockScroll, handleChange, handleClose, handleDownload, behaviorCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview image-preview-demo-stage">
      <p class="preview-label">行为预览</p>
      <BingButton :throttle="false" @click="behaviorOpen = true">打开带事件的预览</BingButton>
      <p class="image-preview-feedback">
        <span>最后切换：{{ lastChangeText }}</span><span>关闭来源：{{ lastCloseReason }}</span><span>下载次数：{{ downloadCount }}</span>
      </p>

        <BingImagePreview
          v-model="behaviorOpen"
          :items="previewItems"
          :show-toolbar="showToolbar"
          :show-counter="showCounter"
          :downloadable="downloadable"
          :loop="loop"
          :close-on-esc="closeOnEsc"
          :close-on-overlay="closeOnOverlay"
          :lock-scroll="lockScroll"
          ariaLabel="带事件的图片预览"
          @change="handleChange"
          @close="handleClose"
          @download="handleDownload"
        />

    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="showToolbar" label="显示工具栏" />
      <BingCheckbox v-model="showCounter" label="显示计数器" />
      <BingCheckbox v-model="downloadable" label="显示下载按钮" />
      <BingCheckbox v-model="loop" label="循环切换" />
      <BingCheckbox v-model="closeOnEsc" label="允许 Escape 关闭" />
      <BingCheckbox v-model="closeOnOverlay" label="允许点击遮罩关闭" />
      <BingCheckbox v-model="lockScroll" label="打开时锁定页面滚动" />
      <p>关闭工具栏和遮罩退出时，示例保留 Escape 退出。</p>
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="behaviorCode" language="vue" title="代码示例" wrap />
</template>
