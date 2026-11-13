import type { DocsApiTables } from './types'
import { tableApi } from './table.ts'
const modelProps = new Set(['columns', 'columnWidths', 'defaultColumnWidths', 'columnOrder', 'defaultColumnOrder',
  'hiddenColumnKeys', 'defaultHiddenColumnKeys', 'columnFixed', 'defaultColumnFixed', 'reorderableColumns', 'smoothScroll'])
const modelEvents = new Set(['update:columnWidths', 'update:columnOrder', 'update:hiddenColumnKeys', 'update:columnFixed',
  'column-reorder', 'column-visibility-change', 'column-fixed-change'])
export const tableColumnControlsApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: [
    ...tableApi.props!.rows.filter(row => modelProps.has(row[0]!)),
    ['open', 'boolean', 'undefined', '受控展开状态；绑定 v-model:open。'],
    ['defaultOpen', 'boolean', 'false', '非受控初始展开状态。'],
    ['disabled', 'boolean', 'false', '禁用触发器、排序、显隐、固定与重置，变为 true 时请求关闭面板。'],
    ['placement', 'BingDropDownPlacement', "'bottom-start'", '面板方向；表格内部入口使用 top-start。'],
    ['ariaLabel', 'string', "'列设置'", '入口、面板与分组的可访问名称。'],
  ] },
  events: { headers: ['事件', '载荷', '说明'], codeColumns: 2, rows: [
    ...tableApi.events!.rows.filter(row => modelEvents.has(row[0]!)),
    ['update:open', 'boolean', '请求打开或关闭面板。'],
    ['drag-start', 'BingSortableListDragPayload', '开始指针拖动列顺序。'],
    ['drag-end', 'BingSortableListDragPayload', '结束指针拖动；排序结果以 column-reorder 为准。'],
  ] },
  expose: { headers: ['方法', '类型', '说明'], codeColumns: 2, rows: [
    ['resetColumns()', '() => void', '恢复四组 default 列模型，发送四个 update 事件，不发送三种单项变更事件。'],
  ] },
  types: { headers: ['类型', '说明'], codeColumns: 1, rows: [
    ['BingTableColumnControlsProps / BingTableColumnControlsEmits / BingTableColumnControlsExpose', '属性、事件与实例方法类型，从 @moubing/bing-ui 导入。'],
    ['BingTableColumn / BingTableFixed', '与 BingTable 相同的列结构和固定方向。'],
    ['BingTableColumnReorderPayload / BingTableColumnVisibilityPayload / BingTableColumnFixedPayload', '对应顺序、显隐、固定事件的载荷，与 BingTable 一致。'],
    ['BingSortableListDragPayload', '包含 key、item、index、order、event；只有指针拖动发送 drag-start / drag-end。'],
    ['BingDropDownPlacement', '沿用 BingDropDown 的公开位置类型。'],
  ] },
}
