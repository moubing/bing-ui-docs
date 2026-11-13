<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable, type BingTableColumn, type BingTableExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const table = ref<BingTableExpose>()
const rows = Array.from({ length: 30 }, (_, index) => ({ id: index + 1, name: '任务 ' + (index + 1), owner: '负责人', description: '键盘滚入时避开固定列', action: '查看' }))
const columns: BingTableColumn[] = [{ key: 'name', title: '任务', fixed: 'left', width: 140 }, { key: 'owner', title: '负责人', width: 200 }, { key: 'description', title: '说明', width: 360 }, { key: 'action', title: '操作', fixed: 'right', width: 100 }]
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0; max-width: 560px">
    <BingButton variant="secondary" @click="table?.focusCell(30, 'description')">定位末行说明</BingButton>
    <BingTable ref="table" :data="rows" :columns="columns" :height="260" column-controls-placement="toolbar" ariaLabel="固定列焦点可见性" />
    <p>方向键遍历、Home / End、F2 / Esc；焦点环在单元格内，普通内容滚入可阅读区域。列宽分隔条可用左右键或双击自适应。</p>
  </div>
</template>
