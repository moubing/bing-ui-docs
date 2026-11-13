<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/scrollbar/viewport.vue'
import source from '~~/examples/scrollbar/viewport.vue?raw'
</script>

<template>
  <div class="doc-example doc-example--stacked"><div class="doc-example__preview scrollbar-demo-stage"><ClientOnly><Example /></ClientOnly></div></div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
