<script setup lang="ts">
import { BingAnimatedText, BingCodeBlock, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, jumpText, jumpY, jumpStagger, normalizedJumpY, normalizedJumpStagger, jumpCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview">
      <p class="preview-label">悬停预览</p>
      <p class="animated-text-stage">

          <BingAnimatedText
            effect="jump"
            trigger="hover"
            :jump-y="normalizedJumpY"
            :jump-stagger="normalizedJumpStagger"
            :jump-duration="0.36"
          >
            {{ jumpText }}
          </BingAnimatedText>

      </p>
    </div>

    <div class="doc-example__controls">
      <label class="control-label" for="jump-text">文案</label>
      <BingInput id="jump-text" v-model="jumpText" block clearable />

      <label class="control-label" for="jump-y">jumpY</label>
      <BingInput id="jump-y" v-model="jumpY" block />

      <label class="control-label" for="jump-stagger">jumpStagger</label>
      <BingInput id="jump-stagger" v-model="jumpStagger" block />
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="jumpCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
