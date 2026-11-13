<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import slotSource from '~~/examples/form-item/slot.vue?raw'
import SlotExample from '~~/examples/form-item/slot.vue'

const slotCode = slotSource.replaceAll('\r\n', '\n').trim()
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview form-demo-panel">
      <ClientOnly><SlotExample /></ClientOnly>
    </div>
  </div>
  <BingCodeBlock :code="slotCode" language="vue" title="代码示例" wrap />
</template>
