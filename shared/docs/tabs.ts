import type { DocsApiTables } from './types'

const propsRows = [
  ['modelValue', 'BingTabValue', 'undefined', '当前选中的 tab value；传入后进入受控模式，支持 v-model。'],
  ['items', 'BingTabItem[]', '[]', 'tab 列表。每一项至少包含 value 和 label。'],
  ['smoothScroll', 'SmoothScrollValue', 'true', '为标签栏溢出时的横向滚轮滚动启用平滑效果。'],
  ['size', "'sm' | 'md' | 'lg'", "undefined（继承 ConfigProvider，否则 'md'）", '可见标签栏高度为 32/36/40px，单个标签最小高度为 24/28/32px。外层上下各留白 4px，总占位 40/44/48px；横向滚动条使用底部预留区，不改变垂直中心或总高度。'],
  ['variant', "'pill' | 'glass' | 'soft'", "'pill'", '控制视觉风格。'],
  ['activation', "'auto' | 'manual'", "'auto'", '键盘方向键移动焦点时是否自动切换选中项。'],
  ['disabled', 'boolean', 'false', '禁用整个 Tabs。'],
  ['block', 'boolean', 'false', '是否撑满容器宽度。'],
  ['loop', 'boolean', 'true', '键盘方向键到达边界后是否循环。'],
  ['animated', 'boolean', 'true', '是否使用 GSAP 移动活动指示器。'],
  ['respectReducedMotion', 'boolean', 'true', '需要减少动效时是否关闭指示器动画；策略来自 ConfigProvider 的 reducedMotion，默认跟随系统。'],
  ['ariaLabel', 'string', "'标签页'", 'tablist 的可访问名称。多个 Tabs 应分别提供可区分名称。'],
]

const itemRows = [
  ['value', 'string | number', '每个 tab 的唯一值，也是 v-model 的值。'],
  ['label', 'string', '默认渲染的 tab 文案。'],
  ['disabled', 'boolean', '禁用当前 tab；点击和键盘切换都会跳过。'],
  ['ariaLabel', 'string', '当前 tab 的可访问名称，适合 label 不够完整时补充。'],
  ['[key: string]', 'unknown', '可挂载 count、tone 等业务字段，配合 item 插槽渲染。'],
]

const slotsRows = [
  ['item', '{ item, index, active, disabled }', '自定义每个 tab 的内容。未传时显示 item.label。'],
]

const eventRows = [
  ['update:modelValue', 'BingTabValue', '选中项变化时触发。'],
  ['change', 'BingTabsChangePayload', '点击或键盘确认切换后触发，包含 value、previousValue、item、previousItem 和原始事件。'],
  ['focus', 'BingTabsFocusPayload', '某个 tab 获得焦点时触发。'],
  ['blur', 'BingTabsFocusPayload', '某个 tab 失去焦点时触发。'],
]

export const tabsApi: DocsApiTables = {
  props: { headers: ['Prop', 'Type', 'Default', '说明'], codeColumns: 3, rows: propsRows },
  item: { headers: ['字段', 'Type', '说明'], codeColumns: 2, rows: itemRows },
  slots: { headers: ['Slot', '参数', '说明'], codeColumns: 2, rows: slotsRows },
  events: { headers: ['Event', 'Payload', '说明'], codeColumns: 2, rows: eventRows },
}
