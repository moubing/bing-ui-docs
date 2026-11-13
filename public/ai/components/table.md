# BingTable

> 目标组件包：@moubing/bing-ui 0.19.0；文档修订：r3。
> 已验证：已完成 0.19.0 的文档与示例验证。

此文件由正文、API 数据和完整示例自动生成，可直接阅读，不需要启动文档站。修改源文件后运行 pnpm docs:export table；请勿手工修改生成结果。

运行示例需要已配置 Vue 3 单文件组件的项目，依赖 Vue 3.5 与 GSAP 3.15 系列，导入 zod 的示例另需安装 Zod 4（Bing UI 的可选 peer 依赖）；Bing UI 使用上方标注的版本。示例已导入组件和样式，不依赖 Nuxt 别名、文档站组件或组件自动注册。十六个 Vue 代码块是独立示例，分别保存为一个 .vue 文件使用。TypeScript 项目需配置 CSS 导入类型声明，例如 Vite 项目的 vite/client。

options 是演示参数，数据和列定义完整内置。树形例子独立维护展开值。组件不加载远程数据，分页按顶层行计算；所有受控状态均须同步对应更新。

BingTable 是数据表格组件，用于展示结构化数据，并处理选择、排序、树形展开、分页、虚拟滚动、固定列、列宽调整和列设置。它把行数据、列配置和交互状态拆开管理，适合中后台列表、配置矩阵和带层级的数据视图。

## 基础表格

`columns` 定义列，`data` 提供行数据，`rowKey` 提供稳定行标识。常用状态都可以用 `v-model` 受控，例如选择、展开、分页、排序和列设置。

本例完整绑定选择、展开、分页、排序和列设置。每页 3 条表示 3 个顶层项目，展开子项额外显示；父子选择不级联。表头全选覆盖当前页已展开的未禁用行，包括虚拟列表中尚未挂载的这些行，保留其他页、折叠子行和未知的已有键。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn, BingTableKey, BingTablePageChangePayload, BingTableSelectionPayload, BingTableSortOrder, BingTableSortPayload } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'size' | 'bordered' | 'striped' | 'selectable' | 'selectOnRowClick' | 'pagination' | 'loading' | 'preservePageHeight' | 'showColumnControls'>
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
```

## 树形行

行数据包含 `children` 时，Table 会按树形结构展平渲染。`treeColumnKey` 可以指定展开按钮和缩进出现在哪一列，`expandedRowKeys` 用于受控展开状态。

树形示例单独维护展开值。rowKey 必须全树唯一且稳定；回调 index 为原始同级序号，path 为原始树路径，不随分页、展开和排序变化。动态数据优先用行字段。默认排序只处理顶层 data，不递归排序 children。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn, BingTableKey } from '@moubing/bing-ui'


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

const treeExpandedKeys = ref<BingTableKey[]>(['aurora'])

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
      v-model:expanded-row-keys="treeExpandedKeys"
      :data="tableData"
      :columns="columns.slice(0, 4)"
      row-key="id"
      children-key="children"
      tree-column-key="project"
      :pagination="false"
      bordered
      :max-height="320"
      ariaLabel="树形项目表格"
    >
      <template #cell-status="{ value }">
        <BingTag :tone="getStatusTone(value)" size="sm" variant="soft">{{ value }}</BingTag>
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
```

## 固定列和列设置

列可以通过 `fixed` 固定在左右两侧，也可以通过列设置面板隐藏、排序和固定。`resizableColumns` 开启后，表头右侧的分隔手柄支持拖动和键盘调整列宽。

`reorderableColumns` 只控制列顺序调整，不控制列内容排序、表头说明或列宽调整。下方示例使用局部 `BingCursor`，可切换“允许拖动列顺序”观察表头和排序按钮的光标。

从 `0.9.1` 起，关闭列拖拽时直接使用普通表头，保留 `columnheader` 语义和默认光标，排序按钮仍显示手形并可点击。旧版 `0.9.0` 会将整个表头误标为禁用，导致配合 `BingCursor` 使用时出现禁用光标。

columnControlsPlacement 默认 auto：有分页放页脚，否则优先 toolbar 插槽，最后放表头右上角；显式 toolbar 会创建工具栏，footer 保留旧页脚入口。showColumnControls=false 完全隐藏入口。分页宽度不超过 540px 时隐藏首末页和“每页条数”文字。列面板拖拽使用独立浮层，键盘排序操作“调整列顺序”手柄。

多个分组表格可使用独立的 [BingTableColumnControls](/docs/components/table-column-controls)，把四个列模型绑定到同一份业务状态，并关闭每个表格的 showColumnControls。入口不依赖首个分组是否展开；表格内部也复用同一个组件。

列宽字符串也按 parseFloat 解析为像素；例如 50% 不代表一半宽度。左固定、普通、右固定各自成组，拖拽不能破坏这个分组。列设置面板至少保留一列，但外部 hiddenColumnKeys 可以隐藏全部。分隔手柄的左右键每次调整 12px。

窄屏同时固定多列时，固定区域可能遮住大部分普通列。可在列设置中取消固定；业务也可以按可用宽度传入 columnFixed 覆盖，以 null 取消指定列的固定。

```vue
<script setup lang="ts">
import { BingCursor, BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'resizableColumns' | 'reorderableColumns' | 'showColumnControls' | 'bordered'>
const options: ExampleOptions = {
  "resizableColumns": true,
  "reorderableColumns": true,
  "showColumnControls": true,
  "bordered": true
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
```

## 虚拟滚动

`virtual` 可以设置为 `true`、`false` 或 `auto`。auto 在行数超过 virtualThreshold 后启用；virtualRowHeight 只用于未测量行的预估。

`smoothScroll` 默认开启，作用于主视口的纵向与横向滚动，并同时覆盖列设置列表；设为 `false` 可关闭。直接拖动滚动轨道或开始相关交互时会停止当前平滑动画。

