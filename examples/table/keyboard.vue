<script setup lang="ts">
import { reactive, ref } from 'vue'
import { BingButton, BingInput, BingTable, type BingTableColumn, type BingTableExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const table = ref<BingTableExpose>()
const rows = reactive([{ id: 'design', title: '设计稿', note: '待评审' }, { id: 'code', title: '实现', note: '开发中' }])
const columns: BingTableColumn[] = [{ key: 'title', title: '任务', sortable: true, width: 180 }, { key: 'note', title: '可编辑备注', width: 300, ellipsis: false }]
function edit(id: unknown, value: unknown) { const row = rows.find(row => row.id === id); if (row) row.note = String(value ?? '') }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <p>Tab 进入网格，方向键移动；F2 / Enter 进入输入框，Esc 返回单元格。输入框旁按钮保留自然宽度。</p>
    <BingButton variant="secondary" @click="table?.focusCell('design', 'note')">定位第一条备注</BingButton>
    <BingTable ref="table" :data="rows" :columns="columns" ariaLabel="键盘编辑表格">
      <template #cell-note="{ row }"><div style="display: flex; gap: 8px; min-width: 0">
        <BingInput :model-value="String(row.note)" :ariaLabel="String(row.title) + '备注'" style="min-width: 0; flex: 1" @update:model-value="edit(row.id, $event)" />
        <BingButton size="sm" variant="ghost" @click="edit(row.id, '')">清空</BingButton>
      </div></template>
    </BingTable>
  </div>
</template>
