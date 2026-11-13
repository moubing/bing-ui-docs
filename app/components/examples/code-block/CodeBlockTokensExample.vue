<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import TokensExample from '~~/examples/code-block/tokens.vue'
import source from '~~/examples/code-block/tokens.vue?raw'
</script>

<template>
  <div class="doc-example"><div class="doc-example__preview"><ClientOnly><TokensExample /></ClientOnly></div></div>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
