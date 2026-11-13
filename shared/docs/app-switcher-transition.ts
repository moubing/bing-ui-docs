import type { DocsApiTables } from './types'

const propsRows = [
  ['modelValue', 'BingTabValue', 'undefined', '受控当前值。未传时会使用第一个未禁用 item 作为初始面板。'],
  ['items', 'BingAppSwitcherTransitionItem[]', '[]', '面板数据。每项至少需要 value 和 label，可额外挂载业务字段给默认插槽使用。'],
  ['disabled', 'boolean', 'false', '阻止内置标签和滚轮选择。外部修改模型仍能切换；不会因此取消已经运行的动画。'],
  ['respectReducedMotion', 'boolean', 'true', '是否遵守减少动效策略（ConfigProvider 的 reducedMotion，默认跟随系统）。开启后会在需要时跳过动画。'],
  ['loop', 'boolean', 'true', '是否允许索引循环。影响内置 tabs 的键盘行为和横向滚轮切换边界。'],
  ['showTabs', 'boolean', 'true', '是否显示底部内置 BingTabs。隐藏后仍然可以通过 v-model 外部切换。'],
  ['ariaLabel', 'string', "'应用切换面板'", '传给内置 BingTabs 的可访问名称。'],
]

const itemRows = [
  ['value', 'BingTabValue', '必填，以 Object.is 比较的面板唯一值；String(value) 也必须唯一，避免数字与同名字符串的卡片 key 冲突。'],
  ['label', 'string', '必填，内置 tabs 显示的文本。'],
  ['disabled', 'boolean', '阻止内部选择此项，横向滚轮遇到禁用邻项不会自动跨过；外部模型赋值不受此限制。'],
  ['ariaLabel', 'string', '当前 tab 的可访问名称。'],
  ['[key: string]', 'unknown', '可挂载 title、summary、icon 等业务字段，在默认插槽里读取。'],
]

const slotRows = [
  ['item', 'BingAppSwitcherTransitionItem', '当前渲染的 item。'],
  ['index', 'number', '当前卡片在 items 中的索引。'],
  ['active', 'boolean', '当前卡片是否为选中面板。'],
  ['isAnimating', 'boolean', '组件是否正在执行切换动画。'],
]

const eventRows = [
  ['update:modelValue', 'BingTabValue', '内部标签或横向滚轮选中新值时触发，用于同步受控模型。外部直接赋值不触发。'],
  ['change', 'BingAppSwitcherTransitionChangePayload', '内部选择在 update:modelValue 后触发，包含 value、previousValue、item、previousItem；不表示动画完成，外部赋值不触发。'],
]

export const appSwitcherTransitionApi: DocsApiTables = {
  slots: { headers: ["参数","类型","说明"], codeColumns: 2, rows: slotRows },
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  item: { headers: ["字段","类型","说明"], codeColumns: 2, rows: itemRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  types: { headers: ['公开类型', '定义或用途'], codeColumns: 1, rows: [
    ['BingTabValue', 'string | number'],
    ['BingAppSwitcherTransitionProps', '上表中的 7 个可选属性。'],
    ['BingAppSwitcherTransitionItem', '{ value: BingTabValue; label: string; disabled?: boolean; ariaLabel?: string; [key: string]: unknown }'],
    ['BingAppSwitcherTransitionSlotProps', '{ item: BingAppSwitcherTransitionItem; index: number; active: boolean; isAnimating: boolean }'],
    ['BingAppSwitcherTransitionChangePayload', '{ value: BingTabValue; previousValue?: BingTabValue; item: BingAppSwitcherTransitionItem; previousItem?: BingAppSwitcherTransitionItem }'],
    ['BingAppSwitcherTransitionEmits', 'update:modelValue(value: BingTabValue) 与 change(payload: BingAppSwitcherTransitionChangePayload)。'],
  ] },
}
