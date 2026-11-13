import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', 'undefined', '输入框 id；在 BingFormItem 内会自动继承 controlId。'],
  ['modelValue', 'BingInputValue', "''", 'string | number | null；number 类型只发布 number / null，清空为 null。'],
  ['type', "'text' | 'search' | 'email' | 'password' | 'tel' | 'url' | 'number'", "'text'", '原生 input 类型；number 额外显示数值步进按钮。'],
  ['min / max', 'number | string', 'undefined', '数值输入的原生最小值和最大值约束。'],
  ['step', 'number | string', 'undefined（原生默认 1）', '数值步长；可用小数或 any。any 的自定义步进按钮每次增减 1。'],
  ['clampOnBlur', 'boolean', 'true', '失焦或 Enter 时按 min/max 和 step 规整；step=any 不对齐。受控拒绝后恢复已接受值。'],
  ['passwordToggle', 'boolean', 'true', '密码显隐按钮，切换保留选区；已有业务按钮时显式关闭。'],
  ['prefix / suffix', 'string', 'undefined', '前后缀文字，如金额符号和 px 单位；同名插槽优先。'],
  ['maxLength / showCount', 'number / boolean', 'undefined / false', '长度限制和计数；按 UTF-16 长度计算，接近或达到上限时播报。'],
  ['loading', 'boolean', 'false', '显示加载反馈，不改变输入模型或接管请求。'],
  ['scrub', 'boolean', 'false', 'number + prefix 可横向拖动，每 4px 一步，Shift 十倍；Esc / 失焦 / 指针取消撤销。'],
  ['placeholder', 'string', 'undefined', '占位文案。'],
  ['disabled', 'boolean', '继承 FormItem / Form，否则 false', '禁用输入框；显式 false 可以覆盖表单的禁用状态。'],
  ['readonly', 'boolean', 'false', '只读，可聚焦和选择文本；隐藏清除按钮并禁用数值步进。'],
  ['clearable', 'boolean', 'search 为 true，其他类型为 false', '有值时是否展示清除按钮；可显式覆盖，禁用或只读时不显示。'],
  ['smoothCaret', 'boolean', 'true', '约 90ms 的光标位移过渡，组词时跟随原生选区焦点端；自 0.9.0 起聚焦立即定位，普通鼠标按下不切回原生光标。拖选、普通文本选区、无法可靠定位或系统减少动态效果时使用原生光标；该判断由 CSS 媒体查询完成，不受 ConfigProvider 的 reducedMotion 影响。'],
  ['icon', 'Component', 'undefined', '左侧图标组件。'],
  ['iconLabel', 'string', 'undefined', '图标的可访问名称；未传时图标为装饰性。'],
  ['size', "'sm' | 'md' | 'lg'", "继承 FormItem / Form / ConfigProvider，否则 'md'", '高度分别为 32 / 36 / 40px。'],
  ['block', 'boolean', 'false', '宽度是否撑满父容器。'],
  ['debounceDelay', 'number', '180', 'debounced-input 事件的防抖延迟，单位毫秒。'],
  ['clearAriaLabel', 'string', "'清空输入'", '清除按钮的可访问名称。'],
  ['ariaLabel', 'string', 'undefined', '输入框的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '输入框状态；在表单内可继承 FormItem 状态。'],
  ['name', 'string', 'undefined', '原生 input name。'],
  ['autocomplete', 'string', "'off'", '原生 input autocomplete；需要浏览器自动填充时显式设置。'],
  ['spellcheck', "boolean | 'true' | 'false'", 'undefined', '原生 input spellcheck。'],
]

const slotRows = [
  ['icon', '-', '自定义左侧图标内容，会覆盖 icon prop 的默认渲染。'],
  ['prefix / suffix', '-', '自定义前后缀，覆盖同名字符串属性。'],
]

const eventRows = [
  ['update:modelValue', 'BingInputValue', '文本为 string，数字为 number / null；组词和数字中间态只更新显示。'],
  ['input', '(value: string, event: Event)', '普通输入即时触发；组词确认后仅触发一次，event 可为 compositionend 或失焦收尾的 blur；清除不会触发。'],
  ['debounced-input', 'string', '输入值经过 debounceDelay 防抖后触发；组词期间暂停，确认后重新计时；清除时立即触发空字符串。'],
  ['clear', '()', '点击清除按钮时触发，无参数；同时立即发送空字符串的 debounced-input 并取消待发通知。'],
  ['focus', 'FocusEvent', '输入框获得焦点时触发。'],
  ['blur', 'FocusEvent', '离开整个控件后触发并通知表单；内部按钮间移动不触发校验。'],
  ['keydown', 'KeyboardEvent', '输入框 keydown 时触发。'],
  ['enter', '(value: BingInputValue, event: KeyboardEvent)', '非组词 Enter，数字规整后发送；keydown.preventDefault 可阻止。'],
  ['change（原生透传）', 'Event', '保持原生 change 参数；前缀拖动释放时为已接受变化发送一次。'],
]

const exposeRows = [
  ['input', 'HTMLInputElement | null', '当前原生 input 元素。'],
  ['focus()', '() => void', '聚焦输入框。'],
  ['blur()', '() => void', '让输入框失焦。'],
  ['select()', '() => void', '选中输入框内的文本。'],
]

export const inputApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  expose: { headers: ["名称","类型","说明"], codeColumns: 2, rows: exposeRows },
}
