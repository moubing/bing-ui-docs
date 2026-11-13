<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import Example from '~~/examples/drag-drop/basic.vue'
import code from '~~/examples/drag-drop/basic.vue?raw'
// 离开缓存页面时卸载预览，结束可能进行中的拖动。
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>

<template>
  <ClientOnly v-if="active"><div class="doc-example doc-example--stacked"><div class="doc-example__preview"><Example /></div></div></ClientOnly>
  <DocsExampleCode :code="code.trim()" language="vue" title="代码示例" max-height="520px" />
</template>
