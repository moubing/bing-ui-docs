<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn, BingTableExpose, BingTableKey } from '@moubing/bing-ui'


type ProjectRow = {
  id: string
  project: string
  owner: string
  status: string
  progress: number
  budget: number
  risk: string
  disabled?: boolean
  children?: ProjectRow[]
}

const columns: BingTableColumn[] = [
  {
    key: 'project',
    title: '项目',
    width: 220,
    fixed: 'left',
    sortable: true,
    description: '树形列和主展示列。',
  },
  {
    key: 'owner',
    title: '负责人',
    width: 132,
    sortable: true,
  },
  {
    key: 'status',
    title: '状态',
    width: 126,
    sortable: true,
  },
  {
    key: 'progress',
    title: '进度',
    width: 118,
    align: 'right',
    sortable: true,
  },
  {
    key: 'budget',
    title: '预算',
    width: 132,
    align: 'right',
    sortable: true,
    sorter: (left, right) => Number(left.budget) - Number(right.budget),
  },
  {
    key: 'risk',
    title: '风险',
    width: 112,
    fixed: 'right',
  },
]

const tableData: ProjectRow[] = [
  {
    id: 'aurora',
    project: 'Aurora 画布',
    owner: '明夏',
    status: '设计中',
    progress: 72,
    budget: 128,
    risk: '低',
    children: [
      {
        id: 'aurora-motion',
        project: '动效规则',
        owner: '诺兰',
        status: '评审中',
        progress: 82,
        budget: 36,
        risk: '低',
      },
      {
        id: 'aurora-texture',
        project: '质感系统',
        owner: '小满',
        status: '原型中',
        progress: 54,
        budget: 42,
        risk: '中',
      },
    ],
  },
  {
    id: 'grid',
    project: 'Glass 数据表',
    owner: '欧文',
    status: '开发中',
    progress: 48,
    budget: 92,
    risk: '中',
  },
  {
    id: 'pulse',
    project: 'Telemetry Pulse',
    owner: '若依',
    status: '已发布',
    progress: 100,
    budget: 64,
    risk: '低',
  },
  {
    id: 'archive',
    project: 'Archive Refit',
    owner: '伊然',
    status: '阻塞',
    progress: 31,
    budget: 74,
    risk: '高',
    disabled: true,
  },
  {
    id: 'preview',
    project: 'Preview Rail',
    owner: '陶然',
    status: '规划中',
    progress: 18,
    budget: 48,
    risk: '中',
  },
]

const tableRef = ref<BingTableExpose | null>(null)

const exposeSelectedKeys = ref<BingTableKey[]>(['grid'])

const exposeExpandedKeys = ref<BingTableKey[]>(['aurora'])

const exposeLog = ref('等待方法调用')

function clearExposeSelection() {
  tableRef.value?.clearSelection()
  exposeLog.value = '已调用 clearSelection()'
}

function selectPreviewRow() {
  tableRef.value?.toggleRowSelection('preview', true)
  exposeLog.value = '已调用 toggleRowSelection("preview", true)'
}

function expandAurora() {
  tableRef.value?.toggleRowExpansion('aurora', true)
  exposeLog.value = '已调用 toggleRowExpansion("aurora", true)'
}

function resetExposeColumns() {
  tableRef.value?.resetColumns()
  exposeLog.value = '已调用 resetColumns()'
}

function scrollExposeTable() {
  tableRef.value?.scrollTo(160)
  exposeLog.value = '已调用 scrollTo(160)'
}

function getStatusTone(value: unknown) {
  if (value === '已发布') {
    return 'success'
  }

  if (value === '阻塞') {
    return 'danger'
  }

  if (value === '评审中') {
    return 'warning'
  }

  return 'secondary'
}
</script>

<template>
  <div class="table-example">
    <BingTable
      ref="tableRef"
      v-model:selected-row-keys="exposeSelectedKeys"
      v-model:expanded-row-keys="exposeExpandedKeys"
      :data="tableData"
      :columns="columns"
      row-key="id"
      selectable
      :max-height="280"
      ariaLabel="方法示例表格"
    >
      <template #cell-status="{ value }">
        <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
      </template>
    </BingTable>
    <div class="table-action-row">
      <BingButton size="sm" variant="secondary" @click="selectPreviewRow">选择 Preview</BingButton>
      <BingButton size="sm" variant="ghost" @click="clearExposeSelection">清空选择</BingButton>
      <BingButton size="sm" variant="secondary" @click="expandAurora">展开 Aurora</BingButton>
      <BingButton size="sm" variant="ghost" @click="resetExposeColumns">重置列</BingButton>
      <BingButton size="sm" variant="ghost" @click="scrollExposeTable">滚动</BingButton>
    </div>
    <p class="table-feedback">
      <span>{{ exposeLog }}</span>
    </p>
  </div>
</template>

<style scoped>
.table-example { padding: 16px; display: grid; gap: 16px; max-width: 1000px; min-width: 0; }
.table-demo-stage {
  gap: 1rem;
  min-width: 0;
}

.table-demo-stage .bing-table {
  min-width: 0;
}

.table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.86rem;
  font-weight: 760;
}

.table-toolbar strong {
  color: var(--bing-text, #334155);
  font-weight: 850;
}

.table-progress {
  display: grid;
  grid-template-columns: minmax(64px, 1fr) auto;
  gap: 0.5rem;
  align-items: center;
  min-width: 118px;
}

.table-progress > span {
  overflow: hidden;
  height: 7px;
  border-radius: 999px;
  background: var(--bing-surface-muted);
}

.table-progress > span::before {
  display: block;
  width: inherit;
  height: 100%;
  border-radius: inherit;
  background: var(--bing-accent);
  content: '';
}

.table-progress strong {
  color: var(--bing-text, #334155);
  font-size: 0.82rem;
  font-weight: 400;
}

.table-feedback {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  color: var(--bing-text-muted, #64748b);
  font-size: 0.9rem;
}

.table-feedback span {
  border: 1px solid var(--bing-border);
  border-radius: 6px;
  background: var(--bing-surface-soft);
  padding: 0.3rem 0.55rem;
}

.table-control-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem 1rem;
}

.table-control-grid .control-group {
  grid-column: 1 / -1;
}

.table-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}


</style>
