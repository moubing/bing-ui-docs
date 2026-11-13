import type { DocsApiTables } from './types'

const propsRows = [
  ['label', 'string', 'undefined', '标签文案；如果传入默认插槽，插槽内容会替代 label。'],
  ['size', "'sm' | 'md' | 'lg'", "undefined（继承 ConfigProvider，否则 'md'）", '标签高度分别为 20/24/28px。'],
  ['tone', "'primary' | 'secondary' | 'neutral' | 'success' | 'danger' | 'warning'", "'primary'", '标签语义颜色。'],
  ['variant', "'glass' | 'soft'", "'glass'", 'glass 为细边框圆角标签；soft 为无可见边框的胶囊标签。'],
  ['closable', 'boolean', 'false', '是否显示关闭按钮。'],
  ['disabled', 'boolean', 'false', '是否禁用关闭按钮，并降低整体透明度。'],
  ['closeAriaLabel', 'string', 'undefined', '关闭按钮名称；默认是“移除 ”加 label，无 label 时为“移除标签”，不会从默认插槽提取文案。'],
]

const slotRows = [
  ['default', '-', '自定义标签内容；可放入图标、状态点或组合文本。'],
]

const eventRows = [
  ['close', 'MouseEvent', '点击关闭按钮且未 disabled 时触发；组件内部会阻止事件冒泡。'],
]

export const tagApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
