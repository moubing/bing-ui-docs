<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'
import Basic from '~~/examples/autocomplete/basic.vue'
import Controlled from '~~/examples/autocomplete/controlled.vue'
import Actions from '~~/examples/autocomplete/actions.vue'
import basicSource from '~~/examples/autocomplete/basic.vue?raw'
import controlledSource from '~~/examples/autocomplete/controlled.vue?raw'
import actionsSource from '~~/examples/autocomplete/actions.vue?raw'
defineProps<{ controlled?: boolean; actions?: boolean }>()
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>
<template>
  <div class="doc-example"><div class="doc-example__preview"><ClientOnly><component :is="actions ? Actions : controlled ? Controlled : Basic" v-if="active" /></ClientOnly></div></div>
  <BingCodeBlock :code="(actions ? actionsSource : controlled ? controlledSource : basicSource).trim()" language="vue" title="完整示例" wrap />
</template>
