import type { DocsApiTables } from './types'

const propsRows = [
  ['src', 'string', 'undefined', '图片地址。为空时组件保持 idle 状态。'],
  ['alt', 'string', "''", '图片替代文本；装饰性图片可以传空字符串。'],
  ['srcset', 'string', 'undefined', '原生 img srcset。只有当前 src 是主图时会透传；进入 fallback 后会移除。'],
  ['sizes', 'string', 'undefined', '原生 img sizes。只有当前 src 是主图时会透传。'],
  ['width', 'number | string', 'undefined', 'CSS 宽度；number 转 px。number 或全数字字符串还写入 img width；百分比、px 等 CSS 字符串不写原生属性。'],
  ['height', 'number | string', 'undefined', 'CSS 高度；number 转 px。number 或全数字字符串还写入 img height。'],
  ['aspectRatio', 'number | string', 'undefined', 'CSS aspect-ratio，用于构造稳定的图片占位盒。'],
  ['fit', "'contain' | 'cover' | 'fill' | 'none' | 'scale-down'", "'cover'", '图片 object-fit。'],
  ['position', 'string', "'center'", '图片 object-position。'],
  ['radius', "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'", "'md'", '圆角等级。'],
  ['block', 'boolean', 'false', '是否占满父容器宽度。'],
  ['loading', "'lazy' | 'eager'", "'lazy'", '原生 img loading。'],
  ['decoding', "'async' | 'sync' | 'auto'", "'async'", '原生 img decoding。'],
  ['fetchPriority', "'high' | 'low' | 'auto'", "'auto'", '原生 fetchpriority。'],
  ['fallbackSrc', 'string', 'undefined', '每轮主图失败后尝试一次不同地址的回退图；回退失败不继续循环。重试或 src 改变时重新开始。'],
  ['placeholderSrc', 'string', 'undefined', '模糊占位图；未 loaded 时可在 idle/loading/error 阶段存在。'],
  ['showLoading', 'boolean', 'true', '是否显示整个 loading 层；false 也隐藏自定义 loading 插槽，不改变加载过程。'],
  ['showError', 'boolean', 'true', '是否显示整个 error 层；false 也隐藏自定义 error 插槽，不改变 error 状态与事件。'],
  ['errorText', 'string', "'图片加载失败'", '内置错误态文案。'],
  ['crossorigin', "'' | 'anonymous' | 'use-credentials'", 'undefined', '原生 img crossorigin。'],
  ['referrerPolicy', 'BingImageReferrerPolicy', 'undefined', '原生 img referrerpolicy。'],
  ['preview', 'boolean', 'false', '图片加载成功后是否可点击打开 BingImagePreview。'],
  ['previewSrc', 'string', 'undefined', '单图预览时使用的高清图。'],
  ['previewItems', 'BingImagePreviewItem[]', 'undefined', '预览图库列表。为空时会用当前图片生成单图预览。'],
  ['previewInitialIndex', 'number', '0', '使用 previewItems 时的初始预览索引。'],
  ['previewDownloadable', 'boolean', 'false', '预览层是否显示下载动作。'],
  ['previewDownloadUrl', 'string', 'undefined', '单图预览下载地址。'],
  ['previewDownloadName', 'string', 'undefined', '单图预览下载文件名。'],
  ['previewAriaLabel', 'string', "'预览图片'", '加载成功后的外层预览按钮名称；图库中建议每张图单独设置。传空字符串才会回退到 “预览 ”加 alt。'],
]

const slotRows = [
  ['placeholder', '-', '替换占位图和骨架；loading 时显示，idle/error 时只有配置 placeholderSrc 才显示。所在层 aria-hidden。'],
  ['loading', '-', 'showLoading=true 且处于 loading 时显示；所在层 aria-hidden。'],
  ['error', '{ src: string | undefined; retry: () => void }', 'showError=true 且最终失败时显示。retry 重建 img 并重新尝试主图，不保证绕过浏览器缓存。'],
]

const eventRows = [
  ['load', 'BingImageLoadPayload', '原生 load 成功时触发；src 是组件当前地址，不一定等于 srcset 实际选中的 currentSrc。'],
  ['error', 'BingImageErrorPayload', '当前图片加载失败时触发，包含 src 和 isFallback。'],
  ['statusChange', 'BingImageStatusChangePayload', '仅状态值改变时触发；主图 loading 切到回退图 loading 不再次发出。模板可用 @status-change。'],
  ['previewOpen', 'BingImagePreviewOpenPayload', '预览入口激活时发出，src 为 previewSrc 或当前图地址，不报告图库切换。'],
  ['previewClose', 'BingImagePreviewClosePayload', '内置预览发出关闭操作时转发原因。禁用 preview 或卸载组件不补发。'],
]

export const imageApi: DocsApiTables = {
  slots: { headers: ["插槽","参数","说明"], codeColumns: 2, rows: slotRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  types: { headers: ['类型', '取值或说明'], codeColumns: 1, rows: [
    ['BingImageProps / BingImageEmits', '组件属性与事件载荷元组声明。'],
    ['BingImageFit', 'contain | cover | fill | none | scale-down。'],
    ['BingImageRadius', 'none | sm | md | lg | xl | full。'],
    ['BingImageLoading', 'lazy | eager。'],
    ['BingImageDecoding', 'async | sync | auto。'],
    ['BingImageFetchPriority', 'high | low | auto。'],
    ['BingImageCrossOrigin', "'' | anonymous | use-credentials。"],
    ['BingImageReferrerPolicy', "'' | no-referrer | no-referrer-when-downgrade | origin | origin-when-cross-origin | same-origin | strict-origin | strict-origin-when-cross-origin | unsafe-url。"],
    ['BingImageStatus', 'idle | loading | loaded | error。'],
  ] },
  payloads: { headers: ['类型', '字段', '说明'], codeColumns: 2, rows: [
    ['BingImageLoadPayload', '{ event: Event; src: string; naturalWidth: number; naturalHeight: number }', '原生事件及图片自然尺寸；可从 event.currentTarget 的 img.currentSrc 读取浏览器选择的地址。'],
    ['BingImageErrorPayload', '{ event: Event; src: string; isFallback: boolean }', '每个失败地址分别通知；isFallback 标识此次失败是否来自回退图。'],
    ['BingImageStatusChangePayload', '{ status: BingImageStatus; src?: string }', '状态及发出事件时的当前地址。'],
    ['BingImagePreviewOpenPayload', '{ src: string }', '入口激活时的预览地址提示，不等同图库当前项。'],
    ['BingImagePreviewClosePayload', "{ reason: 'close' | 'overlay' | 'escape' }", '内置预览关闭来源。'],
  ] },
  previewItem: { headers: ['字段', '类型', '说明'], codeColumns: 2, rows: [
    ['src', 'string', '必填，图片原地址。'],
    ['alt', 'string', '可选，图片替代文本。'],
    ['previewSrc', 'string', '可选，预览高清图，优先于 src 显示。'],
    ['downloadUrl', 'string', '可选，该项下载地址。'],
    ['downloadName', 'string', '可选，该项下载文件名。'],
    ['caption', 'string', '可选，预览说明文字。'],
  ] },
}
