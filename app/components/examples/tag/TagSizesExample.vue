<script setup lang="ts">
import { BingCodeBlock, BingTag } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizeValues, sizesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸对比</p>
      <div class="tag-demo-row">
        <ClientOnly>
          <BingTag
            v-for="size in sizeValues"
            :key="size"
            :size="size"
            tone="secondary"
            variant="soft"
            :label="`${size} 标签`"
          />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="sizesCode" language="vue" title="代码示例" wrap />
</template>
