import type { DocsApiTables } from './types'

const propsRows = [
  ['size', 'BingResizableSize', 'undefined', '受控尺寸。拖拽中有内部临时预览，结束后回到传入值；需监听 update:size 或用 v-model:size 同步。'],
  ['defaultSize', 'BingResizableSize', '{ width: 320, height: 220 }', '非受控模式下的初始尺寸。'],
  ['position', 'Partial<BingResizablePosition>', 'undefined', '受控位置。'],
  ['defaultPosition', 'Partial<BingResizablePosition>', '{ x: 0, y: 0 }', '非受控模式下的初始位置。'],
  ['minWidth / minHeight', 'number | string', '80', '最小宽高；字符串会按 parseFloat 参与计算，样式值会原样输出。'],
  ['maxWidth / maxHeight', 'number | string', 'undefined', '最大宽高。'],
  ['mode', "'fixed' | 'mirror'", "'fixed'", 'fixed 固定对边；mirror 围绕中心对称调整，并同步 position。'],
  ['snapMode', "'live' | 'end'", "'live'", 'step 吸附时机。live 拖拽中吸附，end 松手时吸附。'],
  ['directions', 'BingResizableDirection[]', "['right', 'bottom', 'bottom-right']", '允许拖拽的方向。'],
  ['step', 'number | { x?: number; y?: number }', '1', '尺寸吸附步进。锁定比例的角手柄按起始长边吸附：宽大于等于高用 x，否则用 y。Shift + 方向键使用 4 倍步进。'],
  ['disabled', 'boolean', 'false', '是否禁用拖拽和键盘调整。'],
  ['lockAspectRatio', 'boolean', 'false', '按每次操作开始时的宽高比调整，保留角手柄。角点位移连续投影到比例线上；边手柄和键盘仍按对应轴调整。'],
  ['contain', 'boolean', 'false', '是否把尺寸和位置限制在父容器内容盒内。'],
  ['showSize', 'boolean', 'false', '拖拽时是否显示当前宽高。'],
  ['handleSize', 'number', '12', '手柄基础尺寸，最小会限制为 6。'],
  ['ariaLabel', 'string', 'undefined', '根节点 role="group" 的可访问名称。'],
]

const directionRows = [
  ['top / right / bottom / left', '边手柄，分别调整对应方向。'],
  ['top-left / top-right / bottom-left / bottom-right', '角手柄，同时调整两个方向。lockAspectRatio 为 true 时仍会显示。'],
]

const slotRows = [
  ['default', '-', '可调整尺寸的内容区域。'],
  ['handle', '{ direction, active }', '自定义手柄内容。未传时使用组件内置图标和线条。'],
]

const eventRows = [
  ['update:size', 'BingResizableResolvedSize', '尺寸提交时触发。非受控模式也会触发。'],
  ['update:position', 'BingResizablePosition', '位置提交时触发。fixed 模式拖拽 left/top，或 mirror 模式缩放时会变化。'],
  ['resize-start', 'BingResizablePayload', '拖拽或键盘调整开始时触发。'],
  ['resize', 'BingResizablePayload', '尺寸或位置发生变化时触发。'],
  ['resize-end', 'BingResizablePayload', '拖拽结束或一次键盘调整完成时触发。'],
]

const exposeRows = [
  ['reset()', '() => void', '重置为 defaultSize 和 defaultPosition，并触发 update:size/update:position。'],
  ['getSize()', '() => BingResizableResolvedSize', '读取数值状态；CSS 字符串按 parseFloat 解析，不等同于所有情况下的 DOM 测量尺寸。'],
  ['getPosition()', '() => BingResizablePosition', '读取当前显示位置。'],
]

export const resizableApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  direction: { headers: ["方向","说明"], codeColumns: 1, rows: directionRows },
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  expose: { headers: ["成员","类型","说明"], codeColumns: 2, rows: exposeRows },
  types: { headers: ['类型', '结构', '说明'], codeColumns: 2, rows: [
    ['BingResizableSize', '{ width?: number | string; height?: number | string }', '输入尺寸。建议使用像素数字，避免 CSS 单位与内部数值计算不一致。'],
    ['BingResizableResolvedSize', '{ width: number; height: number }', '事件和读取方法中的数值尺寸。'],
    ['BingResizablePosition', '{ x: number; y: number }', '相对布局原点的像素偏移；不是任意拖动位置的组件。'],
    ['BingResizableDelta', '{ x: number; y: number }', '指针相对本次操作起点的位移，或一次键盘操作的位移。'],
    ['BingResizablePayload', '{ direction: BingResizableDirection; size: BingResizableResolvedSize; position: BingResizablePosition; delta: BingResizableDelta; event: PointerEvent | KeyboardEvent }', 'resize-start / resize / resize-end 的完整参数。'],
    ['BingResizableDirection', "'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", '有效手柄方向。'],
    ['BingResizableStep', 'number | { x?: number; y?: number }', '两轴步长，可分别配置。'],
  ] },
}
