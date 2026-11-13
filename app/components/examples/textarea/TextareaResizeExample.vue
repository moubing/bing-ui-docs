<script setup lang="ts">
import { BingCodeBlock, BingTextarea } from '@moubing/bing-ui'
import { useExamples } from './state'
const { resizeValues, resizeCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">布局状态</p>
      <div class="textarea-demo-stack">
        <ClientOnly>
          <BingTextarea v-model="resizeValues.none" resize="none" ariaLabel="禁止拖拽" />
          <BingTextarea v-model="resizeValues.vertical" resize="vertical" status="success" ariaLabel="垂直调整" />
          <BingTextarea v-model="resizeValues.error" status="error" block ariaLabel="错误状态" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="resizeCode" language="vue" title="代码示例" wrap />
</template>
