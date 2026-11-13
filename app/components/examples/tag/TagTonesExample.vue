<script setup lang="ts">
import { BingCodeBlock, BingTag } from '@moubing/bing-ui'
import { useExamples } from './state'
const { toneValues, tonesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">语义颜色</p>
      <div class="tag-demo-row">
        <ClientOnly>
          <BingTag
            v-for="tone in toneValues"
            :key="tone"
            :tone="tone"
            :variant="tone === 'primary' || tone === 'secondary' ? 'glass' : 'soft'"
            :label="tone"
          />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="tonesCode" language="vue" title="代码示例" wrap />
</template>
