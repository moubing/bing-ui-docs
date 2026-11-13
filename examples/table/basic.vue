<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn, BingTableKey, BingTablePageChangePayload, BingTableSelectionPayload, BingTableSortOrder, BingTableSortPayload } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'size' | 'bordered' | 'striped' | 'selectable' | 'selectOnRowClick' | 'pagination' | 'loading' | 'preservePageHeight' | 'showColumnControls'>
// @docs-options:start
const options: ExampleOptions = {
  "size": "md",
  "bordered": false,
  "striped": true,
  "selectable": true,
  "selectOnRowClick": false,
  "pagination": true,
  "loading": false,
  "preservePageHeight": true,
  "showColumnControls": true
}
// @docs-options:end

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

const basicSelectedKeys = ref<BingTableKey[]>([])

const basicExpandedKeys = ref<BingTableKey[]>(['aurora'])

const basicPage = ref(1)

const basicPageSize = ref(3)

const basicColumnWidths = ref<Record<string, number>>({})

const basicColumnOrder = ref<string[]>([])

const basicHiddenColumns = ref<string[]>([])

const basicColumnFixed = ref<Record<string, 'left' | 'right' | null>>({})

const basicSortKey = ref<string | null>(null)

const basicSortOrder = ref<BingTableSortOrder>(null)

const basicLog = ref('等待交互')

const basicSelectionText = computed(() => basicSelectedKeys.value.join('、') || '未选择')

const basicSortText = computed(() =>
  basicSortKey.value && basicSortOrder.value
    ? `${basicSortKey.value} / ${basicSortOrder.value}`
    : '未排序',
)

function handleSelectionChange(payload: BingTableSelectionPayload) {
  basicLog.value = `selection-change：已选择 ${payload.keys.length} 行`
}

function handleSortChange(payload: BingTableSortPayload) {
  basicLog.value = payload.key
    ? `sort-change：${payload.key} / ${payload.order}`
    : 'sort-change：已清除排序'
}

function handlePageChange(payload: BingTablePageChangePayload) {
  basicLog.value = `page-change：第 ${payload.page} 页，每页 ${payload.pageSize} 行`
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

function getRiskTone(value: unknown) {
  if (value === '高') {
    return 'danger'
  }

  if (value === '中') {
    return 'warning'
  }

  return 'success'
}
</script>

<template>
  <div class="table-example">
    <BingTable
      v-model:selected-row-keys="basicSelectedKeys"
      v-model:expanded-row-keys="basicExpandedKeys"
      v-model:page="basicPage"
      v-model:page-size="basicPageSize"
      v-model:column-widths="basicColumnWidths"
      v-model:column-order="basicColumnOrder"
      v-model:hidden-column-keys="basicHiddenColumns"
      v-model:column-fixed="basicColumnFixed"
      v-model:sort-key="basicSortKey"
      v-model:sort-order="basicSortOrder"
      :data="tableData"
      :columns="columns"
      row-key="id"
      row-disabled="disabled"
      :size="options.size"
      :bordered="options.bordered"
      :striped="options.striped"
      :selectable="options.selectable"
      :select-on-row-click="options.selectOnRowClick"
      :pagination="options.pagination"
      :loading="options.loading"
      :preserve-page-height="options.preservePageHeight"
      :show-column-controls="options.showColumnControls"
      :page-size-options="[3, 5, 10]"
      :max-height="420"
      empty-text="暂无项目"
      loading-text="正在加载项目"
      ariaLabel="项目表格"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @page-change="handlePageChange"
    >
      <template #toolbar="{ selectedRowKeys }">
        <div class="table-toolbar">
          <strong>项目列表</strong>
          <span>已选择 {{ selectedRowKeys.length }} 行</span>
        </div>
      </template>
      <template #cell-status="{ value }">
        <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
      </template>
      <template #cell-progress="{ value }">
        <span class="table-progress">
          <span :style="{ width: `${value}%` }"></span>
          <strong>{{ value }} %</strong>
        </span>
      </template>
      <template #cell-budget="{ value }">{{ value }} 万</template>
      <template #cell-risk="{ value }">
        <BingTag :tone="getRiskTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
      </template>
    </BingTable>
    <p class="table-feedback">
      <span>选择： {{ basicSelectionText }}</span>
      <span>排序： {{ basicSortText }}</span>
      <span>{{ basicLog }}</span>
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
