<script setup lang="ts">
import { onActivated, onDeactivated, ref, type Component } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'
defineProps<{ preview: Component; source: string }>()
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>

<template>
  <ClientOnly v-if="active">
    <div class="doc-example doc-example--wide">
      <div class="doc-example__preview" style="grid-column: 1 / -1"><component :is="preview" /></div>
    </div>
  </ClientOnly>
  <BingCodeBlock :code="source.trim()" language="vue" title="代码示例" wrap />
</template>
