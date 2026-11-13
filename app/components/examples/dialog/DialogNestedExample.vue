<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/dialog/nested.vue'
import source from '~~/examples/dialog/nested.vue?raw'
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dialog-demo-stage"><ClientOnly><Example /></ClientOnly></div>
  </div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
