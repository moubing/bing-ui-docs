<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingInput, BingSelect, BingTable, type BingTableColumn, type BingTableKey, type BingTableRow } from '@moubing/bing-ui'

const data = ref<BingTableRow[]>([
  { id: 'a', name: '整理新版组件文档并逐项复核所有示例与默认值', owner: '小林', status: 'draft' },
  { id: 'b', name: '检查浅色与深色主题', owner: '小陈', status: 'review' },
  { id: 'c', name: '完成发布前核对', owner: '小周', status: 'draft' },
])
const columns: BingTableColumn[] = [
  { key: 'name', title: '任务', width: 200 },
  { key: 'owner', title: '负责人', width: 176 },
  { key: 'status', title: '状态', width: 156 },
  { key: 'action', title: '操作', width: 112 },
]
const statuses = [{ value: 'draft', label: '草稿' }, { value: 'review', label: '复核中' }]
const selected = ref<BingTableKey[]>([])
const loading = ref(false)
const lastAction = ref('尚未操作')
const rowClicks = ref(0)

function receiveData() {
  data.value = [
    { id: 'next-a', name: '新批次：检查安装说明', owner: '小林', status: 'review' },
    { id: 'next-b', name: '新批次：检查主题切换', owner: '小周', status: 'draft' },
  ]
}
</script>

<template>
  <div class="controls-example">
    <div class="controls-toolbar">
      <BingButton size="sm" :disabled="loading" @click="loading = true">开始加载</BingButton>
      <BingButton size="sm" variant="secondary" :disabled="!loading" @click="receiveData">接收新数据</BingButton>
      <BingButton size="sm" variant="ghost" :disabled="!loading" @click="loading = false">结束加载</BingButton>
    </div>
    <BingTable :data="data" :columns="columns" :loading="loading" :virtual="false"
      v-model:selectedRowKeys="selected" selectable selectOnRowClick pagination :defaultPageSize="2"
      ariaLabel="任务编辑表格" @row-click="rowClicks++">
      <template #cell-owner="{ row }">
        <BingInput :modelValue="String(row.owner)" :ariaLabel="`负责人 ${row.id}`" size="sm" block
          @update:modelValue="row.owner = String($event ?? '')" />
      </template>
      <template #cell-status="{ row }">
        <BingSelect :modelValue="String(row.status)" :ariaLabel="`状态 ${row.id}`" :options="statuses"
          :clearable="false" :searchable="false" :width="128" size="sm"
          @update:modelValue="row.status = String($event ?? '')" />
      </template>
      <template #cell-action="{ row }">
        <BingButton size="xs" variant="secondary" @click="lastAction = `已检查 ${row.id}`">检查</BingButton>
      </template>
    </BingTable>
    <p role="status">已选：{{ selected.join(' / ') || '无' }}；{{ lastAction }}；行点击：{{ rowClicks }}</p>
  </div>
</template>

<style scoped>
.controls-example { display: grid; gap: 16px; width: 100%; max-width: 840px; min-width: 0; }
.controls-toolbar { display: flex; flex-wrap: wrap; gap: 8px; }
p { margin: 0; color: var(--bing-text-muted); font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
</style>
