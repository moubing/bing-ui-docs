<script setup lang="ts">
import { BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'virtual' | 'maxHeight' | 'virtualRowHeight' | 'virtualOverscan'>
// @docs-options:start
const options: ExampleOptions = {
  "virtual": true,
  "maxHeight": 420,
  "virtualOverscan": 6
}
// @docs-options:end

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

const virtualRows = Array.from({ length: 260 }, (_, index) => ({
  id: `row-${index + 1}`,
  project: `生成行 ${index + 1}`,
  owner: ['明夏', '欧文', '若依', '小满'][index % 4],
  status: ['设计中', '开发中', '评审中', '已发布'][index % 4],
  progress: (index * 7) % 101,
  budget: 48 + (index % 19) * 4,
  risk: ['低', '中', '高'][index % 3],
}))

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
      :data="virtualRows"
      :columns="columns"
      row-key="id"
      :virtual="options.virtual"
      :virtual-row-height="options.virtualRowHeight"
      :virtual-overscan="options.virtualOverscan"
      :max-height="options.maxHeight"
      :pagination="false"
      ariaLabel="大量项目表格"
    >
      <template #toolbar>
        <div class="table-toolbar">
          <strong>大量数据</strong>
          <span>{{ virtualRows.length }} 行</span>
        </div>
      </template>
      <template #cell-progress="{ value }">{{ value }} %</template>
      <template #cell-budget="{ value }">{{ value }} 万</template>
      <template #cell-risk="{ value }">
        <BingTag :tone="getRiskTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
      </template>
    </BingTable>
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
