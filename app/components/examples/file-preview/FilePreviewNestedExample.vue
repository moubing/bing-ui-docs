<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/file-preview/nested.vue'
import source from '~~/examples/file-preview/nested.vue?raw'
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview file-preview-demo-stage"><ClientOnly><Example /></ClientOnly></div>
  </div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
