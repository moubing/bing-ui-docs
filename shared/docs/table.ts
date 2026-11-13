import type { DocsApiTables } from './types'

export const tableApi: DocsApiTables = {
  "expose": {
    "headers": [
      "方法",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "clearSelection()",
        "() => void",
        "清空所有键，发送更新和 selection-change；不要求 selectable=true。"
      ],
      [
        "toggleRowSelection(key, selected?)",
        "(key: BingTableKey, selected?: boolean) => void",
        "查找当前 data（包含折叠子行），未知键或禁用行忽略；未传 selected 时切换。受控模式仍需响应更新。"
      ],
      [
        "toggleRowExpansion(key, expanded?)",
        "(key: BingTableKey, expanded?: boolean) => void",
        "仅有 children 的行可展开；未知键或叶子无操作。"
      ],
      [
        "resetColumns()",
        "() => void",
        "恢复 default 列宽、顺序、隐藏和固定基线，只发送四个 update 事件；不会清除选择或排序。"
      ],
      [
        "scrollTo(top)",
        "(top: number) => void",
        "主视口纵向滚动，负数取 0；挂载前无作用，不提供横向坐标或返回 Promise。"
      ]
    ]
  },
  "props": {
    "headers": [
      "属性",
      "类型",
      "默认值",
      "说明"
    ],
    "codeColumns": 3,
    "rows": [
      [
        "data",
        "BingTableRow[]",
        "[]",
        "表格数据源。支持 childrenKey 指定树形子节点。"
      ],
      [
        "columns",
        "BingTableColumn[]",
        "[]",
        "列定义，决定标题、宽度、固定列、排序、单元格字段和列级样式。"
      ],
      [
        "rowKey",
        "string | BingTableRowKeyGetter",
        "'id'",
        "稳定唯一行键。index 为原始同级序号，path 为原始树路径，不随排序、分页和展开改变。动态数据建议用稳定字段且全树唯一。"
      ],
      [
        "childrenKey",
        "string",
        "'children'",
        "树形子节点字段名。"
      ],
      [
        "height",
        "number | string",
        "undefined",
        "主滚动视口固定高度；数字按 px，字符串作为 CSS 长度。"
      ],
      [
        "maxHeight",
        "number | string",
        "undefined（虚拟模式下回退 520）",
        "主视口最大高度，未传且启用虚拟化时默认 520；工具栏和分页另占空间。"
      ],
      [
        "smoothScroll",
        "SmoothScrollValue",
        "true",
        "为主视口的纵向、横向滚动和列设置列表启用平滑滚动；设为 false 可关闭。直接拖动滚动轨道或开始相关交互时会停止当前动画。"
      ],
      [
        "size",
        "BingTableSize",
        "undefined（继承 ConfigProvider，否则 'md'）",
        "表格密度；表头高度 sm/md/lg 为 32/36/40px，默认数据行高为 36/40/44px。"
      ],
      [
        "bordered",
        "boolean",
        "false",
        "边框和斑马纹。"
      ],
      [
        "striped",
        "boolean",
        "true",
        "边框和斑马纹。"
      ],
      [
        "loading",
        "boolean",
        "false",
        "保留上次稳定数据与高度，主视口 inert、暂停分页；提示延迟约 150ms，显示后至少保留约 250ms。工具栏、列设置及实例方法仍可工作。"
      ],
      [
        "emptyText",
        "string",
        "'暂无数据'",
        "加载态和空态文案。"
      ],
      [
        "loadingText",
        "string",
        "'正在加载数据'",
        "加载态和空态文案。"
      ],
      [
        "selectable",
        "boolean",
        "false",
        "是否显示选择列。"
      ],
      [
        "selectionMode",
        "BingTableSelectionMode",
        "'multiple'",
        "多选或单选。"
      ],
      [
        "selectedRowKeys",
        "BingTableKey[]",
        "undefined",
        "受控选择键，使用对应 v-model 同步；默认父子独立，cascade 模式保存可选叶子。其他页的键不会自动清除。"
      ],
      [
        "defaultSelectedRowKeys",
        "BingTableKey[]",
        "[]",
        "非受控选择的初始值，仅初始化读取。"
      ],
      [
        "rowDisabled",
        "BingTableRowDisabled",
        "undefined",
        "禁止行选择与激活，不禁止展开或 row-click。函数 index 为原始全树前序序号，建议按稳定字段判断。"
      ],
      [
        "selectOnRowClick",
        "boolean",
        "false",
        "点击整行时切换选择；原生交互控件、role=button/combobox 或 data-bing-table-row-click-ignore 区域不触发自动选择，row-click 仍先发送。"
      ],
      [
        "selectionFixed",
        "boolean",
        "true",
        "选择列固定在左侧；虚拟化且无横向溢出时不额外绘制固定覆盖层。"
      ],
      [
        "selectionColumnWidth",
        "number",
        "54",
        "选择列宽度，内部最小 42px。"
      ],
      [
        "expandedRowKeys",
        "BingTableKey[]",
        "undefined",
        "受控展开键；仅影响树形显示，不改变 data。"
      ],
      [
        "defaultExpandedRowKeys",
        "BingTableKey[]",
        "[]",
        "非受控展开的初始键，defaultExpandAll 可以覆盖。"
      ],
      [
        "defaultExpandAll",
        "boolean",
        "false",
        "非受控展开时全展开；data、childrenKey 或此属性变化后会再次展开，不只是挂载时读取。"
      ],
      [
        "treeColumnKey",
        "string",
        "undefined",
        "树形展开控制所在的可见列 key；未传时使用首个可见列。指定列被隐藏时不会自动选择另一列。"
      ],
      [
        "indentSize",
        "number",
        "22",
        "树形层级缩进。"
      ],
      [
        "columnWidths",
        "Record<string, number>",
        "undefined",
        "受控列宽；缺少某个键时回退内部默认宽度或列定义。"
      ],
      [
        "defaultColumnWidths",
        "Record<string, number>",
        "{}",
        "初始宽度覆盖，也是 resetColumns 的基线。"
      ],
      [
        "columnOrder",
        "string[]",
        "undefined",
        "受控列顺序，去重、去无效键、补遗漏键，再按左固定/普通/右固定分组显示。"
      ],
      [
        "defaultColumnOrder",
        "string[]",
        "[]",
        "初始顺序；空数组按 columns 顺序，也是重置基线。"
      ],
      [
        "hiddenColumnKeys",
        "string[]",
        "undefined",
        "受控隐藏键，传空数组会覆盖列定义 hidden 的初始隐藏效果。"
      ],
      [
        "defaultHiddenColumnKeys",
        "string[]",
        "[]",
        "与 columns 中 hidden=true 的列合并为初始及重置基线。"
      ],
      [
        "columnFixed",
        "Record<string, BingTableFixed | null>",
        "undefined",
        "受控固定覆盖；显式 null 取消列 fixed，遗漏键回退默认或列定义。"
      ],
      [
        "defaultColumnFixed",
        "Record<string, BingTableFixed | null>",
        "{}",
        "初始固定覆盖及重置基线。"
      ],
      [
        "resizableColumns",
        "boolean",
        "true",
        "是否允许拖动或键盘调整列宽。"
      ],
      [
        "reorderableColumns",
        "boolean",
        "true",
        "是否允许拖动表头或列面板调整列顺序；不控制列内容排序、表头说明或列宽调整。自 0.9.1 起关闭时保留普通表头语义，不会将整个表头标记为禁用。"
      ],
      [
        "showColumnControls",
        "boolean",
        "true",
        "显示列设置入口；由 columnControlsPlacement 决定位置。"
      ],
      [
        "virtual",
        "BingTableVirtualMode",
        "'auto'",
        "auto 按当前页展开后的可见行数严格大于 virtualThreshold 判断；true 对非空行集合启用。"
      ],
      [
        "virtualThreshold",
        "number",
        "80",
        "虚拟化阈值，最小 0，向下取整。"
      ],
      [
        "virtualRowHeight",
        "number",
        "undefined",
        "仅作为未测量行的预估高度；实际高度按 key 缓存，size 决定最小高度，支持内容换行。"
      ],
      [
        "virtualOverscan",
        "number",
        "6",
        "上下额外渲染行数，最小 0，向下取整。"
      ],
      [
        "pagination",
        "boolean",
        "false",
        "开启分页。先按顶层 data 行切片，再展开子行，所以一页实际显示行数可超过 pageSize。"
      ],
      [
        "remotePagination",
        "boolean",
        "false",
        "开启分页时跳过本地切片；业务传当前页 data 与 total，并处理 page-change。不会请求接口，也不会自动变成远程排序。"
      ],
      [
        "remoteSort",
        "boolean",
        "false",
        "只维护排序图标和事件，完整保留传入 data 顺序且不调用 column.sorter；独立于 remotePagination。"
      ],
      [
        "preservePageHeight",
        "boolean",
        "true",
        "仅分页、非虚拟、非 loading、没有固定 height 时补位维持高度；补位行不参与选择。"
      ],
      [
        "page",
        "number",
        "undefined",
        "受控页码，从 1 开始；建议有限正整数。"
      ],
      [
        "defaultPage",
        "number",
        "1",
        "非受控初始页码。"
      ],
      [
        "pageSize",
        "number",
        "undefined",
        "受控每页顶层行数，建议有限正整数。"
      ],
      [
        "defaultPageSize",
        "number",
        "10",
        "非受控初始每页条数，也加入页大小选项。"
      ],
      [
        "pageSizeOptions",
        "number[]",
        "[10, 20, 50, 100]",
        "候选值取整去重并升序显示，合并当前受控 pageSize 和 defaultPageSize。"
      ],
      [
        "total",
        "number",
        "undefined",
        "顶层总条数，默认 data.length。远程分页必须由业务提供整体总数。"
      ],
      [
        "sortKey",
        "string | null",
        "undefined",
        "受控排序列。undefined 使用内部状态；null 明确清空，不回退 defaultSortKey。"
      ],
      [
        "defaultSortKey",
        "string | null",
        "null",
        "非受控初始排序列。"
      ],
      [
        "sortOrder",
        "BingTableSortOrder",
        "undefined",
        "受控方向；undefined 使用内部状态，null 明确取消排序，不回退 defaultSortOrder。"
      ],
      [
        "defaultSortOrder",
        "BingTableSortOrder",
        "null",
        "非受控初始排序方向。"
      ],
      [
        "rowClass",
        "BingTableRowClass",
        "undefined",
        "行级自定义 class。"
      ],
      [
        "ariaLabel",
        "string",
        "undefined",
        "滚动区域可访问名称。"
      ]
    ]
  },
  "column": {
    "headers": [
      "字段",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "key",
        "string",
        "必填且唯一；决定列状态及 header-/cell- 插槽名称。"
      ],
      [
        "title",
        "string",
        "标题，未传时使用 key。"
      ],
      [
        "dataKey",
        "string",
        "读取 row[dataKey]，默认 key；不解析 a.b 嵌套路径。"
      ],
      [
        "width",
        "number | string",
        "数字或字符串 parseFloat 按 px。默认 minWidth 或 160，受最小/最大宽度约束。"
      ],
      [
        "minWidth",
        "number",
        "最小宽度默认 96，下限至少 48px。"
      ],
      [
        "maxWidth",
        "number",
        "最大宽度默认无限，业务保证不小于 minWidth。"
      ],
      [
        "fixed",
        "BingTableFixed",
        "左或右固定，影响显示分组；可由 columnFixed 覆盖。"
      ],
      [
        "hidden",
        "boolean",
        "非受控初始隐藏及重置基线；不是随时强制隐藏。"
      ],
      [
        "align",
        "BingTableAlign",
        "单元格对齐，默认 left。"
      ],
      [
        "headerAlign",
        "BingTableAlign",
        "表头对齐，默认继承 align。"
      ],
      [
        "sortable",
        "boolean",
        "是否展示排序按钮，默认关闭。"
      ],
      [
        "resizable",
        "boolean",
        "单列调整宽度，默认开启；还需全局 resizableColumns=true。"
      ],
      [
        "description",
        "string",
        "表头说明，点击帮助按钮展示 Tooltip。"
      ],
      [
        "ellipsis",
        "boolean",
        "默认开启省略并为实际截断文字显示全文 Tooltip；检测到内嵌控件时保留其交互与焦点框，不提供全文提示。false 关闭文字省略。"
      ],
      [
        "class",
        "string",
        "单元格 class。"
      ],
      [
        "headerClass",
        "string",
        "表头 class。"
      ],
      [
        "sorter",
        "(left: BingTableRow, right: BingTableRow) => number",
        "本地顶层行比较器，降序会反转结果；不递归排序 children。"
      ]
    ]
  },
  "slots": {
    "headers": [
      "插槽",
      "参数",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "toolbar",
        "BingTableToolbarSlotProps",
        "表格工具栏左侧区域。"
      ],
      [
        "header-[column.key]",
        "{ column }",
        "自定义指定列表头内容。"
      ],
      [
        "cell-[column.key]",
        "{ row, column, value, rowIndex, level }",
        "指定列优先于通用 cell；value 为 unknown，业务先收窄类型。rowIndex 是当前页扁平行索引，level 从 0 开始。"
      ],
      [
        "cell",
        "{ row, column, value, rowIndex, level }",
        "所有列的兜底单元格插槽。"
      ]
    ]
  },
  "events": {
    "headers": [
      "事件",
      "参数",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "update:selectedRowKeys",
        "[keys: BingTableKey[]]",
        "先更新模型，随后 selection-change。即使值相同，方法调用仍可能重发。"
      ],
      [
        "selection-change",
        "[payload: BingTableSelectionPayload]",
        "keys 为选择键；rows 包含已加载且仍选中的远程行缓存，绝不是全部结果。跨页全选时额外提供 allPages / excludedKeys。"
      ],
      [
        "update:expandedRowKeys",
        "[keys: BingTableKey[]]",
        "展开模型更新，先于 expand-change。"
      ],
      [
        "expand-change",
        "[payload: BingTableExpandPayload]",
        "单行展开状态变化，disabled 行仍可展开。"
      ],
      [
        "update:columnWidths",
        "[widths: Record<string, number>]",
        "列宽每次更新，以及 resetColumns 时发送。"
      ],
      [
        "column-resize",
        "[payload: BingTableColumnResizePayload]",
        "调整宽度时在更新事件后发送；resetColumns 不发送此事件。"
      ],
      [
        "update:columnOrder",
        "[order: string[]]",
        "列重排、固定分组变化或重置时发送。"
      ],
      [
        "column-reorder",
        "[payload: BingTableColumnReorderPayload]",
        "拖拽或列面板键盘重排，from/to 包含隐藏列位置；结果按固定分组归一化。"
      ],
      [
        "update:hiddenColumnKeys",
        "[keys: string[]]",
        "显示隐藏或重置时发送。"
      ],
      [
        "column-visibility-change",
        "[payload: BingTableColumnVisibilityPayload]",
        "可见性变化；面板不允许隐藏最后一列，外部受控赋值仍可隐藏全部。"
      ],
      [
        "update:columnFixed",
        "[columnFixed: Record<string, BingTableFixed | null>]",
        "固定覆盖更新或重置时发送。"
      ],
      [
        "column-fixed-change",
        "[payload: BingTableColumnFixedPayload]",
        "先更新固定状态，必要时更新列顺序，然后发送此事件。"
      ],
      [
        "update:page",
        "[page: number]",
        "切页或页大小变化时发送；页数减少且当前页越界时也可能触发。"
      ],
      [
        "update:pageSize",
        "[pageSize: number]",
        "切换页大小最先发送，随后 update:page(1) 和 page-change。"
      ],
      [
        "page-change",
        "[payload: BingTablePageChangePayload]",
        "切页/页大小变化的完整载荷；远程模式由业务接入数据加载。"
      ],
      [
        "update:sortKey",
        "[key: string | null]",
        "排序按钮操作时先发送。"
      ],
      [
        "update:sortOrder",
        "[order: BingTableSortOrder]",
        "排序列更新后发送。"
      ],
      [
        "sort-change",
        "[payload: BingTableSortPayload]",
        "最后发送完整载荷；默认 asc → desc → null，可由列 sortDirections 修改。外部赋值不发送。"
      ],
      [
        "row-click",
        "[row: BingTableRow, event: MouseEvent]",
        "参数是两个位置参数 row、MouseEvent；早于 selectOnRowClick 导致的选择更新。插槽里的独立操作按需阻止冒泡。"
      ],
      [
        "scroll",
        "[event: Event]",
        "主滚动视口原始 Event。"
      ]
    ]
  },
  "types": {
    "headers": [
      "公开类型",
      "定义或用途"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "BingTableKey",
        "string | number"
      ],
      [
        "BingTableAlign",
        "'left' | 'center' | 'right'"
      ],
      [
        "BingTableFixed",
        "'left' | 'right'"
      ],
      [
        "BingTableSize",
        "'sm' | 'md' | 'lg'"
      ],
      [
        "BingTableVirtualMode",
        "boolean | 'auto'"
      ],
      [
        "BingTableSelectionMode",
        "'multiple' | 'single'"
      ],
      [
        "BingTableSortOrder",
        "'asc' | 'desc' | null"
      ],
      [
        "BingTableRow",
        "Record<string, unknown>"
      ],
      [
        "BingTableRowKeyGetter",
        "(row: BingTableRow, index: number, path: number[]) => BingTableKey"
      ],
      [
        "BingTableRowClass",
        "string | ((row: BingTableRow, index: number) => string | undefined)"
      ],
      [
        "BingTableRowDisabled",
        "string | ((row: BingTableRow, index: number) => boolean)"
      ],
      [
        "BingTableColumn",
        "上表完整列结构。"
      ],
      [
        "BingTableColumnResizePayload",
        "{ key: string; width: number; widths: Record<string, number>; }"
      ],
      [
        "BingTableColumnReorderPayload",
        "{ key: string; from: number; to: number; order: string[]; }"
      ],
      [
        "BingTableColumnVisibilityPayload",
        "{ key: string; hidden: boolean; hiddenColumnKeys: string[]; }"
      ],
      [
        "BingTableColumnFixedPayload",
        "{ key: string; fixed: BingTableFixed | null; columnFixed: Record<string, BingTableFixed | null>; }"
      ],
      [
        "BingTableSelectionPayload",
        "{ keys: BingTableKey[]; rows: BingTableRow[]; allPages?: boolean; excludedKeys?: BingTableKey[]; }"
      ],
      [
        "BingTableExpandPayload",
        "{ key: BingTableKey; row: BingTableRow; expanded: boolean; expandedRowKeys: BingTableKey[]; }"
      ],
      [
        "BingTablePageChangePayload",
        "{ page: number; pageSize: number; }"
      ],
      [
        "BingTableSortPayload",
        "{ key: string | null; order: BingTableSortOrder; column?: BingTableColumn; }"
      ],
      [
        "BingTableProps",
        "上表完整属性。"
      ],
      [
        "BingTableEmits",
        "上表完整事件。"
      ],
      [
        "BingTableExpose",
        "上表实例方法。"
      ]
    ]
  },
  "smooth": {
    "headers": [
      "SmoothScrollOptions 字段",
      "类型",
      "默认值",
      "说明"
    ],
    "codeColumns": 3,
    "rows": [
      [
        "duration",
        "number",
        "400",
        "动画时长，毫秒；0 立即更新。"
      ],
      [
        "stepSize",
        "number",
        "100",
        "滚轮归一化步长。"
      ],
      [
        "pulseScale",
        "number",
        "4",
        "脉冲缓动强度。"
      ],
      [
        "accelerationDelta",
        "number",
        "50",
        "连续输入加速间隔，毫秒。"
      ],
      [
        "accelerationMax",
        "number",
        "3",
        "最大加速倍率。"
      ],
      [
        "keyboardStep",
        "number",
        "50",
        "键盘基础滚动距离。"
      ],
      [
        "keyboard",
        "boolean",
        "false",
        "内部滚动区的键盘插值。"
      ],
      [
        "smoothTouchpad",
        "boolean",
        "false",
        "是否对触控板应用插值。"
      ],
      [
        "respectReducedMotion",
        "boolean",
        "true",
        "减少动态效果偏好下关闭插值。"
      ]
    ]
  }
}

