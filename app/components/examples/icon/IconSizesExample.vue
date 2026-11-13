<script setup lang="ts">
import { BingCodeBlock, BingIcon } from '@moubing/bing-ui'
import { useExamples } from './state'
const { iconMap, tokenSizes, sizeCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">尺寸对比</p>
      <div class="icon-size-row">
        <ClientOnly>
          <span v-for="size in tokenSizes" :key="size" class="icon-size-item">
            <BingIcon :icon="iconMap.star" :size="size" tone="primary" />
            <code>{{ size }}</code>
          </span>
          <span class="icon-size-item">
            <BingIcon :icon="iconMap.star" :size="28" tone="primary" />
            <code>28</code>
          </span>
          <span class="icon-size-item">
            <BingIcon :icon="iconMap.star" size="36px" tone="primary" />
            <code>36px</code>
          </span>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="sizeCode" language="vue" title="代码示例" wrap />
</template>
