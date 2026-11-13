<script setup lang="ts">
import { BingCard, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { variants, variantsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">视觉类型</p>
      <div class="card-demo-grid">
        <ClientOnly>
          <BingCard
            v-for="variant in variants"
            :key="variant"
            :title="variant"
            :variant="variant"
            :glass="variant !== 'plain'"
            entrance="bubble"
          >
            <p>{{ variant }} 适合不同层级的信息展示。</p>
          </BingCard>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="variantsCode" language="vue" title="代码示例" wrap />
</template>
