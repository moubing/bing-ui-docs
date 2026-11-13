import type { DocsApiTables } from './types'
export const splitPaneApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: [
    ['sideSize', 'number', 'undefined', '右侧栏偏好宽度 px；受控时需接收 update:sideSize。'],
    ['defaultSideSize', 'number', '320', '初始偏好与重置目标。'],
    ['minSideSize', 'number', '160', '侧栏逻辑最小宽度，最小 0。'],
    ['maxSideSize', 'number', '640', '侧栏逻辑最大宽度，不小于 minSideSize。'],
    ['minMainSize', 'number', '240', '正文优先保留的最小宽度；空间不足时侧栏可暂时小于 minSideSize。'],
    ['keyboardStep', 'number', '12', '方向键步长 px，最小 1。'],
    ['disabled', 'boolean', 'false', '禁用拖动、键盘与重置，正在拖动时取消。'],
    ['ariaLabel', 'string', "'调整侧栏宽度'", '分隔条名称。aria-valuenow/min/max 表达当前实际可调宽度。'],
  ] },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: [
    ['default', '-', '左侧正文。'], ['side', '{ size: number }', '右侧栏；size 是当前实际宽度。'],
  ] },
  events: { headers: ['事件', '载荷', '说明'], codeColumns: 2, rows: [
    ['update:sideSize', 'number', '只在松手、键盘操作或重置时提交改变后的偏好。容器约束与取消不会发送。'],
    ['resize-start', 'BingSplitPaneResizePayload', '一次指针、键盘或重置操作开始。'],
    ['resize', 'BingSplitPaneResizePayload', '拖动中持续报告实际宽度；此时 preferredSize 仍是已提交的偏好。'],
    ['resize-end', 'BingSplitPaneResizePayload', '操作完成；preferredSize 是请求提交的偏好，适合由业务保存。'],
    ['resize-cancel', 'BingSplitPaneCancelPayload', '撤销本次拖动。容器变窄或被隐藏时 reason 为 container。之后不会再为该次操作发送 resize-end。'],
  ] },
  expose: { headers: ['方法', '类型', '说明'], codeColumns: 2, rows: [
    ['reset()', '() => void', '恢复 defaultSideSize，遵守逻辑范围；disabled 时不操作。'],
  ] },
  types: { headers: ['类型', '说明'], codeColumns: 1, rows: [
    ['BingSplitPaneProps / BingSplitPaneEmits / BingSplitPaneExpose', '属性、事件与实例方法类型。'],
    ['BingSplitPaneResizePayload', '{ size: number; preferredSize: number; source: BingSplitPaneResizeSource }'],
    ['BingSplitPaneResizeSource', "'pointer' | 'keyboard' | 'reset'"],
    ['BingSplitPaneCancelPayload', 'BingSplitPaneResizePayload & { reason: BingSplitPaneCancelReason }'],
    ['BingSplitPaneCancelReason', "'escape' | 'pointercancel' | 'capture-lost' | 'blur' | 'container' | 'props' | 'unmount'"],
  ] },
}