0.7.0 减少了滚动时的重复渲染与单元格测量，列宽拖动按帧更新，松手时提交最终位置。平滑滚动、列拖拽落位、分页过渡、截断文字提示和键盘操作继续保留，无需为使用性能优化而关闭交互。

虚拟化按当前页展开后的集合判断，仅减少 DOM；本地排序仍处理 data。未提供 maxHeight 时回退 520px。size 决定最小行高 36/40/44px，实测高度按 key 缓存，支持换行与变高行并保持滚动锚点。本例估计行高留空时使用尺寸默认值。1 万行是当前计算优化目标；5 万行文本排序可能超过一帧，应考虑 remoteSort，不能把本机计算耗时当作设备保证。

```vue
<script setup lang="ts">
import { BingTable, BingTag } from '@moubing/bing-ui'
import type { BingTableColumn } from '@moubing/bing-ui'
import type { BingTableProps } from '@moubing/bing-ui'

type ExampleOptions = Pick<BingTableProps, 'virtual' | 'maxHeight' | 'virtualRowHeight' | 'virtualOverscan'>
const options: ExampleOptions = {
  "virtual": true,
  "maxHeight": 420,
  "virtualOverscan": 6
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
```

## 单元格控件与加载

列默认启用 ellipsis。实际文字被截断时，悬停或聚焦单元格可查看全文，提示读取插槽最终渲染的文字。含按钮、输入框或选择器的单元格保留控件和焦点框，不自动包裹全文提示；控件自己的宽度仍需与列宽配合。

开启 selectOnRowClick 后，点击控件不会顺带切换行选择。row-click 仍会先发送，若业务监听它来打开详情，应自行过滤控件来源，或在独立操作上使用 @click.stop。自定义非原生操作区可加 data-bing-table-row-click-ignore，阻止自动选择和激活。

下面按“开始加载 → 接收新数据 → 结束加载”模拟请求的三个阶段。loading 期间保留上次稳定的数据与表格高度，滚动区域设为 inert，分页和页大小控件暂停交互；接收到的新 data 在加载结束后显示。加载提示延迟约 150ms 出现，出现后至少保留约 250ms，短请求也会立即进入忙碌状态。顶部业务工具栏、底部列设置与实例方法不由 loading 统一禁用。

```vue
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
```

## 实例方法

通过 ref 可以从外部控制选择、展开、列状态和滚动位置。这些方法适合接入批量操作、快捷按钮或表单校验后的定位逻辑。

```vue
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
```

| 方法                                      | 类型                                                                           | 说明                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| `clearSelection()`                      | `() => void`                                                                 | 清空所有键，发送更新和 selection-change；不要求 selectable=true。       |
| `toggleRowSelection(key, selected?)`    | `(key: BingTableKey, selected?: boolean) => void`                            | 查找当前 data（包含折叠子行），未知键或禁用行忽略；未传 selected 时切换。受控模式仍需响应更新。 |
| `toggleRowExpansion(key, expanded?)`    | `(key: BingTableKey, expanded?: boolean) => void`                            | 仅有 children 的行可展开；未知键或叶子无操作。                            |
| `resetColumns()`                        | `() => void`                                                                 | 恢复 default 列宽、顺序、隐藏和固定基线，只发送四个 update 事件；不会清除选择或排序。     |
| `scrollTo(top)`                         | `(top: number) => void`                                                      | 主视口纵向滚动，负数取 0；挂载前无作用，不提供横向坐标或返回 Promise。                |
| `focusCell(rowKey, column?)`            | `(rowKey: BingTableKey \| null, column?: string \| number) => Promise<void>` | 当前页定位；null 为表头，column 可为 key 或含选择列的零基索引；不自动换页或展开祖先。     |
| `scrollToRow(key)`                      | `(key: BingTableKey) => void`                                                | 滚入当前页的可见树行，避开固定列、表头和轨道。                                 |
| `autoFitColumn(key) / autoFitColumns()` | `(key: string) => void / () => void`                                         | 测量表头及当前已渲染内容，受 minWidth / maxWidth 约束；不测量未知远程行或虚拟窗口外内容。 |
| `selectAllPages()`                      | `() => void`                                                                 | 本地枚举可选行；远程进入 allPages + excludedKeys 模式。                |

## 远程排序与分页

`remoteSort` 与 `remotePagination` 独立：前者只停止本地排序，仍保留排序状态和事件；后者只停止本地分页切片。服务器提供排序后的当前页数据时同时开启两者，并传入真实 `total`。监听一次 `page-change` 发请求，不再同时监听两个页码模型更新发请求。排序变更后由业务重置页码并发起查询。

示例模拟服务端按字符串排序，REQ-10 排在 REQ-2 前。表格不再对该顺序做二次排序。请求中保留旧行；关闭补位后末页只显示实际行，空结果显示空状态。取消排序会传出 key/order 均为 null。

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingTable } from '@moubing/bing-ui'
import type { BingTablePageChangePayload, BingTableSortPayload, BingTableSortOrder } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const columns = [{ key: 'title', title: '文档编号', sortable: true, width: 280, ellipsis: false },
  { key: 'owner', title: '负责人', width: 180 }]
