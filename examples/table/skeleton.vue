<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const loading = ref(true)
const rows = ref<{ id: number; name: string }[]>([])
const columns = [{ key: 'name', title: '任务', width: 280 }]
function complete() { rows.value = [{ id: 1, name: '已接收的数据' }]; loading.value = false }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <div style="display: flex; gap: 8px; flex-wrap: wrap"><BingButton @click="complete">完成加载</BingButton><BingButton variant="secondary" @click="loading = true">再次刷新</BingButton></div>
    <BingTable :data="rows" :columns="columns" :loading="loading" loading-variant="skeleton" pagination :total="rows.length" ariaLabel="首次加载骨架" />
    <p>首次没有稳定数据时显示骨架，后续刷新保留旧行；减少动态效果时骨架静止。</p>
  </div>
</template>
