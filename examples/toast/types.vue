<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { BingButton, BingToast, useBingToast, type BingToastType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const toast = useBingToast()
const types: BingToastType[] = ['default', 'success', 'error', 'loading', 'warning', 'info']
const methods = { default: toast.show, success: toast.success, error: toast.error,
  loading: toast.loading, warning: toast.warning, info: toast.info }
const ownedIds = new Set<string>()
function show(type: BingToastType) { ownedIds.add(methods[type]({ message: `${type} 消息`, ariaLabel: type })) }
onBeforeUnmount(() => ownedIds.forEach(id => toast.close(id)))
</script>

<template>
  <div class="actions"><BingButton v-for="type in types" :key="type" :throttle="false" @click="show(type)">{{ type }}</BingButton></div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
