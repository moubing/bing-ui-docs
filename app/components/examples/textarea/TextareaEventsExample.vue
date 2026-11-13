<script setup lang="ts">
import { BingCodeBlock, BingTextarea } from '@moubing/bing-ui'
import { useExamples } from './state'
const { eventValue, eventLog, handleInput, handleClear, handleFocus, handleBlur, eventsCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview textarea-demo-stage">
      <p class="preview-label">事件预览</p>
      <ClientOnly>
        <BingTextarea
          v-model="eventValue"
          clearable
          show-count
          :max-length="100"
          block
          @input="handleInput"
          @clear="handleClear"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ClientOnly>
      <p class="textarea-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>输入、聚焦、失焦或点击清除按钮时，事件反馈会实时更新。</p>
    </div>
  </div>

  <BingCodeBlock
    :code="eventsCode"
    language="vue"
    title="代码示例"
    wrap
  />
</template>
