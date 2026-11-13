import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', 'undefined', '原生 checkbox id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。'],
  ['modelValue', 'boolean', 'false', '是否选中。'],
  ['indeterminate', 'boolean', 'false', '半选态，只影响视觉和原生 indeterminate。'],
  ['disabled', 'boolean', 'undefined', '继承 Group/Form 禁用状态，无上下文时为 false；子项不能通过 false 解除整组禁用。'],
  ['size', "'sm' | 'md' | 'lg' | number", 'undefined', '继承 Group/Form，其次 ConfigProvider，最终默认 md；方框为 16/18/20px，带标签的最小点击高度为 32/36/40px；数字设置方框像素尺寸。'],
  ['shape', "'rounded' | 'circle'", "'rounded'", '控件形状。'],
  ['tone', "'primary' | 'secondary'", "'primary'", '颜色语义。'],
  ['label', 'string', 'undefined', '右侧文本标签。'],
  ['ariaLabel', 'string', 'undefined', '无可见标签时的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '状态样式；可继承 Group/FormItem 状态。'],
  ['name', 'string', 'undefined', '原生 checkbox name；在 Group 内会继承 name。'],
  ['value', 'string | number', 'undefined', '在 CheckboxGroup 内用于识别该选项。'],
  ['decorative', 'boolean', 'false', '只渲染视觉控件，保留选中动画；没有 input、扩展命中区、悬停幽灵勾和按压反馈，语义及交互由外层负责。'],
]

const slotRows = [
  ['default', '-', '自定义标签内容；会替代 label prop 的文本。'],
]

const eventRows = [
  ['update:modelValue', 'boolean', '选中状态变化时触发。'],
  ['change', '(value: boolean, event: Event)', '独立使用时返回布尔状态和原始事件；Group 内提供 value 的子项由 Group 发出数组变化，不再触发子项的 change/update:modelValue。'],
  ['focus', 'FocusEvent', '获得焦点时触发。'],
  ['blur', 'FocusEvent', '失去焦点时触发，并会通知 FormItem 校验。'],
]

export const checkboxApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