const source = [
  { id: 2, title: 'REQ-2', owner: '林晓' }, { id: 1, title: 'REQ-1', owner: '周宁' },
  { id: 20, title: 'REQ-20', owner: '林晓' }, { id: 10, title: 'REQ-10', owner: '周宁' },
  { id: 3, title: 'REQ-3', owner: '林晓' },
]
const items = ref(source.slice(0, 2))
const page = ref(1)
const pageSize = ref(2)
const sortKey = ref<string | null>(null)
const sortOrder = ref<BingTableSortOrder>(null)
const loading = ref(false)
const requests = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined
function query() {
  clearTimeout(timer)
  requests.value++
  loading.value = true
  // 仅在示例中模拟服务端字符串排序。实际应用将分页与排序条件发送给接口。
  timer = setTimeout(() => {
    const ordered = sortOrder.value ? [...source].sort((a, b) => {
      const result = a.title < b.title ? -1 : a.title > b.title ? 1 : 0
      return sortOrder.value === 'asc' ? result : -result
    }) : source
    items.value = ordered.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
    loading.value = false
  }, 320)
}
function onPageChange(next: BingTablePageChangePayload) {
  page.value = next.page
  pageSize.value = next.pageSize
  query()
}
function onSortChange(next: BingTableSortPayload) {
  sortKey.value = next.key
  sortOrder.value = next.order
  page.value = 1
  query()
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div>
    <BingTable :columns="columns" :data="items" pagination remote-pagination remote-sort
      :page="page" :page-size="pageSize" :total="source.length" :default-page-size="2" :page-size-options="[2, 3, 10]"
      :sort-key="sortKey" :sort-order="sortOrder" :loading="loading"
      :preserve-page-height="false" :virtual="false" :show-column-controls="false"
      @page-change="onPageChange" @sort-change="onSortChange" ariaLabel="远程文档列表" />
    <p role="status">模拟请求：{{ requests }}；排序：{{ sortOrder ?? '默认' }}</p>
  </div>
</template>
```

## 键盘导航与单元格编辑

| 操作              | 按键                                 |
| --------------- | ---------------------------------- |
| 进入 / 离开网格       | Tab / Shift+Tab                    |
| 移动单元格           | 方向键                                |
| 行首 / 行尾         | Home / End                         |
| 表头起点 / 最后行末尾    | Ctrl / ⌘+Home / End                |
| 按视口移动           | PageUp / PageDown                  |
| 切换选择 / 范围选择     | Space / Shift+Space                |
| 选择当前页           | Ctrl / ⌘+A                         |
| 激活普通行 / 进入控件    | Enter / F2                         |
| 编辑模式内循环 / 返回单元格 | Tab、Shift+Tab / Esc                |
| 树行展开 / 收起       | 右 / 左                              |
| 列头排序            | Enter / Space                      |
| 同固定分组内移列        | Ctrl / ⌘+Shift+左 / 右               |
| 列头调宽            | Alt+左 / 右，Shift 为 48px（默认 12px）    |
| 宽度手柄            | 左 / 右、Shift+左 / 右、Home / End；双击自适应 |

排序列保留 aria-sort，sortDirections 默认 asc / desc / null。自适应只测量表头和已渲染内容，受 minWidth / maxWidth 约束。

```vue
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
```

## 级联与范围选择

selectionStrategy 默认 independent；cascade 聚合可选后代，仅叶子 key 进入模型。禁用节点不计入选择但不阻断其可选后代，单选保持独立。Shift 点击复选框、行选择或 Shift+Space 按当前可见顺序选择，排序、分页和数据变化会清除范围锚点。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, type BingTableKey } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const keys = ref<BingTableKey[]>([])
const rows = [{ id: 'project', name: '项目', children: [{ id: 'design', name: '设计' }, { id: 'code', name: '实现' }, { id: 'locked', name: '冻结项', disabled: true }] }]
const columns = [{ key: 'name', title: '工作项', width: 300 }]
</script>
<template>
  <BingTable v-model:selected-row-keys="keys" :data="rows" :columns="columns" selectable selection-strategy="cascade" row-disabled="disabled" default-expand-all tree-guides ariaLabel="级联选择树表" />
  <p role="status">叶子键：{{ keys.join(', ') || '无' }}</p>
  <p>父项聚合可选后代；禁用项跳过。Shift 点击或 Shift+Space 按可见顺序选择范围。</p>
</template>
```

## 远程跨页全选

toolbar 提供 selectAllPages / clearSelection / selectionCount。远程全选返回 allPages=true 与 excludedKeys，keys 不枚举未知数据；后端应以查询条件和排除项执行批量操作。示例筛选变化时退出全选，可用 allPagesSelected / excludedRowKeys 受控。

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { BingButton, BingTable, type BingTableKey, type BingTableSelectionPayload } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const page = ref(1)
const all = ref(false)
const excluded = ref<BingTableKey[]>([])
const keys = ref<BingTableKey[]>([])
const rows = computed(() => Array.from({ length: 3 }, (_, index) => ({ id: (page.value - 1) * 3 + index + 1, name: '当前查询记录 ' + ((page.value - 1) * 3 + index + 1) })))
const columns = [{ key: 'name', title: '记录', width: 260 }]
const payload = ref<BingTableSelectionPayload>({ keys: [], rows: [] })
function filter() { page.value = 1; keys.value = []; all.value = false; excluded.value = []; payload.value = { keys: [], rows: [] } }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <BingButton variant="secondary" @click="filter">模拟切换筛选并清空选择</BingButton>
    <BingTable v-model:page="page" v-model:selected-row-keys="keys" v-model:all-pages-selected="all" v-model:excluded-row-keys="excluded" :data="rows" :columns="columns" selectable pagination remote-pagination :page-size="3" :page-size-options="[3]" :total="30" ariaLabel="远程跨页选择" @selection-change="payload = $event">
      <template #toolbar="{ selectAllPages, clearSelection, selectionCount }">
        <div style="display: flex; gap: 8px; flex-wrap: wrap"><BingButton size="sm" @click="selectAllPages">选择全部 30 条</BingButton><BingButton size="sm" variant="ghost" @click="clearSelection">清空选择</BingButton><span>已选 {{ selectionCount }}</span></div>
      </template>
    </BingTable>
    <p role="status">allPages：{{ all }}；excludedKeys：{{ excluded.join(', ') || '无' }}；已缓存 {{ payload.rows.length }} 行</p>
    <p>这里仅模拟分页。真实批量接口应接收查询条件与 excludedKeys；rows 只含已加载数据，不能当作全部 30 条。</p>
  </div>
</template>
```

## 活动行与批量选择

activeRowKey / row-activate 用于当前查看项，与复选框选择独立。普通内容点击或 Enter 激活；嵌套控件和禁用行不激活，row-click 的 preventDefault 可取消默认激活。0.18.2 包含全文提示节点与外层可聚焦滚动容器的点击修复，升级时直接使用该补丁版本。

```vue
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
```

## 可变行高与定位

focusCell / scrollToRow 仅操作当前页可见树行，不自动换页或展开祖先；focusCell(null, column) 定位表头。column 可为列 key 或含选择列的零基序号。

```vue
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
```

## 错误、空数据与重试

error 与 emptyText 分开表达失败及正常空数据。默认重试按钮发出 retry；empty 插槽无参数，error 插槽接收 ，由业务加载数据。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingTable } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const error = ref<string | boolean>('示例请求失败，请重试')
const rows = ref<{ id: number; name: string }[]>([])
const columns = [{ key: 'name', title: '记录', width: 280 }]
function retry() { error.value = false; rows.value = [{ id: 1, name: '重试后加载成功' }] }
</script>
<template>
  <div style="display: grid; gap: 14px; min-width: 0">
    <BingTable :data="rows" :columns="columns" :error="error" ariaLabel="错误重试表格" @retry="retry" />
    <BingButton variant="secondary" @click="error = '示例请求失败，请重试'; rows = []">模拟失败</BingButton>
    <BingTable :data="[]" :columns="columns" :show-column-controls="false" ariaLabel="自定义空状态"><template #empty>当前没有记录，可以创建新条目。</template></BingTable>
  </div>
</template>
```

## 首次加载骨架

loadingVariant=skeleton 只在首次没有稳定数据时展示骨架，刷新保留旧行。减少动态效果时装饰停止，加载和错误通过同一隐藏 live region 通知。

```vue
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
```

## 焦点、滚动与列设置位置

焦点环位于单元格内；方向键与定位方法避开固定列、表头和滚动条。scrollbarGutter 默认 auto，仅溢出时预留，stable 保留原双向留白。强制颜色模式使用系统颜色。

```vue
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
```

## 公开主题变量

变量可设置在组件或祖先上，避免依赖内部 --\_table-\*。行状态优先级：禁用、活动、选中、悬停、斑马纹、基础背景。选中底色维持约 7%，通过复选框、活动标记和焦点环辨识；悬停不改变正文颜色。

| 变量                             | 默认含义                             |
| ------------------------------ | -------------------------------- |
| --bing-table-bg                | --bing-surface-solid             |
| --bing-table-header-bg         | --bing-surface-muted             |
| --bing-table-striped-bg        | --bing-surface-muted             |
| --bing-table-row-hover-bg      | --bing-surface-hover             |
| --bing-table-row-selected-bg   | accent 7% 混合表格底色                 |
| --bing-table-row-active-bg     | --bing-surface-active            |
| --bing-table-row-active-accent | --bing-accent                    |
| --bing-table-line              | --bing-border                    |
| --bing-table-line-strong       | --bing-border-strong             |
| --bing-table-focus-ring        | --bing-focus-ring                |
| --bing-table-radius            | 8px                              |
| --bing-table-row-height        | sm / md / lg：36 / 40 / 44px 最小高度 |
| --bing-table-cell-padding-x    | 10 / 12 / 14px                   |
| --bing-table-cell-padding-y    | 4 / 6 / 8px                      |
| --bing-table-head-height       | 32 / 36 / 40px 最小高度              |

全局 --bing-focus-ring 默认引用 --bing-accent，保留原 --bing-focus 柔和光晕。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BingTable, type BingTableKey } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const active = ref<BingTableKey | null>('active')
const selected = ref<BingTableKey[]>(['selected', 'active'])
const rows = [{ id: 'normal', name: '普通行' }, { id: 'selected', name: '选中行：浅底与复选框' }, { id: 'active', name: '活动行：标记与背景' }]
const columns = [{ key: 'name', title: '主题状态', width: 320 }]
</script>
<template>
  <BingTable class="table-theme-demo" v-model:active-row-key="active" v-model:selected-row-keys="selected" :data="rows" :columns="columns" selectable ariaLabel="表格公开主题变量" />
  <p>变量设置在组件或祖先上；活动行优先于选中行，悬停不改变文字颜色。不依赖内部 --_table-*。</p>
