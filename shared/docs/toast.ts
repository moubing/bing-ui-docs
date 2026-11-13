import type { DocsApiTables } from './types'

const propsRows = [
  ['viewportPosition', 'BingToastViewportPosition', "'all'", '当前活动视口渲染的位置，支持别名。只有最先注册的视口活动，建议只挂载一个 all 视口。'],
  ['zIndex', 'number', "undefined（基准 + 100，默认 2100）", 'Toast 根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 100，Provider 需包住视口组件。'],
  ['offset', 'string | number', '18', 'Toast 区域距离视口边缘的距离；数字会转为 px。'],
  ['gap', 'string | number', '10', '同一位置内 Toast 之间的间距；数字会转为 px。'],
  ['width', 'string | number', '360', 'Toast 卡片宽度；移动端会自动适配可用宽度。'],
  ['max', 'number', '5', '视觉堆叠深度上限；不会裁剪多余 Toast，多余内容仍在滚动区域内。'],
  ['smoothScroll', 'boolean | BingScrollbarSmoothOptions', 'true', '为各位置中可溢出的消息堆叠启用平滑滚动；配置结构与 Scrollbar 相同。'],
]

const optionRows = [
  ['id', 'string | number', '自动生成', '转为字符串的唯一 id；已有 id 整条替换且保留 createdAt/order，省略字段使用新消息默认值。'],
  ['title', 'string', 'undefined', 'Toast 标题。只传 title 不传 message 时，title 会作为 message 展示。'],
  ['message', 'string', 'undefined', 'Toast 正文。'],
  ['type', 'BingToastType', "'default'", '消息类型：default、success、error、loading、warning、info。调用 success/error 等方法时会覆盖 type。'],
  ['duration', 'number', '按类型决定', '毫秒。default 3200、success 2600、error 4200、loading 0、warning 3600、info 3200；带 action 时至少 6000，loading 仍为 0。0 不自动关闭；负数按 0，非有限值回退默认。队列变化会重启计时。'],
  ['action', 'BingToastAction', 'undefined', '提示内的单个操作按钮，例如撤销。同 id 更新并复用同一对象（含其 Vue 响应式代理）时保留处理中状态；新对象表示更换操作。'],
  ['closable', 'boolean', 'true', '是否显示关闭按钮；false 不阻止自动关闭或服务关闭。'],
  ['position', 'BingToastPosition', "'top-right'", '消息出现的位置。top-center 映射到 top，bottom-center 映射到 bottom。'],
  ['ariaLabel', 'string', 'undefined', 'Toast article 的可访问名称。'],
  ['closeAriaLabel', 'string', "'关闭消息'", '关闭按钮的可访问名称。'],
]

const actionRows = [
  ['label', 'string', '必填', '按钮文字。'],
  ['onClick', '(toast: BingToastItem) => unknown', '必填', '点击回调。返回 Promise 时显示处理中并暂停计时，兑现后按 closeOnClick 处理，拒绝时保留提示供重试；同步抛错交给应用的 errorHandler。回调内更换 action 或关闭后重建同 id 提示时，旧操作不会改动新提示的状态。'],
  ['closeOnClick', 'boolean', 'true', '操作完成后是否关闭提示；false 时恢复按钮并重新计时。'],
  ['ariaLabel', 'string', 'undefined', '按钮的可访问名称，未传时使用 label。'],
]

const serviceRows = [
  ['show(input)', '(input: BingToastInput) => string', '保留对象中的 type，未提供时为 default；字符串作为 message。返回归一化的 id。'],
  ['success(input)', '(input: BingToastInput) => string', '创建或替换为 success，覆盖输入中的 type。'],
  ['error(input)', '(input: BingToastInput) => string', '创建或替换为 error，覆盖输入中的 type。'],
  ['fail(input) / failed(input)', '(input: BingToastInput) => string', 'error 的两个别名。'],
  ['loading(input)', '(input: BingToastInput) => string', '创建或替换为 loading，默认 duration 为 0。'],
  ['warning(input)', '(input: BingToastInput) => string', '创建或替换为 warning。'],
  ['info(input)', '(input: BingToastInput) => string', '创建或替换为 info。'],
  ['close(id)', '(id: string | number) => void', '按字符串 id 移除消息，不触发组件 close 事件。'],
  ['clear(position?)', '(position?: BingToastPosition) => void', '清空全部消息，或指定归一化位置的消息；不触发组件 close 事件。'],
  ['getToasts()', '() => BingToastItem[]', '返回当前队列数组的浅拷贝，元素未深拷贝；请勿直接修改。'],
  ['useBingToast()', '() => BingToastService', '公开函数，返回与 bingToast 相同的全局服务，不创建独立队列。'],
]

const eventRows = [
  ['close', 'BingToastItem', '仅用户点击关闭按钮触发；事件发出时消息仍在队列，随后组件将其移除并重启剩余计时器。'],
]

const typeRows = [
  ['BingToastType', "'default' | 'success' | 'error' | 'loading' | 'warning' | 'info'", '消息类型。'],
  ['BingToastRenderPosition', "'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", '归一化后的八个位置，也可从 BING_TOAST_POSITIONS 读取。'],
  ['BingToastPosition', "BingToastRenderPosition | 'top-center' | 'bottom-center'", '包含两个别名，BING_TOAST_POSITION_OPTIONS 包含全部十个输入位置。'],
  ['BingToastViewportPosition', "BingToastPosition | 'all'", '视口筛选范围。'],
  ['BingToastInput', 'string | BingToastOptions', '服务创建或更新方法的入参。'],
  ['BingToastAction', '{ label: string; onClick: (toast: BingToastItem) => unknown; closeOnClick?: boolean; ariaLabel?: string }', '操作按钮配置。'],
]
const itemRows = [
  ['id', 'string', '输入 id 字符串化，或自动生成。'],
  ['type', 'BingToastType', '实际消息类型。'],
  ['title', 'string | undefined', '仅在有非空 message 时单独保留标题。'],
  ['message', 'string', '正文；message 缺失或空字符串时回退 title，再回退空字符串。'],
  ['duration', 'number', '归一化后的持续时间。'],
  ['closable', 'boolean', '是否显示关闭按钮。'],
  ['position', 'BingToastRenderPosition', '归一化后的显示位置。'],
  ['createdAt', 'number', '创建时间戳，更新已有 id 时保留。'],
  ['order', 'number', '创建顺序，更新已有 id 时保留；显示时新消息在前。'],
  ['ariaLabel', 'string | undefined', '提示的可访问名称。'],
  ['closeAriaLabel', 'string', '关闭按钮的可访问名称。'],
  ['action', 'BingToastAction | undefined', '创建时传入的操作按钮配置，读取时可能是 Vue 响应式代理；原对象与代理视为同一操作。'],
  ['actionPending', 'boolean', '操作按钮返回的 Promise 尚未完成。'],
]

export const toastApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  option: { headers: ['字段', '类型', '默认值', '说明'], codeColumns: 3, rows: optionRows },
  action: { headers: ['字段', '类型', '默认值', '说明'], codeColumns: 3, rows: actionRows },
  service: { headers: ['方法', '签名', '说明'], codeColumns: 2, rows: serviceRows },
  events: { headers: ['事件', '参数', '说明'], codeColumns: 2, rows: eventRows },
  types: { headers: ['类型', '定义', '说明'], codeColumns: 2, rows: typeRows },
  item: { headers: ['字段', '类型', '说明'], codeColumns: 2, rows: itemRows },
}
