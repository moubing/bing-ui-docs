<script setup lang="ts">
import { BingButton, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { sizes, roundedItems, sizesCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸</p>
      <div class="button-demo-row">
        <ClientOnly>
          <BingButton v-for="size in sizes" :key="size" :size="size">
            {{ size.toUpperCase() }}
          </BingButton>
        </ClientOnly>
      </div>
    </div>

    <div class="doc-example__preview">
      <p class="preview-label">圆角</p>
      <div class="button-demo-row">
        <ClientOnly>
          <BingButton
            v-for="rounded in roundedItems"
            :key="rounded"
            variant="secondary"
            :rounded="rounded"
          >
            {{ rounded }}
          </BingButton>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="sizesCode" language="vue" title="代码示例" wrap />
</template>
