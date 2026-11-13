<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import Example from '~~/examples/input/editing.vue'
import code from '~~/examples/input/editing.vue?raw'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>
<template>
  <div class="doc-example"><div class="doc-example__preview"><ClientOnly><Example v-if="active" /></ClientOnly></div></div>
  <DocsExampleCode :code="code.trim()" language="vue" title="代码示例" max-height="460px" />
</template>