</template>
<style scoped>
.table-theme-demo {
  --bing-table-header-bg: var(--bing-surface-muted);
  --bing-table-row-selected-bg: color-mix(in srgb, var(--bing-accent) 7%, var(--bing-surface-solid));
  --bing-table-row-active-accent: var(--bing-accent);
  --bing-table-focus-ring: var(--bing-focus-ring);
  --bing-table-radius: 12px;
  --bing-table-cell-padding-x: 16px;
}
</style>
```

## Props

| 属性                                   | 类型                                       | 默认值                                    | 说明                                                                                                 |
| ------------------------------------ | ---------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `data`                               | `BingTableRow[]`                         | `[]`                                   | 表格数据源。支持 childrenKey 指定树形子节点。                                                                      |
| `columns`                            | `BingTableColumn[]`                      | `[]`                                   | 列定义，决定标题、宽度、固定列、排序、单元格字段和列级样式。                                                                     |
| `rowKey`                             | `string \| BingTableRowKeyGetter`        | `'id'`                                 | 稳定唯一行键。index 为原始同级序号，path 为原始树路径，不随排序、分页和展开改变。动态数据建议用稳定字段且全树唯一。                                    |
| `childrenKey`                        | `string`                                 | `'children'`                           | 树形子节点字段名。                                                                                          |
| `height`                             | `number \| string`                       | `undefined`                            | 主滚动视口固定高度；数字按 px，字符串作为 CSS 长度。                                                                     |
| `maxHeight`                          | `number \| string`                       | `undefined（虚拟模式下回退 520）`               | 主视口最大高度，未传且启用虚拟化时默认 520；工具栏和分页另占空间。                                                                |
| `smoothScroll`                       | `SmoothScrollValue`                      | `true`                                 | 为主视口的纵向、横向滚动和列设置列表启用平滑滚动；设为 false 可关闭。直接拖动滚动轨道或开始相关交互时会停止当前动画。                                     |
| `size`                               | `BingTableSize`                          | `undefined（继承 ConfigProvider，否则 'md'）` | 表格密度；表头高度 sm/md/lg 为 32/36/40px，默认数据行高为 36/40/44px。                                                |
| `bordered`                           | `boolean`                                | `false`                                | 边框和斑马纹。                                                                                            |
| `striped`                            | `boolean`                                | `true`                                 | 边框和斑马纹。                                                                                            |
| `loading`                            | `boolean`                                | `false`                                | 保留上次稳定数据与高度，主视口 inert、暂停分页；提示延迟约 150ms，显示后至少保留约 250ms。工具栏、列设置及实例方法仍可工作。                            |
| `emptyText`                          | `string`                                 | `'暂无数据'`                               | 加载态和空态文案。                                                                                          |
| `loadingText`                        | `string`                                 | `'正在加载数据'`                             | 加载态和空态文案。                                                                                          |
| `selectable`                         | `boolean`                                | `false`                                | 是否显示选择列。                                                                                           |
| `selectionMode`                      | `BingTableSelectionMode`                 | `'multiple'`                           | 多选或单选。                                                                                             |
| `selectedRowKeys`                    | `BingTableKey[]`                         | `undefined`                            | 受控选择键，使用对应 v-model 同步；默认父子独立，cascade 模式保存可选叶子。其他页的键不会自动清除。                                         |
| `defaultSelectedRowKeys`             | `BingTableKey[]`                         | `[]`                                   | 非受控选择的初始值，仅初始化读取。                                                                                  |
| `rowDisabled`                        | `BingTableRowDisabled`                   | `undefined`                            | 禁止行选择与激活，不禁止展开或 row-click。函数 index 为原始全树前序序号，建议按稳定字段判断。                                            |
| `selectOnRowClick`                   | `boolean`                                | `false`                                | 点击整行时切换选择；原生交互控件、role=button/combobox 或 data-bing-table-row-click-ignore 区域不触发自动选择，row-click 仍先发送。 |
| `selectionFixed`                     | `boolean`                                | `true`                                 | 选择列固定在左侧；虚拟化且无横向溢出时不额外绘制固定覆盖层。                                                                     |
| `selectionColumnWidth`               | `number`                                 | `54`                                   | 选择列宽度，内部最小 42px。                                                                                   |
| `expandedRowKeys`                    | `BingTableKey[]`                         | `undefined`                            | 受控展开键；仅影响树形显示，不改变 data。                                                                            |
| `defaultExpandedRowKeys`             | `BingTableKey[]`                         | `[]`                                   | 非受控展开的初始键，defaultExpandAll 可以覆盖。                                                                   |
| `defaultExpandAll`                   | `boolean`                                | `false`                                | 非受控展开时全展开；data、childrenKey 或此属性变化后会再次展开，不只是挂载时读取。                                                  |
| `treeColumnKey`                      | `string`                                 | `undefined`                            | 树形展开控制所在的可见列 key；未传时使用首个可见列。指定列被隐藏时不会自动选择另一列。                                                      |
| `indentSize`                         | `number`                                 | `22`                                   | 树形层级缩进。                                                                                            |
| `columnWidths`                       | `Record<string, number>`                 | `undefined`                            | 受控列宽；缺少某个键时回退内部默认宽度或列定义。                                                                           |
| `defaultColumnWidths`                | `Record<string, number>`                 | `{}`                                   | 初始宽度覆盖，也是 resetColumns 的基线。                                                                        |
| `columnOrder`                        | `string[]`                               | `undefined`                            | 受控列顺序，去重、去无效键、补遗漏键，再按左固定/普通/右固定分组显示。                                                               |
| `defaultColumnOrder`                 | `string[]`                               | `[]`                                   | 初始顺序；空数组按 columns 顺序，也是重置基线。                                                                       |
| `hiddenColumnKeys`                   | `string[]`                               | `undefined`                            | 受控隐藏键，传空数组会覆盖列定义 hidden 的初始隐藏效果。                                                                   |
| `defaultHiddenColumnKeys`            | `string[]`                               | `[]`                                   | 与 columns 中 hidden=true 的列合并为初始及重置基线。                                                              |
| `columnFixed`                        | `Record<string, BingTableFixed \| null>` | `undefined`                            | 受控固定覆盖；显式 null 取消列 fixed，遗漏键回退默认或列定义。                                                              |
| `defaultColumnFixed`                 | `Record<string, BingTableFixed \| null>` | `{}`                                   | 初始固定覆盖及重置基线。                                                                                       |
| `resizableColumns`                   | `boolean`                                | `true`                                 | 是否允许拖动或键盘调整列宽。                                                                                     |
| `reorderableColumns`                 | `boolean`                                | `true`                                 | 是否允许拖动表头或列面板调整列顺序；不控制列内容排序、表头说明或列宽调整。自 0.9.1 起关闭时保留普通表头语义，不会将整个表头标记为禁用。                            |
| `showColumnControls`                 | `boolean`                                | `true`                                 | 显示列设置入口；由 columnControlsPlacement 决定位置。                                                            |
| `virtual`                            | `BingTableVirtualMode`                   | `'auto'`                               | auto 按当前页展开后的可见行数严格大于 virtualThreshold 判断；true 对非空行集合启用。                                           |
| `virtualThreshold`                   | `number`                                 | `80`                                   | 虚拟化阈值，最小 0，向下取整。                                                                                   |
| `virtualRowHeight`                   | `number`                                 | `undefined`                            | 仅作为未测量行的预估高度；实际高度按 key 缓存，size 决定最小高度，支持内容换行。                                                      |
| `virtualOverscan`                    | `number`                                 | `6`                                    | 上下额外渲染行数，最小 0，向下取整。                                                                                |
| `pagination`                         | `boolean`                                | `false`                                | 开启分页。先按顶层 data 行切片，再展开子行，所以一页实际显示行数可超过 pageSize。                                                   |
| `remotePagination`                   | `boolean`                                | `false`                                | 开启分页时跳过本地切片；业务传当前页 data 与 total，并处理 page-change。不会请求接口，也不会自动变成远程排序。                                |
| `remoteSort`                         | `boolean`                                | `false`                                | 只维护排序图标和事件，完整保留传入 data 顺序且不调用 column.sorter；独立于 remotePagination。                                  |
| `preservePageHeight`                 | `boolean`                                | `true`                                 | 仅分页、非虚拟、非 loading、没有固定 height 时补位维持高度；补位行不参与选择。                                                    |
| `page`                               | `number`                                 | `undefined`                            | 受控页码，从 1 开始；建议有限正整数。                                                                               |
| `defaultPage`                        | `number`                                 | `1`                                    | 非受控初始页码。                                                                                           |
| `pageSize`                           | `number`                                 | `undefined`                            | 受控每页顶层行数，建议有限正整数。                                                                                  |
| `defaultPageSize`                    | `number`                                 | `10`                                   | 非受控初始每页条数，也加入页大小选项。                                                                                |
| `pageSizeOptions`                    | `number[]`                               | `[10, 20, 50, 100]`                    | 候选值取整去重并升序显示，合并当前受控 pageSize 和 defaultPageSize。                                                    |
| `total`                              | `number`                                 | `undefined`                            | 顶层总条数，默认 data.length。远程分页必须由业务提供整体总数。                                                              |
| `sortKey`                            | `string \| null`                         | `undefined`                            | 受控排序列。undefined 使用内部状态；null 明确清空，不回退 defaultSortKey。                                               |
| `defaultSortKey`                     | `string \| null`                         | `null`                                 | 非受控初始排序列。                                                                                          |
| `sortOrder`                          | `BingTableSortOrder`                     | `undefined`                            | 受控方向；undefined 使用内部状态，null 明确取消排序，不回退 defaultSortOrder。                                            |
| `defaultSortOrder`                   | `BingTableSortOrder`                     | `null`                                 | 非受控初始排序方向。                                                                                         |
| `rowClass`                           | `BingTableRowClass`                      | `undefined`                            | 行级自定义 class。                                                                                       |
| `ariaLabel`                          | `string`                                 | `undefined`                            | 滚动区域可访问名称。                                                                                         |
| `keyboardNavigation`                 | `boolean`                                | `true`                                 | grid / treegrid 单一 Tab 入口；方向键定位，F2 / Enter 进入控件，Esc 返回单元格。false 恢复自然 Tab 顺序。                       |
| `scrollbarGutter`                    | `'auto' \| 'stable'`                     | `'auto'`                               | auto 按溢出预留，stable 始终预留双向轨道。                                                                        |
| `activeRowKey`                       | `BingTableKey \| null`                   | `undefined`                            | 受控活动行，独立于复选框选择；未传时内部维护。                                                                            |
| `selectionStrategy`                  | `'independent' \| 'cascade'`             | `'independent'`                        | cascade 聚合可选后代的全选 / 半选，键只保存可选叶子；单选保持独立。                                                            |
| `allPagesSelected / excludedRowKeys` | `boolean / BingTableKey[]`               | `undefined / undefined`                | 受控远程跨页全选及排除项；筛选改变时业务明确退出策略。                                                                        |
| `error`                              | `boolean \| string`                      | `false`                                | 请求失败，与正常空数据分开；默认有重试按钮。                                                                             |
| `loadingVariant`                     | `'overlay' \| 'skeleton'`                | `'overlay'`                            | skeleton 仅首次无稳定数据时显示骨架，刷新保留旧行。                                                                     |
| `columnControlsPlacement`            | `'auto' \| 'toolbar' \| 'footer'`        | `'auto'`                               | auto 有分页放页脚，否则优先 toolbar 插槽，最后表头右上角；显式 toolbar 会创建工具栏。                                             |
| `treeGuides`                         | `boolean`                                | `false`                                | 展示层级引导线。                                                                                           |

## 列结构

| 字段               | 类型                                                    | 说明                                                                 |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| `key`            | `string`                                              | 必填且唯一；决定列状态及 header-/cell- 插槽名称。                                   |
| `title`          | `string`                                              | 标题，未传时使用 key。                                                      |
| `dataKey`        | `string`                                              | 读取 row\[dataKey\]，默认 key；不解析 a.b 嵌套路径。                             |
| `width`          | `number \| string`                                    | 数字或字符串 parseFloat 按 px。默认 minWidth 或 160，受最小/最大宽度约束。               |
| `minWidth`       | `number`                                              | 最小宽度默认 96，下限至少 48px。                                               |
| `maxWidth`       | `number`                                              | 最大宽度默认无限，业务保证不小于 minWidth。                                         |
| `fixed`          | `BingTableFixed`                                      | 左或右固定，影响显示分组；可由 columnFixed 覆盖。                                    |
| `hidden`         | `boolean`                                             | 非受控初始隐藏及重置基线；不是随时强制隐藏。                                             |
| `align`          | `BingTableAlign`                                      | 单元格对齐，默认 left。                                                     |
| `headerAlign`    | `BingTableAlign`                                      | 表头对齐，默认继承 align。                                                   |
| `sortable`       | `boolean`                                             | 是否展示排序按钮，默认关闭。                                                     |
| `resizable`      | `boolean`                                             | 单列调整宽度，默认开启；还需全局 resizableColumns=true。                            |
| `description`    | `string`                                              | 表头说明，点击帮助按钮展示 Tooltip。                                             |
| `ellipsis`       | `boolean`                                             | 默认开启省略并为实际截断文字显示全文 Tooltip；检测到内嵌控件时保留其交互与焦点框，不提供全文提示。false 关闭文字省略。 |
| `class`          | `string`                                              | 单元格 class。                                                         |
| `headerClass`    | `string`                                              | 表头 class。                                                          |
| `sorter`         | `(left: BingTableRow, right: BingTableRow) => number` | 本地顶层行比较器，降序会反转结果；不递归排序 children。                                   |
| `sortDirections` | `BingTableSortOrder[]`                                | 默认 \['asc', 'desc', null\]，可降序优先或省略取消排序。                           |

## 插槽与事件

### 插槽

| 插槽                    | 参数                                                | 说明                                                                     |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `toolbar`             | `BingTableToolbarSlotProps`                       | 表格工具栏左侧区域。                                                             |
| `header-[column.key]` | `{ column }`                                      | 自定义指定列表头内容。                                                            |
| `cell-[column.key]`   | `{ row, column, value, rowIndex, level }`         | 指定列优先于通用 cell；value 为 unknown，业务先收窄类型。rowIndex 是当前页扁平行索引，level 从 0 开始。 |
| `cell`                | `{ row, column, value, rowIndex, level }`         | 所有列的兜底单元格插槽。                                                           |
| `empty`               | `-`                                               | 替换正常空提示。                                                               |
| `error`               | `{ error: boolean \| string, retry: () => void }` | 替换错误提示，retry 发出重试事件。                                                   |

### 事件

| 事件                                                 | 参数                                                                           | 说明                                                                        |
| -------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `update:selectedRowKeys`                           | `[keys: BingTableKey[]]`                                                     | 先更新模型，随后 selection-change。即使值相同，方法调用仍可能重发。                                |
| `selection-change`                                 | `[payload: BingTableSelectionPayload]`                                       | keys 为选择键；rows 包含已加载且仍选中的远程行缓存，绝不是全部结果。跨页全选时额外提供 allPages / excludedKeys。 |
| `update:expandedRowKeys`                           | `[keys: BingTableKey[]]`                                                     | 展开模型更新，先于 expand-change。                                                  |
| `expand-change`                                    | `[payload: BingTableExpandPayload]`                                          | 单行展开状态变化，disabled 行仍可展开。                                                  |
| `update:columnWidths`                              | `[widths: Record<string, number>]`                                           | 列宽每次更新，以及 resetColumns 时发送。                                               |
| `column-resize`                                    | `[payload: BingTableColumnResizePayload]`                                    | 调整宽度时在更新事件后发送；resetColumns 不发送此事件。                                        |
| `update:columnOrder`                               | `[order: string[]]`                                                          | 列重排、固定分组变化或重置时发送。                                                         |
| `column-reorder`                                   | `[payload: BingTableColumnReorderPayload]`                                   | 拖拽或列面板键盘重排，from/to 包含隐藏列位置；结果按固定分组归一化。                                    |
| `update:hiddenColumnKeys`                          | `[keys: string[]]`                                                           | 显示隐藏或重置时发送。                                                               |
| `column-visibility-change`                         | `[payload: BingTableColumnVisibilityPayload]`                                | 可见性变化；面板不允许隐藏最后一列，外部受控赋值仍可隐藏全部。                                           |
| `update:columnFixed`                               | `[columnFixed: Record<string, BingTableFixed \| null>]`                      | 固定覆盖更新或重置时发送。                                                             |
| `column-fixed-change`                              | `[payload: BingTableColumnFixedPayload]`                                     | 先更新固定状态，必要时更新列顺序，然后发送此事件。                                                 |
| `update:page`                                      | `[page: number]`                                                             | 切页或页大小变化时发送；页数减少且当前页越界时也可能触发。                                             |
| `update:pageSize`                                  | `[pageSize: number]`                                                         | 切换页大小最先发送，随后 update:page(1) 和 page-change。                                |
| `page-change`                                      | `[payload: BingTablePageChangePayload]`                                      | 切页/页大小变化的完整载荷；远程模式由业务接入数据加载。                                              |
| `update:sortKey`                                   | `[key: string \| null]`                                                      | 排序按钮操作时先发送。                                                               |
| `update:sortOrder`                                 | `[order: BingTableSortOrder]`                                                | 排序列更新后发送。                                                                 |
| `sort-change`                                      | `[payload: BingTableSortPayload]`                                            | 最后发送完整载荷；默认 asc → desc → null，可由列 sortDirections 修改。外部赋值不发送。              |
| `row-click`                                        | `[row: BingTableRow, event: MouseEvent]`                                     | 参数是两个位置参数 row、MouseEvent；早于 selectOnRowClick 导致的选择更新。插槽里的独立操作按需阻止冒泡。      |
| `scroll`                                           | `[event: Event]`                                                             | 主滚动视口原始 Event。                                                            |
| `update:activeRowKey`                              | `BingTableKey \| null`                                                       | 提议更新活动行。                                                                  |
| `row-activate`                                     | `(row: BingTableRow, key: BingTableKey, event: MouseEvent \| KeyboardEvent)` | 点击普通行内容或按 Enter 激活；禁用行、嵌套控件不激活。row-click.preventDefault 可取消。              |
| `update:allPagesSelected / update:excludedRowKeys` | `boolean / BingTableKey[]`                                                   | 同步远程跨页全选及排除项。                                                             |
| `retry`                                            | `()`                                                                         | 默认错误状态请求重试，由业务加载数据。                                                       |

## 类型与数据边界

| 公开类型                                                                              | 定义或用途                                                                                                                                 |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `BingTableKey`                                                                    | `string \| number`                                                                                                                    |
| `BingTableAlign`                                                                  | `'left' \| 'center' \| 'right'`                                                                                                       |
| `BingTableFixed`                                                                  | `'left' \| 'right'`                                                                                                                   |
| `BingTableSize`                                                                   | `'sm' \| 'md' \| 'lg'`                                                                                                                |
| `BingTableVirtualMode`                                                            | `boolean \| 'auto'`                                                                                                                   |
| `BingTableSelectionMode`                                                          | `'multiple' \| 'single'`                                                                                                              |
| `BingTableSortOrder`                                                              | `'asc' \| 'desc' \| null`                                                                                                             |
| `BingTableRow`                                                                    | `Record<string, unknown>`                                                                                                             |
| `BingTableRowKeyGetter`                                                           | `(row: BingTableRow, index: number, path: number[]) => BingTableKey`                                                                  |
| `BingTableRowClass`                                                               | `string \| ((row: BingTableRow, index: number) => string \| undefined)`                                                               |
| `BingTableRowDisabled`                                                            | `string \| ((row: BingTableRow, index: number) => boolean)`                                                                           |
| `BingTableColumn`                                                                 | `上表完整列结构。`                                                                                                                            |
| `BingTableColumnResizePayload`                                                    | `{ key: string; width: number; widths: Record<string, number>; }`                                                                     |
| `BingTableColumnReorderPayload`                                                   | `{ key: string; from: number; to: number; order: string[]; }`                                                                         |
| `BingTableColumnVisibilityPayload`                                                | `{ key: string; hidden: boolean; hiddenColumnKeys: string[]; }`                                                                       |
| `BingTableColumnFixedPayload`                                                     | `{ key: string; fixed: BingTableFixed \| null; columnFixed: Record<string, BingTableFixed \| null>; }`                                |
| `BingTableSelectionPayload`                                                       | `{ keys: BingTableKey[]; rows: BingTableRow[]; allPages?: boolean; excludedKeys?: BingTableKey[]; }`                                  |
| `BingTableExpandPayload`                                                          | `{ key: BingTableKey; row: BingTableRow; expanded: boolean; expandedRowKeys: BingTableKey[]; }`                                       |
| `BingTablePageChangePayload`                                                      | `{ page: number; pageSize: number; }`                                                                                                 |
| `BingTableSortPayload`                                                            | `{ key: string \| null; order: BingTableSortOrder; column?: BingTableColumn; }`                                                       |
| `BingTableProps`                                                                  | `上表完整属性。`                                                                                                                             |
| `BingTableEmits`                                                                  | `上表完整事件。`                                                                                                                             |
| `BingTableExpose`                                                                 | `上表实例方法。`                                                                                                                             |
| `BingTableSelectionStrategy / BingTableScrollbarGutter / BingTableLoadingVariant` | `'independent' \| 'cascade' / 'auto' \| 'stable' / 'overlay' \| 'skeleton'`                                                           |
| `BingTableCellSlotProps / BingTableSlots`                                         | `公开单元格参数及完整插槽类型。`                                                                                                                     |
| `BingTableToolbarSlotProps`                                                       | `{ selectedRowKeys, visibleColumns, selectAllPages, clearSelection, allVisibleRowsSelected, allPages, excludedKeys, selectionCount }` |

全部类型从 @moubing/bing-ui 导入。BingTableRow 是 Record\<string, unknown>；单元格 value 和业务扩展字段需要类型判断。没有过滤器、单元格编辑、异步树加载或数据请求属性。示例数据与数据生成函数均已内置。

远程分页需同时开启 pagination、remotePagination，传入当前页 data 与整体 total，绑定 page/pageSize 并处理 page-change。组件不请求接口；服务器排序另开 remoteSort。selection-change.rows 缓存已加载且仍选中的行；未知远程数据无法生成行对象，不能把 rows 当作全部结果。

受控属性需要响应对应更新，default 属性主要用作初始化；列默认值也供 resetColumns 使用。sortKey/sortOrder 的 undefined 使用内部值，null 明确清空，即使存在冲突的 default 值也不回退。defaultExpandAll 例外：数据或 childrenKey 变化会重新展开非受控树。

主结构保留 th scope=col 与 columnheader，排序列提供 aria-sort；keyboardNavigation 默认 true，普通表为 grid、树表为 treegrid，提供单一 Tab 入口。行含全局 aria-rowindex，远程总行数为 total+1；树行含层级、展开状态和同级位置。焦点按行 key 保留，删除 / 换页时回退到相邻序号，虚拟焦点行不会被卸载。keyboardNavigation=false 恢复自然 Tab 顺序。缓存页离开时卸载预览并清理浮层与任务。

height/maxHeight 的字符串必须带有效 CSS 单位，例如 280px；示例通过动态绑定传入数值 280，不传无单位的字符串。

## 滚动配置

| SmoothScrollOptions 字段 | 类型        | 默认值     | 说明              |
| ---------------------- | --------- | ------- | --------------- |
| `duration`             | `number`  | `400`   | 动画时长，毫秒；0 立即更新。 |
| `stepSize`             | `number`  | `100`   | 滚轮归一化步长。        |
| `pulseScale`           | `number`  | `4`     | 脉冲缓动强度。         |
| `accelerationDelta`    | `number`  | `50`    | 连续输入加速间隔，毫秒。    |
| `accelerationMax`      | `number`  | `3`     | 最大加速倍率。         |
| `keyboardStep`         | `number`  | `50`    | 键盘基础滚动距离。       |
| `keyboard`             | `boolean` | `false` | 内部滚动区的键盘插值。     |
| `smoothTouchpad`       | `boolean` | `false` | 是否对触控板应用插值。     |
| `respectReducedMotion` | `boolean` | `true`  | 减少动态效果偏好下关闭插值。  |

主视口与列设置使用滚动配置；示例无需额外导入滚动库。