function appendRows(name: string, ...rows: string[][]) {
  const table = tableApi[name]!
  tableApi[name] = { ...table, rows: [...table.rows, ...rows] }
}

appendRows('props',
  ['keyboardNavigation', 'boolean', 'true', 'grid / treegrid 单一 Tab 入口；方向键定位，F2 / Enter 进入控件，Esc 返回单元格。false 恢复自然 Tab 顺序。'],
  ['scrollbarGutter', "'auto' | 'stable'", "'auto'", 'auto 按溢出预留，stable 始终预留双向轨道。'],
  ['activeRowKey', 'BingTableKey | null', 'undefined', '受控活动行，独立于复选框选择；未传时内部维护。'],
  ['selectionStrategy', "'independent' | 'cascade'", "'independent'", 'cascade 聚合可选后代的全选 / 半选，键只保存可选叶子；单选保持独立。'],
  ['allPagesSelected / excludedRowKeys', 'boolean / BingTableKey[]', 'undefined / undefined', '受控远程跨页全选及排除项；筛选改变时业务明确退出策略。'],
  ['error', 'boolean | string', 'false', '请求失败，与正常空数据分开；默认有重试按钮。'],
  ['loadingVariant', "'overlay' | 'skeleton'", "'overlay'", 'skeleton 仅首次无稳定数据时显示骨架，刷新保留旧行。'],
  ['columnControlsPlacement', "'auto' | 'toolbar' | 'footer'", "'auto'", 'auto 有分页放页脚，否则优先 toolbar 插槽，最后表头右上角；显式 toolbar 会创建工具栏。'],
  ['treeGuides', 'boolean', 'false', '展示层级引导线。'],
)
appendRows('column', ['sortDirections', 'BingTableSortOrder[]', "默认 ['asc', 'desc', null]，可降序优先或省略取消排序。"])
appendRows('events',
  ['update:activeRowKey', 'BingTableKey | null', '提议更新活动行。'],
  ['row-activate', '(row: BingTableRow, key: BingTableKey, event: MouseEvent | KeyboardEvent)', '点击普通行内容或按 Enter 激活；禁用行、嵌套控件不激活。row-click.preventDefault 可取消。'],
  ['update:allPagesSelected / update:excludedRowKeys', 'boolean / BingTableKey[]', '同步远程跨页全选及排除项。'],
  ['retry', '()', '默认错误状态请求重试，由业务加载数据。'],
)
appendRows('slots',
  ['empty', '-', '替换正常空提示。'],
  ['error', '{ error: boolean | string, retry: () => void }', '替换错误提示，retry 发出重试事件。'],
)
appendRows('expose',
  ['focusCell(rowKey, column?)', '(rowKey: BingTableKey | null, column?: string | number) => Promise<void>', '当前页定位；null 为表头，column 可为 key 或含选择列的零基索引；不自动换页或展开祖先。'],
  ['scrollToRow(key)', '(key: BingTableKey) => void', '滚入当前页的可见树行，避开固定列、表头和轨道。'],
  ['autoFitColumn(key) / autoFitColumns()', '(key: string) => void / () => void', '测量表头及当前已渲染内容，受 minWidth / maxWidth 约束；不测量未知远程行或虚拟窗口外内容。'],
  ['selectAllPages()', '() => void', '本地枚举可选行；远程进入 allPages + excludedKeys 模式。'],
)
appendRows('types',
  ['BingTableSelectionStrategy / BingTableScrollbarGutter / BingTableLoadingVariant', "'independent' | 'cascade' / 'auto' | 'stable' / 'overlay' | 'skeleton'"],
  ['BingTableCellSlotProps / BingTableSlots', '公开单元格参数及完整插槽类型。'],
  ['BingTableToolbarSlotProps', '{ selectedRowKeys, visibleColumns, selectAllPages, clearSelection, allVisibleRowsSelected, allPages, excludedKeys, selectionCount }'],
)
