<script setup lang="ts">
import { BingCheckbox, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { eventChecked, eventLog, handleChange, handleFocus, handleBlur, eventsCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview checkbox-demo-stage">
      <p class="preview-label">事件预览</p>
      <ClientOnly>
        <BingCheckbox
          v-model="eventChecked"
          label="接收通知"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </ClientOnly>
      <p class="checkbox-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>切换、聚焦或失焦时，事件状态会更新。</p>
    </div>
  </div>

  <BingCodeBlock :code="eventsCode" language="vue" title="代码示例" wrap />
</template>
