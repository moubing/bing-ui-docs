import { computed, reactive, ref } from 'vue'
import type { BingRadioValue, BingTableColumn, BingTableExpose, BingTableKey, BingTablePageChangePayload, BingTableSelectionPayload, BingTableSize, BingTableSortOrder, BingTableSortPayload, BingTableVirtualMode } from '@moubing/bing-ui'
import basicCodeSource from '~~/examples/table/basic.vue?raw'
import treeCodeSource from '~~/examples/table/tree.vue?raw'
import wideCodeSource from '~~/examples/table/columns.vue?raw'
import virtualCodeSource from '~~/examples/table/virtual.vue?raw'
import exposeCodeSource from '~~/examples/table/methods.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { inject as injectExampleState, provide as provideExampleState, type InjectionKey } from 'vue'

function createExamples() {
  type RadioOption<T extends string> = {
    label: string
    value: T
    description?: string
  }

  type ToggleMode = 'auto' | 'true' | 'false'

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

  const virtualRows = Array.from({ length: 260 }, (_, index) => ({
    id: `row-${index + 1}`,
    project: `生成行 ${index + 1}`,
    owner: ['明夏', '欧文', '若依', '小满'][index % 4],
    status: ['设计中', '开发中', '评审中', '已发布'][index % 4],
    progress: (index * 7) % 101,
    budget: 48 + (index % 19) * 4,
    risk: ['低', '中', '高'][index % 3],
  }))

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

  const basicDemo = reactive({
    size: 'md' as BingTableSize,
    bordered: false,
    striped: true,
    selectable: true,
    selectOnRowClick: false,
    pagination: true,
    loading: false,
    preservePageHeight: true,
    showColumnControls: true,
  })

  const wideDemo = reactive({
    resizableColumns: true,
    reorderableColumns: true,
    showColumnControls: true,
    bordered: true,
  })

  const virtualDemo = reactive({
    virtual: 'true' as ToggleMode,
    maxHeight: '420',
    rowHeight: '',
    overscan: '6',
  })

  const treeExpandedKeys = ref<BingTableKey[]>(['aurora'])

  const tableRef = ref<BingTableExpose | null>(null)

  const exposeSelectedKeys = ref<BingTableKey[]>(['grid'])

  const exposeExpandedKeys = ref<BingTableKey[]>(['aurora'])

  const exposeLog = ref('等待方法调用')

  const sizeOptions: RadioOption<BingTableSize>[] = [
    { label: 'sm', value: 'sm' },
    { label: 'md', value: 'md' },
    { label: 'lg', value: 'lg' },
  ]

  const virtualOptions: RadioOption<ToggleMode>[] = [
    { label: 'auto', value: 'auto', description: '超过阈值后自动启用。' },
    { label: 'true', value: 'true', description: '始终启用虚拟滚动。' },
    { label: 'false', value: 'false', description: '始终渲染完整行。' },
  ]

  const virtualMode = computed(() => parseVirtualMode(virtualDemo.virtual))

  const basicSelectionText = computed(() => basicSelectedKeys.value.join('、') || '未选择')

  const basicSortText = computed(() =>
    basicSortKey.value && basicSortOrder.value
      ? `${basicSortKey.value} / ${basicSortOrder.value}`
      : '未排序',
  )

  function updateSize(value: BingRadioValue) {
    basicDemo.size = value as BingTableSize
  }

  function updateVirtual(value: BingRadioValue) {
    virtualDemo.virtual = value as ToggleMode
  }

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

  function getRiskTone(value: unknown) {
    if (value === '高') {
      return 'danger'
    }

    if (value === '中') {
      return 'warning'
    }

    return 'success'
  }

  function parseVirtualMode(value: ToggleMode): BingTableVirtualMode {
    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }

    return 'auto'
  }

  function toNumberText(value: string) {
    if (!value.trim()) return undefined
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      return 0
    }

    return numericValue
  }

  function quoteValue(value: string) {
    return `'${value}'`
  }

  const basicCode = computed(() => renderExampleCode(basicCodeSource, { size: basicDemo.size, bordered: basicDemo.bordered, striped: basicDemo.striped, selectable: basicDemo.selectable, selectOnRowClick: basicDemo.selectOnRowClick, pagination: basicDemo.pagination, loading: basicDemo.loading, preservePageHeight: basicDemo.preservePageHeight, showColumnControls: basicDemo.showColumnControls }))

  const treeCode = treeCodeSource.trim()

  const wideCode = computed(() => renderExampleCode(wideCodeSource, { resizableColumns: wideDemo.resizableColumns, reorderableColumns: wideDemo.reorderableColumns, showColumnControls: wideDemo.showColumnControls, bordered: wideDemo.bordered }))

  const virtualCode = computed(() => renderExampleCode(virtualCodeSource, { virtual: virtualMode.value, maxHeight: toNumberText(virtualDemo.maxHeight), virtualRowHeight: toNumberText(virtualDemo.rowHeight), virtualOverscan: toNumberText(virtualDemo.overscan) }))

  const exposeCode = exposeCodeSource.trim()
  return { columns, tableData, wideColumns, wideRows, virtualRows, basicSelectedKeys, basicExpandedKeys, basicPage, basicPageSize, basicColumnWidths, basicColumnOrder, basicHiddenColumns, basicColumnFixed, basicSortKey, basicSortOrder, basicLog, basicDemo, wideDemo, virtualDemo, treeExpandedKeys, tableRef, exposeSelectedKeys, exposeExpandedKeys, exposeLog, sizeOptions, virtualOptions, virtualMode, basicSelectionText, basicSortText, updateSize, updateVirtual, handleSelectionChange, handleSortChange, handlePageChange, clearExposeSelection, selectPreviewRow, expandAurora, resetExposeColumns, scrollExposeTable, getStatusTone, getRiskTone, parseVirtualMode, toNumberText, quoteValue, basicCode, treeCode, wideCode, virtualCode, exposeCode }
}
const key: InjectionKey<ReturnType<typeof createExamples>> = Symbol('table-examples')
export function provideExamples() { provideExampleState(key, createExamples()) }
export function useExamples() {
  const state = injectExampleState(key)
  if (!state) throw new Error('示例需要文档页面提供状态')
  return state
}
