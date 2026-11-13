<script setup lang="ts">
import { BingCodeBlock, BingTextarea } from '@moubing/bing-ui'
import { useExamples } from './state'
const { fixedValue, autosizeValue, countValue, autosizeCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">高度策略</p>
      <div class="textarea-demo-stack">
        <ClientOnly>
          <BingTextarea v-model="fixedValue" :rows="4" resize="vertical" block />
          <BingTextarea v-model="autosizeValue" autosize :rows="3" block />
          <BingTextarea
            v-model="countValue"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :max-length="80"
            show-count
            block
          />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="autosizeCode" language="vue" title="代码示例" wrap />
</template>
