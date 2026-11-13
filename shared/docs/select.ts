import type { DocsApiTables } from './types'

export const selectApi: DocsApiTables = {
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
        "id",
        "string",
        "自动生成 / FormItem controlId",
        "触发按钮 id；内部 listbox 和 option ID 按实例唯一生成。自定义 id 时仍需业务保证唯一。"
      ],
      [
        "modelValue",
        "BingSelectModelValue",
        "null",
        "单选 string | number | null，多选数组；值按严格 === 比较，数字 1 与字符串 1 不同。未知值不会自动删除。"
      ],
      [
        "options",
        "BingSelectOption[]",
        "[]",
        "选项列表。"
      ],
      [
        "multiple",
        "boolean",
        "false",
        "开启多选模式。"
      ],
      [
        "placeholder",
        "string",
        "'请选择选项'",
        "未选择时的占位文案。"
      ],
      [
        "disabled",
        "boolean",
        "继承 FormItem / Form，否则 false",
        "显式属性优先于表单禁用状态；切换为 true 会关闭打开的面板。"
      ],
      [
        "clearable",
        "boolean",
        "true",
        "仅控制触发器清除按钮；不关闭 Tag 删除或多选全选/清空当前结果。"
      ],
      [
        "showSelectAll",
        "boolean",
        "true",
        "多选模式下是否显示全选操作。0.17.0 起移至面板头部，显示三态与当前结果计数。"
      ],
      [
        "selectAllText",
        "string",
        "'全选'",
        "全选操作文案。"
      ],
      [
        "clearAllText",
        "string",
        "'清空已选'",
        "全部当前结果已选时的清空操作无障碍文案；可见行标题保持全选/全选结果。"
      ],
      [
        "emptyText",
        "string",
        "'暂无选项'",
        "无选项时的空状态文案。"
      ],
      [
        "searchable",
        "boolean | 'auto'",
        "'auto'",
        "auto 在原始 options.length > 8 时开启；关闭时通过 Vue 动态绑定传入布尔值 false，不要传字符串 false。"
      ],
      [
        "typeahead",
        "boolean",
        "true",
        "0.17.0 新增：面板打开且焦点不在搜索框时，按 500ms 缓冲匹配标签前缀、英文/拼音首字母。重复字符循环，跳过禁用项；关闭时不改值。"
      ],
      [
        "highlightMatches",
        "boolean",
        "true",
        "0.17.0 新增：标记默认选项标签的搜索命中。自定义 option 插槽自行处理 matchRanges；关闭后提供空区间。"
      ],
      [
        "searchPlaceholder",
        "string",
        "'搜索选项（/）'",
        "搜索框占位文案。"
      ],
      [
        "noSearchResultsText",
        "string",
        "'未找到匹配选项'",
        "搜索无结果时的空状态文案。"
      ],
      [
        "smoothScroll",
        "BingSelectSmoothScroll",
        "true",
        "仅为下拉面板的选项区启用平滑滚动；设为 false 可关闭。键盘导航仍会即时定位当前选项。"
      ],
      [
        "size",
        "'sm' | 'md' | 'lg'",
        "继承 FormItem / Form / ConfigProvider，否则 'md'",
        "触发器高度分别为 32 / 36 / 40px；选项行高单独计算。"
      ],
      [
        "block",
        "boolean",
        "false",
        "宽度是否撑满父容器。"
      ],
      [
        "width",
        "string | number",
        "undefined",
        "选择器固定宽度。"
      ],
      [
        "minWidth",
        "string | number",
        "180",
        "选择器最小宽度。"
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
        "主题变量，默认 16px",
        "玻璃模糊强度。"
      ],
      [
        "glassOpacity",
        "number",
        "主题变量，浅色 0.86 / 深色 0.92",
        "磨砂底色不透明度；显式设置会覆盖主题默认值。"
      ],
      [
        "glassSaturation",
        "number",
        "主题变量，默认 1.05",
        "玻璃饱和度。"
      ],
      [
        "panelMinHeight",
        "string | number",
        "0",
        "数字或字符串 parseFloat 后按 px；不是视口百分比。最终受最大高度和可用空间限制。"
      ],
      [
        "panelMaxHeight",
        "string | number",
        "320",
        "数字或字符串 parseFloat 后按 px，包含搜索区；视口可用空间会进一步限制高度。"
      ],
      [
        "panelPlacement",
        "'auto' | 'top' | 'bottom' | 'left' | 'right'",
        "'auto'",
        "auto 只选择上/下；显式方向不会自动翻面，但坐标与高度仍限制在视口内。"
      ],
      [
        "panelAlign",
        "'start' | 'middle' | 'end'",
        "'start'",
        "下拉面板相对触发器的对齐方式。"
      ],
      [
        "panelGap",
        "number",
        "10",
        "下拉面板和触发器之间的间距，单位 px。"
      ],
      [
        "virtual",
        "boolean | 'auto'",
        "'auto'",
        "true 对非空结果启用；auto 在过滤后的结果数严格大于 virtualThreshold 时启用。"
      ],
      [
        "virtualThreshold",
        "number",
        "80",
        "auto 模式下启用虚拟列表的选项数量阈值。"
      ],
      [
        "virtualItemHeight",
        "number",
        "随尺寸 28 / 32 / 36px；option 插槽另加 16px",
        "显式值最小 28px，向下取整；非有限值使用默认高度。description 不增加行高，自定义插槽需控制内容高度。"
      ],
      [
        "virtualOverscan",
        "number",
        "4",
        "虚拟列表额外渲染的缓冲项数量。"
      ],
      [
        "ariaLabel",
        "string",
        "undefined",
        "触发按钮的可访问名称。"
      ],
      [
        "ariaDescribedby",
        "string",
        "undefined",
        "关联额外说明元素。"
      ],
      [
        "status",
        "'default' | 'error' | 'success' | 'warning'",
        "undefined",
        "选择器状态；在表单内可继承 FormItem 状态。"
      ]
    ]
  },
  "option": {
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
        "选项展示名称。"
      ],
      [
        "value",
        "string | number",
        "选项值。"
      ],
      [
        "disabled",
        "boolean",
        "是否禁用该选项。"
      ],
      [
        "description",
        "string",
        "选项的辅助说明，默认选项详情也会读取它。"
      ],
      [
        "detail",
        "string",
        "更长的选项详情说明。"
      ],
      [
        "meta",
        "Record<string, string | number | boolean | null | undefined>",
        "额外元信息，会在默认详情面板中展示。"
      ],
      [
        "[key: string]",
        "unknown",
        "可带业务字段；插槽读取额外字段前应做类型收窄。value 必须唯一，不能重复。"
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
        "{ selectedOptions, placeholder }",
        "自定义触发器里的已选值展示。"
      ],
      [
        "option",
        "{ option, selected, matchRanges }",
        "自定义选项内容；0.17.0 新增 matchRanges: Array<{ start: number; end: number }>，为 label 的 UTF-16 区间（end 不包含），组件不会改写插槽 DOM。"
      ],
      [
        "option-detail",
        "{ option, selected, index }",
        "悬停或方向键高亮时的纯展示详情；index 为原始 options 索引。浮层 aria-hidden=true，不应放交互控件或仅在此呈现必需信息。"
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
        "BingSelectModelValue",
        "选择/移除/全选时先发送；外部赋值不发送。单选点击同一项仍可重复发送。"
      ],
      [
        "change",
        "BingSelectChangePayload",
        "随后发送 { value, option?, options }；options 是完整选项表中匹配新值的项，按选项表顺序。清空/全选时 option 为 undefined。"
      ],
      [
        "clear",
        "无",
        "仅触发器清除按钮发送：clear → update:modelValue → change。多选清空结果或删除 Tag 不发送 clear。"
      ],
      [
        "open",
        "无",
        "请求打开时发送，早于面板动画与搜索聚焦结束。"
      ],
      [
        "close",
        "无",
        "请求关闭时发送；单选选择顺序为 update:modelValue → change → close，多选选择保持面板打开。"
      ]
    ]
  },
  "types": {
    "headers": [
      "公开类型或推导方式",
      "定义或用途"
    ],
    "codeColumns": 1,
    "rows": [
      [
        "BingSelectValue",
        "string | number"
      ],
      [
        "BingSelectModelValue",
        "BingSelectValue | BingSelectValue[] | null"
      ],
      [
        "BingSelectSize",
        "'sm' | 'md' | 'lg'"
      ],
      [
        "BingSelectVirtualMode",
        "boolean | 'auto'"
      ],
      [
        "BingSelectSmoothScroll",
        "SmoothScrollValue"
      ],
      [
        "BingSelectOption",
        "上表选项结构，含业务扩展字段。"
      ],
      [
        "BingSelectChangePayload",
        "{ value: BingSelectModelValue; option?: BingSelectOption; options: BingSelectOption[] }"
      ],
      [
        "BingSelectProps",
        "上表 35 项可选属性，含玻璃效果。"
      ],
      [
        "BingSelectEmits",
        "上表 5 个事件。"
      ],
      [
        "NonNullable<BingSelectProps['panelPlacement']>",
        "'auto' | 'top' | 'bottom' | 'left' | 'right'；包入口不导出 BingSelectPanelPlacement。"
      ],
      [
        "NonNullable<BingSelectProps['panelAlign']>",
        "'start' | 'middle' | 'end'；包入口不导出 BingSelectPanelAlign。"
      ],
      [
        "NonNullable<BingSelectProps['searchable']>",
        "boolean | 'auto'；包入口不导出 BingSelectSearchable。"
      ],
      [
        "SmoothScrollValue",
        "boolean | SmoothScrollOptions"
      ],
      [
        "SmoothScrollOptions",
        "下表滚动参数；来自组件包入口。"
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
