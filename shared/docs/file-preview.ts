import type { DocsApiTables } from './types'

const propsRows = [
  ['modelValue', 'boolean', 'false', '控制预览弹层是否打开。'],
  ['file', 'BingFilePreviewFile', 'undefined', '有 file 时 src/name 只取对象；其余六字段按 file.field ?? prop 合并，空字符串优先。'],
  ['src', 'string', 'undefined', '文件源地址。文本类文件没有 content 时会通过 fetch 读取 src。'],
  ['name', 'string', 'undefined', '没有 file 时的文件名；标题可回退到 src 最后一段或 未命名文件。'],
  ['type', 'BingFilePreviewKind', "'auto'", 'file.type 优先。auto 按 MIME/后缀规则识别；图片需显式 image 或 image/* MIME。'],
  ['mimeType', 'string', 'undefined', '用于 auto 推断的 MIME 类型。'],
  ['previewSrc', 'string', 'undefined', 'image/PDF/Office 的预览地址；文本类不 fetch 它，unknown 不渲染 iframe。'],
  ['content', 'string', 'undefined', 'text/json/csv 内联文本，空字符串也优先于 fetch；不会自动生成下载地址。'],
  ['downloadUrl', 'string', 'undefined', '下载地址；未传时回退到 src 或 previewSrc。'],
  ['size', 'number', 'undefined', '文件大小，单位字节。'],
  ['zIndex', 'number', "undefined（基准 + 300，默认 2300）", '预览层级；未传时使用 ConfigProvider 的 zIndex 基准加 300。'],
  ['width', 'string | number', "'min(1120px, calc(100vw - 36px))'", '面板宽度。'],
  ['height', 'string | number', "'min(760px, calc(100vh - 36px))'", '面板高度。'],
  ['smoothScroll', 'SmoothScrollValue', 'true', '传给文本类 BingScrollbar.smooth；false 保留原生滚动，配置字段见下表。'],
  ['lockScroll', 'boolean', 'true', '打开时锁定 body/html；打开期间改变不立即重新应用。'],
  ['closeOnEsc', 'boolean', 'true', '按 Escape 是否关闭。'],
  ['closeOnOverlay', 'boolean', 'true', '点击遮罩是否关闭。'],
  ['downloadable', 'boolean', 'true', '非图片分支有下载地址才显示；图片分支交给 ImagePreview。'],
  ['openable', 'boolean', 'true', '非图片分支有 previewSrc 或 src 才显示外部打开；只有 downloadUrl 不显示。'],
  ['jsonHighlight', 'boolean', 'true', 'JSON 预览是否做 token 高亮。'],
  ['jsonHighlightMaxLength', 'number', '3500000', '按格式化后的长度判断，超限跳过高亮，仍显示转义后的预览文本。'],
  ['textMaxLength', 'number', '240000', '接收文本时先按字符串 length 截断，再格式化/解析；不是网络读取上限。'],
  ['csvMaxRows', 'number', '80', 'slice 限制解析后的行数，包含第一行表头；建议正整数，修改即时更新。'],
  ['csvMaxColumns', 'number', '24', 'slice 限制每行列数，建议正整数，不补齐短行。'],
  ['teleportTo', 'string | HTMLElement', "'body'", '非图片分支目标，挂载时需存在；图片分支不转发。'],
  ['ariaLabel', 'string', "'文件预览'", '非图片 dialog 名称；图片分支使用 ImagePreview 默认名称。'],
  ['glass', 'boolean', 'true', 'false 时设置 blur=0px、opacity=1、saturation=1。'],
  ['glassBlur', 'string | number', 'undefined', '默认继承主题 16px；显式数值/数值字符串转非负 px。'],
  ['glassOpacity', 'number', 'undefined', '默认继承浅色 0.86 / 深色 0.92；显式值限制在 0 到 1，作用于遮罩底色。'],
  ['glassSaturation', 'number', 'undefined', '默认继承主题 1.05；显式值最小 0。'],
]

const fileRows = [
  ['src', 'string', '文件源地址。'],
  ['name', 'string', '显示文件名，也参与 auto 类型推断。'],
  ['type', 'BingFilePreviewKind', '指定预览类型。'],
  ['mimeType', 'string', '用于 auto 类型推断。'],
  ['previewSrc', 'string', '转换后的预览地址，Office 文件常用。'],
  ['content', 'string', '内联文本、JSON 或 CSV 内容。'],
  ['downloadUrl', 'string', '下载地址。'],
  ['size', 'number', '文件大小，单位字节。'],
]

const eventRows = [
  ['update:modelValue', 'value: boolean', '关闭请求发送 false；外部直接改模型不补发。图片分支可能重复请求。'],
  ['close', 'reason: BingFilePreviewCloseReason', '紧跟关闭模型请求，不表示动画完成。'],
  ['download', 'payload: BingFilePreviewDownloadPayload', '非图片分支创建 a 链接之前通知，不可取消，不表示下载成功；图片分支不转发。'],
  ['openExternal', 'payload: BingFilePreviewOpenExternalPayload', '非图片分支调用 window.open 之前通知，不可取消；模板用 @open-external。'],
  ['error', 'error: Error', '当前文本 fetch 的网络/HTTP 失败；空地址、无效 JSON、iframe/图片失败不发出。'],
]

export const filePreviewApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  file: { headers: ["字段","类型","说明"], codeColumns: 2, rows: fileRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  types: { headers: ['公开类型', '取值或定义'], codeColumns: 1, rows: [
    ['BingFilePreviewProps / BingFilePreviewEmits', '属性与事件载荷元组声明。'],
    ['BingFilePreviewKind', 'auto | image | pdf | text | json | csv | docx | xlsx | pptx | office | unknown。'],
    ['BingFilePreviewResolvedKind', 'BingFilePreviewKind 去掉 auto。'],
    ['BingFilePreviewFile', '八个字段均可选，见文件对象表。'],
    ['BingFilePreviewCloseReason', "'close' | 'overlay' | 'escape'。"],
    ['BingFilePreviewDownloadPayload / BingFilePreviewOpenExternalPayload', '{ file: BingFilePreviewFile; kind: BingFilePreviewResolvedKind }。file 为合并数据，标题推断名不回填 name。'],
    ['SmoothScrollValue / SmoothScrollOptions', 'boolean | SmoothScrollOptions；配置字段均可选，见下表。'],
  ] },
  smooth: { headers: ['SmoothScrollOptions 字段', '类型', '默认值', '说明'], codeColumns: 3, rows: [
    ['duration', 'number', '400', '动画时长，毫秒；0 立即更新。'],
    ['stepSize', 'number', '100', '滚轮归一化步长。'],
    ['pulseScale', 'number', '4', '脉冲缓动强度。'],
    ['accelerationDelta', 'number', '50', '连续输入加速间隔，毫秒。'],
    ['accelerationMax', 'number', '3', '最大加速倍率。'],
    ['keyboardStep', 'number', '50', '键盘基础滚动距离。'],
    ['keyboard', 'boolean', 'true', '内部滚动区的键盘插值。'],
    ['smoothTouchpad', 'boolean', 'false', '是否对触控板应用插值。'],
    ['respectReducedMotion', 'boolean', 'true', '减少动态效果偏好下关闭插值。'],
  ] },
}
