<script setup lang="ts">
import { BingButton, BingCheckbox, BingCodeBlock, BingImagePreview, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, previewItems, glassOpen, glass, glassBlur, glassOpacity, glassSaturation, normalizedGlassBlur, normalizedGlassOpacity, normalizedGlassSaturation, glassCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview image-preview-demo-stage">
      <p class="preview-label">玻璃参数</p>
      <BingButton :throttle="false" @click="glassOpen = true">查看玻璃效果</BingButton>

        <BingImagePreview
          v-model="glassOpen"
          :items="previewItems"
          :glass="glass"
          :glass-blur="normalizedGlassBlur"
          :glass-opacity="normalizedGlassOpacity"
          :glass-saturation="normalizedGlassSaturation"
          ariaLabel="玻璃效果预览"
        />

    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="glass" label="启用 glass" />
      <label class="control-label" for="glass-blur">glassBlur</label>
      <BingInput id="glass-blur" v-model="glassBlur" placeholder="留空跟随主题" block />
      <label class="control-label" for="glass-opacity">glassOpacity</label>
      <BingInput id="glass-opacity" v-model="glassOpacity" placeholder="留空跟随主题" block />
      <label class="control-label" for="glass-saturation">glassSaturation</label>
      <BingInput id="glass-saturation" v-model="glassSaturation" placeholder="留空跟随主题" block />
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock :code="glassCode" language="vue" title="代码示例" wrap />
</template>
