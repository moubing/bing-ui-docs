<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import SmoothExample from '~~/examples/scrollbar/smooth.vue'
import { useExamples } from './state'
const { smoothCode } = useExamples()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview"><ClientOnly><SmoothExample /></ClientOnly></div>
  </div>

  <BingCodeBlock :code="smoothCode" language="vue" title="平滑配置与原生回退" wrap />
</template>
