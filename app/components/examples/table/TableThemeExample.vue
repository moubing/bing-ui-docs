<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import Example from '~~/examples/table/theme.vue'
import code from '~~/examples/table/theme.vue?raw'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>
<template>
  <div class="doc-example"><div class="doc-example__preview"><ClientOnly><Example v-if="active" /></ClientOnly></div></div>
  <DocsExampleCode :code="code.trim()" language="vue" title="代码示例" max-height="460px" />
</template>
