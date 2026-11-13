import type { DocsApiTables } from './types'

const propsRows = [
  ['height', 'string | number', 'undefined', '滚动容器高度；数字会转为 px。'],
  ['maxHeight', 'string | number', 'undefined', '滚动容器最大高度；数字会转为 px。'],
  ['minThumbSize', 'number', '28', '滚动条滑块最小尺寸。内部还会保证至少 12px。'],
  ['overflowTolerance', 'number', '1', '溢出容差，实际值至少为 1px；溢出必须大于该值才显示自定义轨道。'],
  ['vertical', 'boolean', 'true', '是否启用纵向自定义轨道与组件插值；false 不会将原生 viewport 的 overflow-y 关闭。'],
  ['horizontal', 'boolean', 'false', '是否启用横向自定义滚动条。打开后 Shift + 滚轮会映射为横向滚动。'],
  ['always', 'boolean', 'false', '是否始终显示滚动条轨道。false 时 hover、滚动、拖拽或聚焦时显示。'],
  ['disabled', 'boolean', 'false', '隐藏轨道、移除 tabindex 并将 viewport overflow 设为 hidden；实例滚动方法仍可改变位置。'],
  ['focusable', 'boolean', 'true', '出现溢出且未禁用时，是否让 viewport 可聚焦并支持键盘滚动。'],
  ['smooth', 'boolean | BingScrollbarSmoothOptions', 'true', '启用组件滚轮与键盘插值，或传对象覆盖配置。false 时普通纵向滚动交给浏览器；横向 Shift+滚轮兼容处理仍保留。'],
  ['ariaLabel', 'string', 'undefined', '默认 viewport 的名称；显式传入非空名称时即使没有溢出也设置 region。未传时，可聚焦 viewport 的名称为“可滚动内容”。自定义 viewport 插槽自行设置名称。'],
]

const smoothOptionRows = [
  ['duration', 'number', '400', '单次滚动冲量的动画时长，单位毫秒；设为 0 时立即更新。'],
  ['stepSize', 'number', '100', '滚轮输入归一化后的基础步长；页面缩放后仍以事件的 CSS 像素距离计算，不按设备像素放大。'],
  ['pulseScale', 'number', '4', '脉冲缓动曲线强度。'],
  ['accelerationDelta', 'number', '50', '连续滚轮输入触发加速的最大间隔，单位毫秒。'],
  ['accelerationMax', 'number', '3', '连续输入的最大加速倍率。'],
  ['keyboardStep', 'number', '50', '方向键每次滚动的基础距离。'],
  ['keyboard', 'boolean', 'true', 'viewport 聚焦时是否平滑处理方向键、PageUp、PageDown、Home、End 和空格。'],
  ['smoothTouchpad', 'boolean', 'false', '是否对触控板输入应用插值；默认保留触控板的原生高精度滚动。'],
  ['respectReducedMotion', 'boolean', 'true', '需要减少动效时是否停用插值并保留原生滚动；策略来自 ConfigProvider 的 reducedMotion，默认跟随系统。'],
]

const eventRows = [
  ['scroll', 'Event', '转发内部 viewport 原生事件；在处理函数内同步读取 event.currentTarget 的 scrollTop / scrollLeft。'],
]

const exposeRows = [
  ['handleWheel(event)', '(event: WheelEvent) => boolean', '把外部 wheel 事件交给当前 viewport；返回值表示事件是否被组件消费。'],
  ['scrollTo(options)', '(options: ScrollToOptions | number) => void', '取消组件插值并定位；数字立即设置纵向 scrollTop，对象传给原生 viewport.scrollTo，可用 left 与 behavior。'],
  ['scrollBy(options)', '(options: ScrollToOptions | number) => void', '取消组件插值并相对滚动；数字立即设置纵向增量，对象传给原生 viewport.scrollBy。'],
  ['stop()', '() => void', '取消组件自己的插值队列；不取消 scrollTo / scrollBy 对象参数触发的浏览器原生 smooth 动画。'],
  ['update()', '() => void', '同步重新计算轨道与滑块。组件也会自动观察尺寸；Vue 内容变化后手动调用时先 await nextTick()。'],
  ['viewport', 'HTMLElement | null', '内部原生滚动 viewport。'],
]

export const scrollbarApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  smoothOption: { headers: ['选项', '类型', '默认值', '说明'], codeColumns: 3, rows: smoothOptionRows },
  events: { headers: ['事件', '参数', '说明'], codeColumns: 2, rows: eventRows },
  expose: { headers: ['成员', '类型', '说明'], codeColumns: 2, rows: exposeRows },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: [
    ['default', '-', '默认 div viewport 内的滚动内容。提供 viewport 插槽时由自定义元素替代整个默认视口。'],
    ['viewport', 'BingScrollbarViewportSlotProps', '0.6.0 新增。将 viewportRef 和 viewportAttrs 绑定到同一个真实 DOM 滚动元素。'],
    ['viewportRef', '(element: unknown) => void', '通过 Vue ref 回调注册原生元素；组件实例不会被识别为 HTMLElement。'],
    ['viewportAttrs', '{ class; onScroll; onWheel; onKeydown; onInput }', '整体 v-bind，保留隐藏原生滚动条及事件处理；不提供角色、名称、tabindex、禁用或尺寸样式。'],
  ] },
}
