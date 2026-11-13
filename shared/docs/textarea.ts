import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', 'undefined', 'textarea id；在 BingFormItem 内会自动继承 controlId。'],
  ['modelValue', 'string', "''", '当前文本值。'],
  ['placeholder', 'string', 'undefined', '占位文案。'],
  ['disabled', 'boolean', '继承 FormItem / Form，否则 false', '禁用输入与聚焦；显式 false 可覆盖表单禁用。'],
  ['readonly', 'boolean', 'false', '只读，可聚焦和选择文本；不能编辑，且不显示清除按钮。'],
  ['clearable', 'boolean', 'false', '显式开启清除；5 秒内且焦点未离开控件可 Ctrl / ⌘+Z 撤销，新输入后失效。'],
  ['smoothCaret', 'boolean', 'true', '0.10.0 起默认启用约 90ms 平滑光标，支持多行、自动折行、滚动和中文组词。只改变装饰光标，不延迟模型更新；选择文本、只读、触屏、系统减少动态效果或无法可靠定位时使用原生光标；该判断由 CSS 媒体查询完成，不受 ConfigProvider 的 reducedMotion 影响。'],
  ['rows', 'number', '3', '原生 textarea rows，也作为 autosize 的默认最小行数。'],
  ['autosize', 'boolean | { minRows?: number; maxRows?: number }', 'false', '是否按内容自动调整高度，可限制最小和最大行数。'],
  ['autosizeTransition', 'boolean', 'true', '自动增高默认过渡 120ms；超过三行、到达上限、宽度变化和减少动态效果时直接调整。'],
  ['submitOn', 'BingTextareaSubmitOn', "'none'", 'enter 提交且保留 Shift+Enter 换行；mod-enter 为 Ctrl / ⌘+Enter；none 只换行。'],
  ['maxLength', 'number', 'undefined', '原生 maxlength；配合 showCount 展示最大长度。'],
  ['showCount', 'boolean', 'false', '是否显示字数统计。'],
  ['countFormatter', '(count: number, max?: number) => string', 'undefined', '自定义可见计数；阈值播报不逐字重复。'],
  ['size', "'sm' | 'md' | 'lg'", "继承 FormItem / Form / ConfigProvider，否则 'md'", '控制文本字号和内边距，多行高度由 rows、内容及 autosize 决定。'],
  ['block', 'boolean', 'false', '是否撑满父容器；在 BingFormItem 内默认撑满。'],
  ['ariaLabel', 'string', 'undefined', '无可见标签时的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素；在表单内会合并表单说明。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '状态样式；在表单内可继承 FormItem 状态。'],
  ['name', 'string', 'undefined', '原生 textarea name。'],
  ['autocomplete', 'string', 'undefined', '原生 autocomplete。'],
  ['spellcheck', "boolean | 'true' | 'false'", 'undefined', '原生 spellcheck。'],
  ['resize', "'none' | 'vertical' | 'horizontal' | 'both'", "'vertical'", '原生 CSS resize 行为。'],
  ['clearAriaLabel', 'string', "'清空文本'", '清除按钮的可访问名称。'],
]

const eventRows = [
  ['update:modelValue', 'string', '输入或清除时触发。'],
  ['input', '(value: string, event: Event)', '确认输入后触发；组词草稿仅改变显示、计数和高度，清除不触发 input。'],
  ['clear', '-', '清除按钮更新模型为空字符串后触发，无参数，并重新聚焦 textarea。'],
  ['focus', 'FocusEvent', '获得焦点时触发。'],
  ['blur', 'FocusEvent', '离开整个控件后触发并校验；清除按钮和内部滚动条间移动不触发。'],
  ['keydown', 'KeyboardEvent', '按键按下时触发。'],
  ['submit', '(value: string, event: KeyboardEvent)', '匹配 submitOn 且非组词时提交；业务 keydown.preventDefault 可阻止。'],
  ['resize', 'number', '初次测量及自动高度稳定后各通知一次 textarea 高度（px），不包含外框和计数区。'],
]

const exposeRows = [
  ['textarea', 'HTMLTextAreaElement | null', '当前原生 textarea 元素。'],
  ['focus()', '() => void', '聚焦 textarea。'],
  ['blur()', '() => void', '让 textarea 失焦。'],
  ['select()', '() => void', '选中文本内容。'],
]

export const textareaApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  expose: { headers: ["名称","类型","说明"], codeColumns: 2, rows: exposeRows },
}
