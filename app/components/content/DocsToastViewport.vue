<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingToast, type BingToastEmits, type BingToastProps } from '@moubing/bing-ui'

const props = defineProps<BingToastProps>()
const emit = defineEmits<BingToastEmits>()
// 文档页使用 KeepAlive；停用页面时卸载 Teleport 视口，释放全局活动视口资格。
const active = ref(true)
onActivated(() => { active.value = true })
onDeactivated(() => { active.value = false })
</script>

<template>
  <BingToast v-if="active" v-bind="props" @close="emit('close', $event)" />
</template>
