<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/resizable/controlled.vue'
import source from '~~/examples/resizable/controlled.vue?raw'
const code = source.trim()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview"><ClientOnly><Example /></ClientOnly></div>
  </div>
  <BingCodeBlock :code="code" language="vue" title="代码示例" wrap />
</template>
