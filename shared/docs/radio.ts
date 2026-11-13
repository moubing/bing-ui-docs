import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', 'undefined', '原生 radio id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。'],
  ['modelValue', 'BingRadioValue | null', 'null', '当前选中的值；放在 RadioGroup 内时由 Group 接管。'],
  ['value', 'BingRadioValue', 'true', '当前 Radio 代表的值，选中时写入 modelValue。'],
  ['disabled', 'boolean', 'undefined', '继承 RadioGroup/Form 禁用状态，无上下文时为 false；子项不能通过 false 解除整组禁用。'],
  ['size', "'sm' | 'md' | 'lg'", 'undefined', '继承 RadioGroup/Form，其次 ConfigProvider，最终默认 md；圆点控件为 16/18/20px，带标签的最小点击高度为 32/36/40px。'],
  ['label', 'string', 'undefined', '右侧主文案。'],
  ['description', 'string', 'undefined', '右侧辅助说明文案。'],
  ['ariaLabel', 'string', 'undefined', '无可见标签时的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素；独立使用并放在 FormItem 内时会合并表单说明。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '状态样式；在 RadioGroup/FormItem 内会继承校验状态。'],
  ['name', 'string', 'undefined', '原生 radio name；放在 RadioGroup 内会继承 Group 的统一 name。'],
]

const slotRows = [
  ['default', '-', '自定义主标签内容；会替代 label prop。'],
  ['description', '-', '自定义描述内容；会替代 description prop。'],
]

const eventRows = [
  ['update:modelValue', 'BingRadioValue', '独立使用时，当前 Radio 被选中后触发。'],
  ['change', '(value: BingRadioValue, event: Event)', '独立使用时选中后触发，接收两个参数；组内由 Group 发出，子项不再单独触发。'],
  ['focus', 'FocusEvent', '获得焦点时触发。'],
  ['blur', 'FocusEvent', '失去焦点时触发；独立使用时会通知 FormItem blur 校验。'],
]

export const radioApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
