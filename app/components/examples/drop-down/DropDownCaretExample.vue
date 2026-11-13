<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import CaretExample from '~~/examples/drop-down/caret.vue'
import source from '~~/examples/drop-down/caret.vue?raw'
import { useExamples } from './state'
const { examplesActive } = useExamples()
</script>

<template>
  <div class="doc-example"><div class="doc-example__preview"><ClientOnly v-if="examplesActive"><CaretExample /></ClientOnly></div></div>
  <BingCodeBlock :code="source.trim()" language="vue" title="虚拟锚点示例" wrap />
</template>
