import type { DocsApiTables } from './types'

export const sortableListApi: DocsApiTables = {
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
        "items",
        "T[]",
        "[]",
        "需要排序的数据源。组件不会修改 items，只通过 order 表示当前顺序。"
      ],
      [
        "order",
        "BingSortableListKey[]",
        "undefined",
        "受控键顺序，使用 v-model:order 及时同步。归一化只影响显示，不会主动修正外部 order。未传时维护本地顺序。"
      ],
      [
        "itemKey",
        "BingSortableListItemKey<T>",
        "'id'",
        "keyof T 或 (item, sourceIndex) => string | number。默认读取 id，无效字段回退源索引；动态数据请提供稳定唯一 key，示例使用函数解析器。"
      ],
      [
        "itemDisabled",
        "BingSortableListItemDisabled<T>",
        "undefined",
        "读取字段或调用 (item, sourceIndex)；与 disabledKeys 合并。仅禁止该项发起排序，不固定它的索引。"
      ],
      [
        "disabledKeys",
        "Array<string | number>",
        "[]",
        "用严格 key 比较禁用操作源；其他项或外部 order 仍可使禁用项移位。"
      ],
      [
        "axis",
        "'vertical' | 'horizontal'",
        "'vertical'",
        "控制布局和对应方向键；不会把指针轨迹锁定为单一轴。"
      ],
      [
        "disabled",
        "boolean",
        "false",
        "禁用整个列表。"
      ],
      [
        "keyboard",
        "boolean",
        "true",
        "是否允许通过方向键、Home、End 调整顺序。"
      ],
      [
        "flip",
        "boolean",
        "true",
        "控制排序过渡与外部 order 的 FLIP；不等同于关闭落位动画，后者由 settleDuration 控制。"
      ],
      [
        "reorderMode",
        "'drop' | 'live'",
        "'drop'",
        "drop 在释放拖拽时提交；live 在拖动过程中同步提交。"
      ],
      [
        "duration",
        "number",
        "0.26",
        "排序项移动动画时长，单位秒。"
      ],
      [
        "settleDuration",
        "number",
        "0.16",
        "拖拽释放后的落位动画时长，单位秒。"
      ],
      [
        "dragThreshold",
        "number",
        "4",
        "指针移动超过该距离后才激活拖拽，单位 px。"
      ],
      ["dragOverlay", "boolean", "false", "独立拖拽浮层，复用默认插槽；浮层不可交互。"],
      [
        "ariaLabel",
        "string",
        "'可排序列表'",
        "列表本身的可访问名称。"
      ],
      [
        "handleAriaLabel",
        "string | (item, index) => string",
        "'调整顺序'",
        "手柄名称；函数的 index 是当前渲染位置，与 itemKey/itemDisabled 的源索引不同。建议包含项目名称。"
      ]
    ]
  },
  "slots": {
    "headers": [
      "参数",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "item",
        "T",
        "当前渲染的数据项。"
      ],
      [
        "key",
        "string | number",
        "当前项的唯一 key。"
      ],
      [
        "index",
        "number",
        "当前项在有效顺序中的位置。"
      ],
      [
        "active",
        "boolean",
        "当前项是否是正在拖拽的源项。"
      ],
      [
        "dragging",
        "boolean",
        "当前项是否处于拖拽、落位或拖拽源状态。"
      ],
      [
        "disabled",
        "boolean",
        "当前项是否被禁用。"
      ],
      [
        "handleProps",
        "BingSortableListHandleProps",
        "必须绑定到拖拽手柄或整个可拖拽卡片上。"
      ]
    ]
  },
  "handle": {
    "headers": [
      "字段",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "ref",
        "(element) => void",
        "把真实手柄元素交给 dnd-kit。"
      ],
      [
        "role",
        "'button'",
        "让非按钮元素具备按钮语义。"
      ],
      [
        "tabindex",
        "number",
        "可用时为 0，禁用时为 -1。"
      ],
      [
        "aria-label",
        "string",
        "手柄可访问名称。"
      ],
      [
        "aria-disabled",
        "'true' | 'false'",
        "手柄禁用状态。"
      ],
      [
        "onKeydown",
        "(event) => void",
        "处理方向键、Home 和 End 的键盘排序。"
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
        "update:order",
        "BingSortableListKey[]",
        "有效顺序变化时先发送；外部改值、归一化或边界无移动时不发送。"
      ],
      [
        "reorder",
        "BingSortableListPayload<T>",
        "随后发送 { key, item, from, to, order, event? }；索引从 0 开始。键盘每次直接提交，不发送拖拽事件。"
      ],
      [
        "drag-start",
        "BingSortableListDragPayload<T>",
        "超过指针激活距离才发送，包含原始 PointerEvent。"
      ],
      [
        "drag",
        "BingSortableListDragPayload<T>",
        "移动时发送当前投影顺序；drop 模式尚未改变受控 order，live 模式随后按变化提交。"
      ],
      [
        "drag-end",
        "BingSortableListDragPayload<T>",
        "成功结束时发送；drop 模式先更新顺序再发送，取消拖拽不发送。live 已提交的顺序不会自动撤销。"
      ]
    ]
  },
  "types": {
    "headers": [
      "公开类型",
      "定义或用途"
    ],
    "codeColumns": 1,
    "rows": [
      [
        "BingSortableListKey",
        "string | number"
      ],
      [
        "BingSortableListAxis",
        "'vertical' | 'horizontal'"
      ],
      [
        "BingSortableListReorderMode",
        "'drop' | 'live'"
      ],
      [
        "BingSortableListItemKey<T>",
        "keyof T | ((item: T, index: number) => BingSortableListKey)"
      ],
      [
        "BingSortableListItemDisabled<T>",
        "keyof T | ((item: T, index: number) => boolean)"
      ],
      [
        "BingSortableListProps<T>",
        "上表 16 项属性。"
      ],
      [
        "BingSortableListPayload<T>",
        "{ key: BingSortableListKey; item: T; from: number; to: number; order: BingSortableListKey[]; event?: PointerEvent | KeyboardEvent }"
      ],
      [
        "BingSortableListDragPayload<T>",
        "{ key: BingSortableListKey; item: T; index: number; order: BingSortableListKey[]; event: PointerEvent }"
      ],
      [
        "BingSortableListEmits<T>",
        "上表 5 个事件。"
      ],
      [
        "BingSortableListSlotProps<T>",
        "默认插槽的 item、key、index、active、dragging、disabled、handleProps。"
      ],
      [
        "BingSortableListHandleProps",
        "HTMLAttributes 加 ref 回调、role='button'、tabindex、aria-label、aria-disabled 和 onKeydown。"
      ]
    ]
  }
}
