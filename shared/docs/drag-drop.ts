import type { DocsApiTables } from './types'

const propsRows = [
  ['disabled', 'boolean', 'false', '停用整组拖动，所有条目都不能开始拖动。'],
  ['dragThreshold', 'number', '6', '鼠标与触控笔按下后移动超过该距离（px）才开始拖动，单击保持原有行为。'],
  ['touchDelay', 'number', '300', '触屏长按多久（ms）开始拖动；长按前滑动视为滚动页面。'],
  ['touchTolerance', 'number', '8', '长按期间允许的手指移动距离（px），超过即放弃这次拖动。'],
  ['autoScroll', 'boolean', 'true', '拖到滚动容器或窗口边缘时自动滚动。'],
  ['dropOnSource', 'boolean', 'false', '放回原区域时是否也发出 drop；默认只发出 drag-end。'],
]

const draggableRows = [
  ['id', 'BingDragDropKey', '必填', '条目 id，同一个 BingDragDrop 内唯一。'],
  ['zone', 'BingDragDropKey', 'undefined', '条目当前所在区域的 id，用于识别来源区域和载荷中的 from。'],
  ['data', 'T', 'undefined', '业务数据，原样出现在事件载荷与浮层插槽中。'],
  ['disabled', 'boolean', 'false', '该条目不能开始拖动，并带有 is-disabled 类名。'],
  ['tag', 'string', "'div'", '渲染的元素标签，例如 li、article。'],
  ['ignore', 'string', `'button, input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-bing-drag-ignore]'`, '按下点命中这些后代元素时不开始拖动；传入后整体替换默认值。条目根元素本身不受影响。'],
]

const zoneRows = [
  ['id', 'BingDragDropKey', '必填', '区域 id，对应条目的 zone 和载荷中的 to。'],
  ['accept', '(item: BingDragDropItem<T>) => boolean', 'undefined', '返回 false 时不接受该条目；来源区域不调用，总是可以放回。未传时接受全部条目。'],
  ['disabled', 'boolean', 'false', '不接受任何条目，包括来源区域内的条目。'],
  ['tag', 'string', "'div'", '渲染的元素标签，例如 section、ul。'],
  ['ariaLabel', 'string', 'undefined', '区域的可访问名称，例如列名；配合 section 等标签使用。'],
]

const overlayRows = [
  ['tilt', 'number', '1.5', '拖动时的倾斜角度（deg）；减少动态效果时为 0。'],
  ['dropDuration', 'number', '180', '松手后浮层回到落点的动画时长（ms）；条目放下后不再显示时，按约 1.3 倍时长收进落下的区域；0 或减少动态效果时直接消失。'],
]

const eventRows = [
  ['drag-start', 'BingDragDropStartPayload<T>', '越过阈值或长按完成、开始拖动时发出；触屏同时轻微振动（设备支持时）。'],
  ['drag-over', 'BingDragDropOverPayload<T>', '指针所在的可放置区域变化时发出；离开所有区域时 over 为 null。'],
  ['drop', 'BingDragDropDropPayload<T>', '松手落到可放置区域时发出；放回原区域仅在 dropOnSource 为 true 时发出。'],
  ['drag-end', 'BingDragDropEndPayload<T>', '每次拖动结束都会发出，位于 drop 之后；取消或落在区域外时 to 为 null。'],
]

const slotRows = [
  ['BingDragDrop 默认插槽', '{ active: BingDragDropActive<T> | null; cancel: () => void }', '拖动期间 active 为当前条目，可据此显示额外区域。'],
  ['BingDraggable 默认插槽', '{ dragging: boolean; active: boolean; disabled: boolean }', 'dragging 表示该条目正在被拖动（含落位动画，浮层落到位的那一帧变为 false），active 表示组内有任意条目正在拖动。'],
  ['BingDropZone 默认插槽', '{ state: BingDropZoneState; over: boolean; active: BingDragDropActive<T> | null }', 'over 表示指针在区域上方，包括来源区域。'],
  ['BingDragOverlay 默认插槽', '{ id: BingDragDropKey; zone?: BingDragDropKey; data?: T; over: BingDragDropKey | null }', '被拖动条目的信息；落位动画期间保留最后一次的内容。'],
]

const methodRows = [
  ['cancel()', '() => void', 'BingDragDrop 实例方法：取消进行中的拖动，条目归位，drag-end 的 canceled 为 true。'],
  ['active', 'Readonly<Ref<BingDragDropActive | null>>', 'BingDragDrop 实例属性：当前拖动的条目。'],
  ['useBingDragDrop<T>()', '() => { active: Readonly<Ref<BingDragDropActive<T> | null>>; disabled: ComputedRef<boolean>; cancel: () => void }', '在 BingDragDrop 后代组件中读取拖动状态；在外部调用会抛错。'],
]

const typeRows = [
  ['BingDragDropKey', 'string | number', '条目与区域 id。'],
  ['BingDragDropItem<T>', '{ id: BingDragDropKey; zone?: BingDragDropKey; data?: T }', 'accept 收到的条目。'],
  ['BingDragDropActive<T>', 'BingDragDropItem<T> & { over: BingDragDropKey | null; pointerType?: string }', '正在拖动的条目；pointerType 为 mouse、pen 或 touch。'],
  ['BingDragDropStartPayload<T>', 'BingDragDropItem<T> & { event?: Event }', 'drag-start 载荷。'],
  ['BingDragDropOverPayload<T>', 'BingDragDropItem<T> & { over: BingDragDropKey | null }', 'drag-over 载荷。'],
  ['BingDragDropDropPayload<T>', '{ id: BingDragDropKey; data?: T; from?: BingDragDropKey; to: BingDragDropKey; event?: Event }', 'drop 载荷；from 来自条目的 zone。'],
  ['BingDragDropEndPayload<T>', '{ id: BingDragDropKey; data?: T; from?: BingDragDropKey; to: BingDragDropKey | null; canceled: boolean; event?: Event }', 'drag-end 载荷。'],
  ['BingDropZoneState', "'idle' | 'source' | 'target' | 'over' | 'disabled'", '区域状态，同时写入 is-* 类名与 data-bing-drop-state。'],
  ['BingDragDropProps / BingDraggableProps<T> / BingDropZoneProps<T> / BingDragOverlayProps', '见上方 Props 表', '各组件的 Props 类型。'],
  ['BingDragDropEmits<T> / BingDragDropSlotProps<T> / BingDraggableSlotProps / BingDropZoneSlotProps<T> / BingDragOverlaySlotProps<T>', '见上方事件与插槽表', '事件与插槽参数类型。'],
  ['BingDragDropContext', '{ active; disabled; cancel }', 'useBingDragDrop 返回值的类型。'],
]

export const dragDropApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  draggable: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: draggableRows },
  zone: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: zoneRows },
  overlay: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: overlayRows },
  events: { headers: ['事件', '载荷', '说明'], codeColumns: 2, rows: eventRows },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: slotRows },
  methods: { headers: ['名称', '签名', '说明'], codeColumns: 2, rows: methodRows },
  types: { headers: ['类型', '定义', '说明'], codeColumns: 2, rows: typeRows },
}
