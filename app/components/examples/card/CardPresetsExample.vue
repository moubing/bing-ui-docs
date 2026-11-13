<script setup lang="ts">
import { BingCard, BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { entrances, presetsCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">预设对比</p>
      <div class="card-demo-grid">
        <ClientOnly>
          <BingCard
            v-for="entrance in entrances"
            :key="entrance"
            :title="entrance"
            :entrance="entrance"
            :variant="entrance === 'rotate-up' ? 'sky' : 'soft'"
          >
            <p>不同入场动画适合不同的信息密度。</p>
          </BingCard>
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="presetsCode" language="vue" title="代码示例" wrap />
</template>
