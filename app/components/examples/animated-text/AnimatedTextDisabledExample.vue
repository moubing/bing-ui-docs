<script setup lang="ts">
import { BingAnimatedText, BingCheckbox, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, disabledDemo, disabledCode } = useExamples()
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview">
      <p class="preview-label">禁用预览</p>
      <p class="animated-text-stage">

          <BingAnimatedText
            effect="shine"
            trigger="always"
            :disabled="disabledDemo"
          >
            动画可以暂停
          </BingAnimatedText>

      </p>
    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="disabledDemo" label="禁用扫光" />
    </div>
  </div>

  </ClientOnly>

  <BingCodeBlock
    :code="disabledCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
