import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', 'undefined', 'Group 根节点 id；默认自动生成唯一值，在 BingFormItem 内自动关联字段标签。'],
  ['modelValue', 'BingRadioValue | null', 'null', '当前选中的值。'],
  ['options', 'BingRadioGroupOption[]', '[]', '通过配置自动渲染子 Radio。传入默认插槽时，插槽内容会替代 options 渲染。'],
  ['disabled', 'boolean', 'undefined', '继承 Form，最终默认 false；true 禁用所有子项，false 可覆盖表单禁用；启用整组时仍保留选项自己的禁用状态。'],
  ['size', "'sm' | 'md' | 'lg'", 'undefined', '整组选项尺寸；继承 Form，其次 ConfigProvider，最终默认 md，圆点控件为 16/18/20px。'],
  ['direction', "'row' | 'column' | 'wrap'", "'wrap'", '控制选项排列方向。'],
  ['name', 'string', 'undefined', '子 Radio 的原生 name；默认生成组内统一、组间唯一的名称。'],
  ['ariaLabel', 'string', 'undefined', 'Radiogroup 的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素；在 BingFormItem 内会合并表单说明。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '整组状态样式；在 BingFormItem 内可继承校验状态。'],
]

const optionRows = [
  ['label', 'string', '必填', '自动渲染模式下的选项主文案。'],
  ['value', 'string | number | boolean', '必填', '写入 modelValue 的选项值。'],
  ['disabled', 'boolean', 'false', '是否禁用当前选项。'],
  ['description', 'string', 'undefined', '选项描述文案；自动渲染时展示在 label 下方。'],
]

const slotRows = [
  ['default', '-', '自定义子 Radio 列表；使用插槽时不会渲染 options。'],
]

const eventRows = [
  ['update:modelValue', 'BingRadioValue', '选中值变化时触发。'],
  ['change', '(value: BingRadioValue, event: Event)', '子 Radio 原生 change 后触发，两个参数分别为最新选中值与原始事件。'],
  ['focus', 'FocusEvent', '焦点从组外进入任意子 Radio 时触发一次。'],
  ['blur', 'FocusEvent', '焦点离开整组时触发，并通知 FormItem 进行 blur 校验。'],
]

export const radioGroupApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  option: { headers: ["字段","类型","默认值","说明"], codeColumns: 3, rows: optionRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
