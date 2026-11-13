import type { DocsApiTables } from './types'

const propsRows = [
  ['skipDelay', 'number', '300', '上一个提示关闭后免去悬停等待的时间窗口，单位毫秒。'],
  ['scrollable', 'boolean', 'false', '默认仅溢出时启用滚动；富内容可显式开启以保持滚动容器结构稳定。'],
  ['suppressWhenExpanded', 'boolean', 'true', '实际触发器 aria-expanded=true 时自动关闭并抑制提示；业务特殊策略可显式关闭。'],
  ['shortcut', 'string | string[]', 'undefined', '显示快捷键键帽并向触发器提供 aria-keyshortcuts，不注册按键动作。'],
  ['tone', 'BingTooltipTone', "'surface'", 'surface 使用普通表面色；inverse 使用反色提示。'],
  ['modelValue', 'boolean', 'false', '省略时内部维护；显式传入需同步更新。共享面板被替换时旧实例发出 false 与 close(replaced)。'],
  ['content', 'string', 'undefined', '提示内容。需要复杂结构时使用 content 插槽。'],
  ['trigger', 'BingTooltipTrigger | BingTooltipTrigger[]', "'hover'", 'hover 响应指针与键盘可见焦点；鼠标点击后抑制到离开。click / manual 固定面板，阻止其他 hover / focus 接管。'],
  ['placement', "'top' | 'right' | 'bottom' | 'left'", "'top'", '首选展示方向；空间不足时会自动翻转或贴边。'],
  ['align', "'start' | 'center' | 'end'", "'center'", '上/下方向控制水平对齐，左/右方向控制垂直对齐；边缘约束可能修正坐标。'],
  ['disabled', 'boolean', 'false', '隐藏并阻止打开，发出 close(disabled)；受控模型保留，恢复启用不会自动重开，需要再次触发或调用 show。'],
  ['interactive', 'boolean', 'true', '内容区是否可交互。开启后鼠标进入浮层不会立即关闭。'],
  ['openDelay', 'number', '180', 'hover/focus 初次打开的延迟，最小为 0；已有活动提示时切换到另一个提示会跳过此延迟。click 和实例方法立即请求打开。'],
  ['closeDelay', 'number', '90', 'hover/focus 离开后的关闭延迟，单位毫秒。'],
  ['offset', 'number', '10', '浮层与锚点之间的距离，单位像素。'],
  ['viewportPadding', 'number', '12', '浮层贴近视口边缘时保留的最小间距。'],
  ['maxWidth', 'string | number', '280', '浮层最大宽度（含边框与内边距）；数字会转为 px，不固定短内容的宽高。自 0.9.1 起滚动轨道复用内边距，短提示没有额外滚动槽留白。'],
  ['zIndex', 'number', "undefined（基准 + 1200，默认 3200）", '浮层 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 1200。'],
  ['closeOnOutside', 'boolean', 'true', '任何触发方式打开后，浮层和触发器之外的 pointerdown 是否请求关闭。手动外部切换按钮建议设为 false。'],
  ['closeOnEsc', 'boolean', 'true', '按 Escape 是否关闭。'],
  ['id', 'string', 'undefined', '自定义 tooltip id；未传时自动生成。'],
  ['ariaLabel', 'string', 'undefined', '浮层 role="tooltip" 的可访问名称。'],
  ['glass', 'boolean', 'true', '是否启用玻璃质感背景变量。'],
  ['glassBlur', 'string | number', 'undefined（主题默认 16）', '玻璃模糊强度。数字会转为 px。'],
  ['glassOpacity', 'number', 'undefined（浅色 0.86 / 深色 0.92）', '玻璃层不透明度。'],
  ['glassSaturation', 'number', 'undefined（主题默认 1.05）', '玻璃层饱和度。'],
]

const slotsRows = [
  ['default', "{ open: boolean; show: BingTooltipExpose['show']; hide: BingTooltipExpose['hide']; toggle: BingTooltipExpose['toggle']; triggerProps: BingTooltipTriggerProps }", 'open 表示实际显示。自动关联首个可聚焦目标；多目标时将 triggerProps 绑定到指定按钮，禁用按钮使用可聚焦包装。'],
  ['content', '-', '自定义浮层内容；传入后优先于 content 字符串。'],
]

const eventRows = [
  ['update:modelValue', 'boolean', '内部交互请求改变状态时触发；外部赋值不重复发出更新。受控父组件不接收时不会改变打开状态。'],
  ['open', 'BingTooltipOpenReason', '有效打开状态变为 true 时触发；初始 modelValue=true 不发送初次 open，外部后续切换默认为 manual。'],
  ['close', 'BingTooltipCloseReason', '关闭原因包括 replaced（共享面板换主）；点击 hover 提示关闭后不会因鼠标焦点重新打开。'],
]

const exposeRows = [
  ['show(reason?)', '(reason?: BingTooltipOpenReason) => void', '立即请求打开，默认原因 manual；已打开但失去共享浮层时重新接管。受控模式仍需同步模型。'],
  ['hide(reason?)', '(reason?: BingTooltipCloseReason) => void', '立即请求关闭并取消待打开计时器，默认原因 manual。'],
  ['toggle(reason?)', '(reason?: BingTooltipOpenReason | BingTooltipCloseReason) => void', '按当前是否占用共享浮层切换。手动操作使用默认或 manual 原因。'],
  ['updatePosition()', '() => void', '仅实际显示时生效；DOM 内容或布局变化后先 await nextTick() 再调用。'],
]

const typeRows = [
  ['BingTooltipTone', "'surface' | 'inverse'"],
  ['BingTooltipTriggerProps', '触发目标标记及可选 aria-describedby、aria-controls、aria-expanded、aria-keyshortcuts。'],
  ['BingTooltipTrigger', "'hover' | 'click' | 'manual'"],
  ['BingTooltipPlacement', "'top' | 'right' | 'bottom' | 'left'"],
  ['BingTooltipAlign', "'start' | 'center' | 'end'"],
  ['BingTooltipOpenReason', "'hover' | 'click' | 'focus' | 'manual'"],
  ['BingTooltipCloseReason', "'hover' | 'click' | 'focus' | 'outside' | 'escape' | 'manual' | 'disabled' | 'replaced'"],
]

export const tooltipApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: slotsRows },
  events: { headers: ['事件', '参数', '说明'], codeColumns: 2, rows: eventRows },
  expose: { headers: ['方法', '签名', '说明'], codeColumns: 2, rows: exposeRows },
  types: { headers: ['类型', '定义'], codeColumns: 2, rows: typeRows },
}
