import type { DocsApiTables } from './types'

export const cursorApi: DocsApiTables = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: [
    ['type', "BingCursorType | 'auto'", "'auto'", '自动读取 CSS cursor 与交互语义，或固定状态；有效 data-bing-cursor 覆盖固定值，禁用语义优先。'],
    ['global', 'boolean', 'false', 'false 仅包含默认插槽的 DOM 后代；true 可接管当前文档中的命中元素。作用域不代表所有后代的计算样式都会改变。'],
    ['disabled', 'boolean', 'false', '停用该实例并恢复系统光标；有其他有效实例时可由其接管。全部停用后不调度命中测试或 CSS 扫描。'],
    ['size', 'number', '28', '光标图片尺寸，px；有限数取整并限制到 8–128，非有限数回退 28。浏览器可能有额外的图片尺寸限制。'],
    ['color', 'string', 'undefined', '主体颜色；支持 CSS 颜色及变量，未传入时继承 --bing-cursor-color，最终回退 #171717。'],
    ['outlineColor', 'string', 'undefined', '外描边颜色；未传入时继承 --bing-cursor-outline，最终回退 #ffffff。'],
    ['hotspot', 'readonly [number, number]', 'undefined', '图片中的点击热点，相对于图片左上角，单位 px。默认按 size 缩放各状态的内置热点；自定义坐标取整并限制在画布内，非有限数按 0。'],
  ] },
  slots: { headers: ['插槽', '参数', '说明'], codeColumns: 2, rows: [
    ['default', '-', '局部作用域内容；根节点 display: contents，不增加布局盒。global 可不提供内容。'],
  ] },
  events: { headers: ['事件', '参数', '说明'], codeColumns: 2, rows: [
    ['change', 'type: BingCursorType', '解析后的类型变化时发送；不逐次发送鼠标移动事件，首次 default 不一定发送。'],
    ['visibility-change', 'visible: boolean', '组件开始或停止接管光标时发送；模板使用 @visibility-change。不是浏览器已成功解码图片的确认事件。'],
  ] },
  attributes: { headers: ['HTML 属性', '值', '说明'], codeColumns: 2, rows: [
    ['data-bing-cursor', "BingCursorType | 'native'", '当前元素或最近祖先的声明。native 保留该元素原本的 CSS 光标；不是 BingCursor 的 prop。'],
  ] },
  types: { headers: ['公开类型', '定义或用途'], codeColumns: 1, rows: [
    ['BingCursorType', 'default | pointer | not-allowed | text | grab | grabbing | move | crosshair | col-resize | row-resize | ew-resize | ns-resize | nwse-resize | nesw-resize | zoom-in | zoom-out。'],
    ['BingCursorProps', '上表中的 7 个可选属性。'],
    ['BingCursorSlots', '仅声明 default 插槽。'],
    ['BingCursorEmits', 'change 与 visibility-change 事件载荷元组。'],
  ] },
}
