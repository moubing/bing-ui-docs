<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/cursor/scope.vue'
import source from '~~/examples/cursor/scope.vue?raw'
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview cursor-demo-stage"><ClientOnly><Example /></ClientOnly></div>
  </div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.cursor-demo-stage { display: block; min-width: 0; }
</style>
