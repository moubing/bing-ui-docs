import type { DocsApiTables } from './types'

const propsRows = [
  ['modelValue', 'BingTabValue', 'undefined', '受控当前值。未传时使用第一个未禁用 item。'],
  ['items', 'BingDeckTransitionItem[]', '[]', '卡片数据。每项至少需要 value 和 label，也可以附加业务字段供插槽读取。'],
  ['disabled', 'boolean', 'false', '阻止内部 next 与滚轮；外部模型仍可定位，已运行的动画不会因此自动取消。'],
  ['respectReducedMotion', 'boolean', 'true', '是否遵守减少动效策略（ConfigProvider 的 reducedMotion，默认跟随系统）。开启后需要时会直接设置卡组位置。'],
  ['loop', 'boolean', 'true', '是否循环。false 时最后一张继续 next 不发更新。默认按钮仍可点击，业务可在 controls 插槽中自行禁用。'],
  ['showControls', 'boolean', 'true', '是否显示默认控制或 controls 插槽。'],
  ['controlLabel', 'string', "'切换下一张'", '默认控制按钮文本。'],
]

const slotRows = [
  ['default.item', 'BingDeckTransitionItem', '当前渲染的卡片数据。'],
  ['default.index', 'number', '当前卡片索引。'],
  ['default.active', 'boolean', '当前卡片是否在最上层。'],
  ['default.isAnimating', 'boolean', '卡组是否正在洗牌动画中。'],
  ['controls.next', '() => void', '切换到下一张。'],
  ['controls.activeItem', 'BingDeckTransitionItem | undefined', '当前最上层卡片。'],
  ['controls.activeIndex', 'number', '当前最上层索引。'],
  ['controls.isAnimating', 'boolean', '是否正在动画中，可用于禁用自定义按钮。'],
]

const itemRows = [
  ['value', 'BingTabValue', '必填，以 Object.is 比较的唯一值；String(value) 也必须唯一，防止卡片 key 冲突。'],
  ['label', 'string', '必填，默认内容或控制文案可使用。'],
  ['disabled', 'boolean', '内部 next 命中禁用项时停止，不会自动跳过；外部模型仍可定位到此项。'],
  ['[key: string]', 'unknown', '可挂载 title、summary、accent 等业务字段。'],
]

const eventRows = [
  ['update:modelValue', 'BingTabValue', '内部 next 成功选择时首先发出，受控模式需要同步。外部直接赋值不触发。'],
  ['change', 'BingDeckTransitionChangePayload', '内部选择在 update:modelValue 后发出，包含 value、previousValue、item、previousItem；不表示动画完成，外部赋值不触发。'],
]

export const deckTransitionApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽参数","类型","说明"], codeColumns: 2, rows: slotRows },
  item: { headers: ["字段","类型","说明"], codeColumns: 2, rows: itemRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  types: { headers: ['公开类型', '定义或用途'], codeColumns: 1, rows: [
    ['BingTabValue', 'string | number'],
    ['BingDeckTransitionProps', '上表中的 7 个可选属性。'],
    ['BingDeckTransitionItem', '{ value: BingTabValue; label: string; disabled?: boolean; [key: string]: unknown }'],
    ['BingDeckTransitionSlotProps', '{ item: BingDeckTransitionItem; index: number; active: boolean; isAnimating: boolean }'],
    ['BingDeckTransitionControlsSlotProps', '{ next: () => void; activeItem?: BingDeckTransitionItem; activeIndex: number; isAnimating: boolean }'],
    ['BingDeckTransitionChangePayload', '{ value: BingTabValue; previousValue?: BingTabValue; item: BingDeckTransitionItem; previousItem?: BingDeckTransitionItem }'],
    ['BingDeckTransitionEmits', 'update:modelValue(value: BingTabValue) 与 change(payload: BingDeckTransitionChangePayload)。'],
  ] },
}
