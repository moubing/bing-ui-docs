<script setup lang="ts">
import { BingCodeBlock, BingIcon } from '@moubing/bing-ui'
import { useExamples } from './state'
const { iconMap, toneValues, toneCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">色调对比</p>
      <div class="icon-tone-grid">
        <ClientOnly>
          <span v-for="tone in toneValues" :key="tone" class="icon-tone-item">
            <BingIcon :icon="iconMap.sparkles" size="lg" :tone="tone" />
            <code>{{ tone }}</code>
          </span>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="toneCode" language="vue" title="代码示例" wrap />
</template>
