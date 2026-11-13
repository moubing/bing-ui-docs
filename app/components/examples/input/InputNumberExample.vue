<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import Example from '~~/examples/input/number.vue'
import code from '~~/examples/input/number.vue?raw'
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview"><ClientOnly><Example /></ClientOnly></div>
  </div>
  <BingCodeBlock :code="code.trim()" language="vue" title="代码示例" wrap />
</template>
