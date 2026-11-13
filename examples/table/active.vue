<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, type BingTableKey } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const active = ref<BingTableKey | null>('v2')
const selected = ref<BingTableKey[]>(['v1', 'v2'])
const rows = [{ id: 'v1', name: '版本 1', description: '最初方案' }, { id: 'v2', name: '版本 2', description: '当前查看版本' }, { id: 'v3', name: '版本 3', description: '完善说明' }]
const columns = [{ key: 'name', title: '版本', width: 150 }, { key: 'description', title: '说明', width: 240 }]
</script>
<template>
  <BingTable v-model:active-row-key="active" v-model:selected-row-keys="selected" :data="rows" :columns="columns" selectable ariaLabel="活动版本表格" />
  <p role="status">当前版本：{{ active }}；批量选择：{{ selected.join(', ') }}</p>
  <p>点击普通单元格或 Enter 激活行，复选框只改变批量选择。活动行优先于浅色选中背景。</p>
</template>
