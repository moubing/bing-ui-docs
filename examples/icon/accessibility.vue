<script setup lang="ts">
import { BingIcon } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
import { Bell, Search } from 'lucide-vue-next'
</script>

<template>
  <div style="display: flex; align-items: center; gap: 24px">
    <span><BingIcon :icon="Search" tone="muted" decorative />搜索</span>
    <BingIcon :icon="Bell" tone="warning" :decorative="false" label="打开通知" />
  </div>
</template>
