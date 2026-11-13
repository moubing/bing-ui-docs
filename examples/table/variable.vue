<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable, type BingTableExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const table = ref<BingTableExpose>()
const rows = Array.from({ length: 300 }, (_, index) => ({ id: index + 1, name: '记录 ' + (index + 1), description: '允许自动换行的说明。'.repeat(index % 5 + 1) }))
const columns = [{ key: 'name', title: '记录', width: 120 }, { key: 'description', title: '变高内容', width: 260, ellipsis: false }]
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <BingButton variant="secondary" @click="table?.focusCell(300, 'description')">定位最后一行</BingButton>
    <BingTable ref="table" :data="rows" :columns="columns" virtual :virtual-row-height="48" :height="300" ariaLabel="变高虚拟行" />
    <p>48px 只用于未测量行的估计；实际高度按稳定 key 缓存，焦点行在滚动中保留。</p>
  </div>
</template>
