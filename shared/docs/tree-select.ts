import type { DocsApiTables } from './types'

export const treeSelectApi: DocsApiTables = {
  "props": {
    "headers": [
      "Prop",
      "类型",
      "默认值",
      "说明"
    ],
    "codeColumns": 3,
    "rows": [
      [
        "id",
        "string",
        "undefined（自动生成 / FormItem controlId）",
        "触发按钮 id；默认自动生成唯一值，FormItem 内关联字段标签；内部 tree/node ID 也按实例隔离。"
      ],
      [
        "modelValue",
        "BingTreeSelectModelValue",
        "null",
        "单选用原始 value 或 null，多选用数组；严格区分数字和字符串。显示会归一化，但不会因归一化自动回写外部模型。"
      ],
      [
        "options",
        "BingTreeSelectNode[]",
        "[]",
        "完整树数据；所有层级 value 必须唯一且稳定，不能重复或循环引用。"
      ],
      [
        "multiple",
        "boolean",
        "false",
        "开启多选；单选不会级联。组件不维护业务选择值，必须同步更新或使用 v-model。"
      ],
      [
        "checkStrictly",
        "boolean",
        "false",
        "仅多选有效；true 父子独立，false 按可选子树展开并补齐已全选父节点。"
      ],
      [
        "placeholder",
        "string",
        "'请选择节点'",
        "没有可识别的已选节点时显示；提供 ariaLabel 后可访问名称不随选择改变。"
      ],
      [
        "disabled",
        "boolean",
        "undefined（继承 Form，否则 false）",
        "未设置时继承 Form，最终默认 false；显式 false 可覆盖继承。禁用时关闭面板、禁止选择和清空。"
      ],
      [
        "clearable",
        "boolean",
        "true",
        "只控制触发器清除按钮；不禁止 Tag 删除或侧栏清空当前结果。"
      ],
      [
        "showSelectAll",
        "boolean",
        "true",
        "多选时显示一个切换全选/清空当前范围的按钮；不是逐项反选。"
      ],
      [
        "selectAllText",
        "string",
        "'全选'",
        "批量选择按钮和提示的文案前缀，组件另加数量。"
      ],
      [
        "clearAllText",
        "string",
        "'清空已选'",
        "当前范围全选后切换为此清空文案；可能保留范围外选择。"
      ],
      [
        "showTreeActions",
        "boolean",
        "true",
        "有分支时显示展开/收起全部按钮；不隐藏每个节点的展开按钮。"
      ],
      [
        "expandAllText",
        "string",
        "'全部展开'",
        "全部展开按钮文案前缀。"
      ],
      [
        "collapseAllText",
        "string",
        "'全部收起'",
        "全部收起按钮文案前缀。"
      ],
      [
        "emptyText",
        "string",
        "'暂无节点'",
        "无普通可见节点时的提示。"
      ],
      [
        "searchable",
        "BingTreeSelectSearchable",
        "'auto'",
        "auto 根据整棵树节点数严格大于 8 启用搜索；布尔值使用动态绑定。"
      ],
      [
        "typeahead",
        "boolean",
        "true",
        "0.17.0 新增：无搜索框且面板打开时，500ms 内累计字符定位可见标签前缀或英文/拼音首字母；重复字符循环。"
      ],
      [
        "highlightMatches",
        "boolean",
        "true",
        "0.17.0 新增：默认节点标签高亮匹配片段，node 插槽同时获得 matchRanges；关闭不影响筛选。"
      ],
      [
        "searchPlaceholder",
        "string",
        "'搜索节点（/）'",
        "搜索框占位；不含 / 时自动追加 (/) 提示。"
      ],
      [
        "noSearchResultsText",
        "string",
        "'未找到匹配节点'",
        "有效搜索无匹配结果时的提示。"
      ],
      [
        "smoothScroll",
        "BingTreeSelectSmoothScroll",
        "true",
        "仅面板树滚动区域；false 关闭，配置见后表。"
      ],
      [
        "defaultExpandedValues",
        "BingTreeSelectValue[]",
        "[]",
        "首次挂载读取并过滤非分支键；之后修改不会重新设置展开状态。"
      ],
      [
        "defaultExpandAll",
        "boolean",
        "false",
        "首次或数据/默认展开配置变化时为 true 会重新全展开；切换 false 不会自动全部收起。"
      ],
      [
        "size",
        "BingTreeSelectSize",
        "undefined（继承 FormItem / Form / ConfigProvider，否则 md）",
        "显式值优先，其次继承 Form，再次 ConfigProvider，最后 md；触发器高度 32/36/40px，节点行高 28/32/36px。"
      ],
      [
        "block",
        "boolean",
        "false",
        "撑满父容器；在 FormItem 内即使传 false 也会撑满。"
      ],
      [
        "panelMinHeight",
        "string | number",
        "180",
        "数字或字符串经 parseFloat 后按 px；不是视口比例。受最大高度和可用空间限制。"
      ],
      [
        "panelMaxHeight",
        "string | number",
        "360",
        "数字或字符串按 px 解析，包含搜索区；视口空间可进一步限制高度。建议传有限数字。"
      ],
      [
        "panelPlacement",
        "BingTreeSelectPanelPlacement",
        "'auto'",
        "auto 只自动选择上/下；显式方向不会自动翻面，仍会夹紧坐标。"
      ],
      [
        "panelAlign",
        "BingTreeSelectPanelAlign",
        "'start'",
        "start/middle/end；上下方向按水平对齐，左右方向按垂直对齐。"
      ],
      [
        "panelGap",
        "number",
        "10",
        "有限非负像素；非法值回退 10，负数取 0。"
      ],
      [
        "virtual",
        "BingTreeSelectVirtualMode",
        "'auto'",
        "true 对非空可见集合启用；auto 按展开或搜索后的可见节点数严格大于阈值启用。"
      ],
      [
        "virtualThreshold",
        "number",
        "120",
        "最小 0，向下取整；不按原始全树节点数判断。"
      ],
      [
        "virtualItemHeight",
        "number",
        "undefined（随 size 为 28/32/36）",
        "有限数字向下取整且不小于当前尺寸节点行高；未设置或非有限值使用默认行高，自定义内容应保持固定高度。"
      ],
      [
        "virtualOverscan",
        "number",
        "5",
        "上下额外渲染节点数，最小 0，向下取整。"
      ],
      [
        "ariaLabel",
        "string",
        "undefined",
        "触发器可访问名称；省略时用选中标签或占位文案。"
      ],
      [
        "ariaDescribedby",
        "string",
        "undefined",
        "与 FormItem 提供的描述 id 合并。"
      ],
      [
        "status",
        "'default' | 'error' | 'success' | 'warning'",
        "undefined（继承 FormItem，否则 default）",
        "只改变外观/aria-invalid，不校验值；可以继承 FormItem 状态。"
      ],
      [
        "glass",
        "boolean",
        "true",
        "是否开启玻璃效果。"
      ],
      [
        "glassBlur",
        "string | number",
        "undefined（主题默认 16）",
        "玻璃模糊强度，省略时跟随主题。"
      ],
      [
        "glassOpacity",
        "number",
        "undefined（浅色 0.86 / 深色 0.92）",
        "玻璃底色不透明度，省略时跟随主题。"
      ],
      [
        "glassSaturation",
        "number",
        "undefined（主题默认 1.05）",
        "玻璃饱和度，省略时跟随主题。"
      ]
    ]
  },
  "node": {
    "headers": [
      "字段",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "label",
        "string",
        "必填，节点文本；默认搜索字段。"
      ],
      [
        "value",
        "BingTreeSelectValue",
        "必填，全树唯一，字符串与数字按严格相等区分。"
      ],
      [
        "disabled",
        "boolean",
        "默认 false，仅本节点不能选择，不自动禁用子节点；展开按钮仍可使用。"
      ],
      [
        "selectable",
        "boolean",
        "默认 true；false 节点只负责展开且不加入级联值，子节点仍可选。"
      ],
      [
        "description",
        "string",
        "节点说明，参与搜索和默认详情；不会自动在普通行中显示。"
      ],
      [
        "children",
        "BingTreeSelectNode[]",
        "子树，省略或空数组为叶子；数据必须是无环树。"
      ],
      [
        "meta",
        "NonNullable<BingTreeSelectNode['meta']>",
        "键和值参与搜索及默认详情；值支持 string/number/boolean/null/undefined，空值不显示。"
      ],
      [
        "[key: string]",
        "unknown",
        "可携带业务字段；插槽使用前先做类型判断，不自动参与搜索。"
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
        "value",
        "{ selectedNodes: BingTreeSelectNode[]; placeholder: string }",
        "自定义触发器内容；多选时提供该插槽会替换默认 Tag 和删除按钮。"
      ],
      [
        "node",
        "{ node: BingTreeSelectNode; selected: boolean; indeterminate: boolean; depth: number; expanded: boolean; matchRanges: { start: number; end: number }[] }",
        "自定义节点文字区域，保留展开按钮与选择装饰；depth 从 0 开始。0.17.0 新增 matchRanges，UTF-16 范围的 end 不包含在片段中。"
      ],
      [
        "node-detail",
        "{ node: BingTreeSelectNode; selected: boolean; indeterminate: boolean; depth: number; expanded: boolean }",
        "悬停/键盘高亮详情，aria-hidden=true，仅放补充展示内容；必需信息应另有可访问位置。"
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
        "update:modelValue",
        "BingTreeSelectModelValue",
        "选择、移除或清空时先发送；外部赋值及仅展开不会发送。多选输出按全树前序排序。"
      ],
      [
        "change",
        "BingTreeSelectChangePayload",
        "随后发送 { value, node?, nodes }；节点操作含 node，全选/清空不含 node，nodes 是新值对应的全部已选节点，含级联补齐的父节点。"
      ],
      [
        "clear",
        "无",
        "仅触发器清除按钮发送，顺序 clear → update:modelValue → change。Tag 删除、清空当前搜索范围不发送 clear。"
      ],
      [
        "open",
        "无",
        "请求打开时发送，早于动画和搜索框聚焦结束。"
      ],
      [
        "close",
        "无",
        "请求关闭时发送。单选操作顺序 update:modelValue → change → close；多选选择保持打开。"
      ],
      [
        "expand",
        "BingTreeSelectExpandPayload",
        "单个分支展开，载荷 { value, node, expandedValues }；全部展开或默认值初始化不发送此事件。"
      ],
      [
        "collapse",
        "BingTreeSelectExpandPayload",
        "单个分支收起，载荷结构同 expand；收起父节点保留后代展开键，全部收起不发送此事件。"
      ]
    ]
  },
  "types": {
    "headers": [
      "公开类型或推导方式",
      "定义或用途"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "BingTreeSelectValue",
        "string | number"
      ],
      [
        "BingTreeSelectModelValue",
        "BingTreeSelectValue | BingTreeSelectValue[] | null"
      ],
      [
        "BingTreeSelectSize",
        "'sm' | 'md' | 'lg'"
      ],
      [
        "BingTreeSelectVirtualMode",
        "boolean | 'auto'"
      ],
      [
        "BingTreeSelectSearchable",
        "boolean | 'auto'"
      ],
      [
        "BingTreeSelectSmoothScroll",
        "SmoothScrollValue"
      ],
      [
        "BingTreeSelectNode",
        "上表节点结构。"
      ],
      [
        "BingTreeSelectProps",
        "上表 41 项可选属性（含玻璃效果；typeahead/highlightMatches 自 0.17.0 起提供）。"
      ],
      [
        "BingTreeSelectChangePayload",
        "{ value: BingTreeSelectModelValue; node?: BingTreeSelectNode; nodes: BingTreeSelectNode[]; }"
      ],
      [
        "BingTreeSelectExpandPayload",
        "{ value: BingTreeSelectValue; node: BingTreeSelectNode; expandedValues: BingTreeSelectValue[]; }"
      ],
      [
        "BingTreeSelectEmits",
        "上表 7 个事件。"
      ],
      [
        "NonNullable<BingTreeSelectProps['panelPlacement']>",
        "'auto' | 'top' | 'bottom' | 'left' | 'right'；包入口不导出独立的 PanelPlacement 类型。"
      ],
      [
        "NonNullable<BingTreeSelectProps['panelAlign']>",
        "'start' | 'middle' | 'end'；包入口不导出独立的 PanelAlign 类型。"
      ],
      [
        "NonNullable<BingTreeSelectNode['meta']>",
        "Record<string, string | number | boolean | null | undefined>；包入口不导出 NodeMetaValue。"
      ],
      [
        "SmoothScrollValue",
        "boolean | SmoothScrollOptions"
      ],
      [
        "SmoothScrollOptions",
        "下表面板滚动配置，可从包入口导入。"
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
