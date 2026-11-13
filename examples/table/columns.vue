<script setup lang="ts">
import { BingCursor, BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'resizableColumns' | 'reorderableColumns' | 'showColumnControls' | 'bordered'>
// @docs-options:start
const options: ExampleOptions = {
  "resizableColumns": true,
  "reorderableColumns": true,
  "showColumnControls": true,
  "bordered": true
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

const wideColumns: BingTableColumn[] = [
  { key: 'project', title: '项目', width: 210, fixed: 'left', sortable: true },
  { key: 'owner', title: '负责人', width: 126, sortable: true },
  { key: 'stage', title: '阶段', width: 126 },
  { key: 'region', title: '区域', width: 120 },
  { key: 'channel', title: '渠道', width: 136 },
  { key: 'launch', title: '上线', width: 124, align: 'right' },
  { key: 'north', title: '北区', width: 120, align: 'right' },
  { key: 'south', title: '南区', width: 120, align: 'right' },
  { key: 'east', title: '东区', width: 120, align: 'right' },
  { key: 'west', title: '西区', width: 120, align: 'right' },
  { key: 'conversion', title: '转化', width: 126, align: 'right' },
  { key: 'retention', title: '留存', width: 126, align: 'right' },
  { key: 'forecast', title: '预测', width: 132, align: 'right' },
  { key: 'risk', title: '风险', width: 110, fixed: 'right' },
]

const wideRows = Array.from({ length: 14 }, (_, index) => ({
  id: `wide-${index + 1}`,
  project: ['Aurora 分析', 'Canvas 商业化', 'Motion Inbox', 'Texture Planner'][index % 4],
  owner: ['明夏', '诺兰', '小满', '欧文'][index % 4],
  stage: ['发现', '设计', '开发', '验收', '发布'][index % 5],
  region: ['华东', '华南', '北美', '欧洲'][index % 4],
  channel: ['直营', '伙伴', '市场', '社区'][index % 4],
  launch: `2026-Q${(index % 4) + 1}`,
  north: `${82 + index * 3} 万`,
  south: `${64 + index * 4} 万`,
  east: `${72 + index * 5} 万`,
  west: `${58 + index * 3} 万`,
  conversion: `${18 + (index % 9) * 3}%`,
  retention: `${62 + (index % 7) * 4}%`,
  forecast: `${180 + index * 12} 万`,
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
    <BingCursor>
      <BingTable
        :data="wideRows"
        :columns="wideColumns"
        row-key="id"
        :max-height="360"
        :bordered="options.bordered"
        :resizable-columns="options.resizableColumns"
        :reorderable-columns="options.reorderableColumns"
        :show-column-controls="options.showColumnControls"
        ariaLabel="宽项目指标表格"
      >
        <template #cell-risk="{ value }">
          <BingTag :tone="getRiskTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
        </template>
      </BingTable>
    </BingCursor>
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
