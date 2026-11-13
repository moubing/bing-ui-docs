import type { DocsApiTables } from './types'

const propsRows = [
  ['modelValue', 'boolean', 'false', '控制预览层是否打开，支持 v-model。'],
  ['items', 'BingImagePreviewItem[]', '[]', '图片列表；类型要求 src。运行时过滤 src 和 previewSrc 都为空的项，索引针对过滤后列表。'],
  ['initialIndex', 'number', '0', '每次打开时的默认索引；currentIndex 优先。打开期间改变此值不切图。'],
  ['currentIndex', 'number', 'undefined', '与外部同步当前索引，支持 v-model:current-index；组件切图也会更新内部索引，即使业务未接收更新。'],
  ['zIndex', 'number', "undefined（基准 + 400，默认 2400）", '预览层根节点 z-index；未传时使用 ConfigProvider 的 zIndex 基准加 400。'],
  ['minScale', 'number', '0.5', '缩放操作的最小值按 max(0.1, min(minScale, maxScale)) 计算；打开和重置仍使用 1。'],
  ['maxScale', 'number', '5', '最大值至少为规范化后的最小值；使用有限数值，建议缩放区间包含 1。'],
  ['zoomStep', 'number', '0.25', '工具栏、滚轮和键盘缩放步长，至少 0.05。'],
  ['downloadable', 'boolean', 'false', '有当前图片且 showToolbar=true 时显示下载按钮。'],
  ['loop', 'boolean', 'true', '是否循环；false 时边界按钮仍可点击，但不切换。'],
  ['lockScroll', 'boolean', 'true', '打开时锁定 body/html 滚动；打开期间单独改变此值不重新应用锁。'],
  ['closeOnEsc', 'boolean', 'true', '按 Escape 是否关闭预览。'],
  ['closeOnOverlay', 'boolean', 'true', '点击遮罩层是否关闭预览。'],
  ['showToolbar', 'boolean', 'true', '显示顶部工具栏；false 同时隐藏关闭、缩放、旋转、下载、计数器和加载指示，不关闭键盘/滚轮操作。'],
  ['showCounter', 'boolean', 'true', '有图片且 showToolbar=true 时显示索引和总数；等待切图时先显示目标索引。'],
  ['teleportTo', 'string | HTMLElement', "'body'", 'Teleport 目标，需在组件挂载时存在；根节点仍 position:fixed。'],
  ['ariaLabel', 'string', "'图片预览'", '预览层 dialog 的可访问名称。'],
  ['glass', 'boolean', 'true', 'false 时设 blur=0px、opacity=1、saturation=1；深色遮罩仍保留。'],
  ['glassBlur', 'string | number', 'undefined（主题默认 16）', '背景模糊。数值/数值字符串转非负 px，也可传 CSS 长度。'],
  ['glassOpacity', 'number', 'undefined（浅色 0.86 / 深色 0.92）', '工具栏、说明、导航和空/错误提示的背景透明度，限制在 0 到 1；不改变遮罩底色透明度。'],
  ['glassSaturation', 'number', 'undefined（主题默认 1.05）', '背景饱和度，最小 0。'],
]

const itemRows = [
  ['src', 'string', '必填，原图地址；previewSrc 未提供或为空时显示此地址。'],
  ['alt', 'string', '可选，图片替代文本，默认空字符串。'],
  ['previewSrc', 'string', '可选，优先显示的高清图地址。'],
  ['downloadUrl', 'string', '可选，下载地址；回退到 previewSrc 或 src。'],
  ['downloadName', 'string', '可选，原生 a.download 建议文件名；实际下载受浏览器与响应控制。'],
  ['caption', 'string', '可选，底部说明，以文本显示。'],
]

const eventRows = [
  ['update:modelValue', 'value: boolean', '关闭操作先发出 false；组件不发出 true。外部直接修改模型不触发此事件。'],
  ['update:currentIndex', 'value: number', '请求切图时立即通知目标索引；初始打开不发出。'],
  ['close', 'reason: BingImagePreviewCloseReason', '紧跟关闭模型请求，不代表关闭完成；业务直接设 false 或卸载不补发。'],
  ['change', 'index: number, item: BingImagePreviewItem', '紧跟索引通知，发生在目标图片预加载完成之前；不是 load 成功事件。'],
  ['download', 'payload: BingImagePreviewDownloadPayload', '创建 a 链接之前通知当前实际图片及索引；不能取消，不表示下载成功。'],
]

export const imagePreviewApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  item: { headers: ["字段","类型","说明"], codeColumns: 2, rows: itemRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  types: { headers: ['公开类型', '定义或说明'], codeColumns: 1, rows: [
    ['BingImagePreviewProps / BingImagePreviewEmits', '属性与事件载荷元组声明。'],
    ['BingImagePreviewItem', '图片项，完整字段见上表。'],
    ['BingImagePreviewCloseReason', "'close' | 'overlay' | 'escape'。"],
    ['BingImagePreviewDownloadPayload', '{ item: BingImagePreviewItem; index: number }。index 为过滤后列表的实际显示索引。'],
  ] },
}
