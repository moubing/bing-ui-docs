<script setup lang="ts">
import { BingCheckbox, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { decorativeCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">装饰状态</p>
      <div class="checkbox-decorative-row">
        <ClientOnly>
          <BingCheckbox decorative :model-value="false" size="sm" />
          <BingCheckbox decorative :model-value="true" size="md" />
          <BingCheckbox decorative :model-value="false" indeterminate size="lg" tone="secondary" />
          <BingCheckbox decorative :model-value="true" shape="circle" :size="34" />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="decorativeCode" language="vue" title="代码示例" wrap />
</template>
