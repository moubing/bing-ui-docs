<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import AutoFocusExample from '~~/examples/form/auto-focus.vue'
import source from '~~/examples/form/auto-focus.vue?raw'
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview form-demo-panel">
      <ClientOnly><AutoFocusExample /></ClientOnly>
    </div>
  </div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
