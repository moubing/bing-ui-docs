import type { DocsApiTables } from './types'

const propsRows = [
  ['id', 'string', '自动生成 / FormItem controlId', '应用到触发按钮，支持外部 label 的 for 关联。'],
  ['modelValue', 'string', "'#ec4899'", '可解析的 HEX、RGB(A)、HSL(A) 字符串。更新模型只返回六位 HEX；保留透明度使用 change.rgba，详见正文。'],
  ['presets', 'Array<string | { label?: string; value: string }>', '默认色板', '预设色板。传对象时 label 会作为色块的可访问名称。'],
  ['disabled', 'boolean', 'undefined（继承 Form，否则 false）', '禁用时关闭面板；显式 false 可覆盖表单继承。'],
  ['size', "'sm' | 'md' | 'lg'", "undefined（继承 Form / ConfigProvider，否则 md）", '触发器高度为 32/36/40px。'],
  ['block', 'boolean', 'false', '撑满父容器；置于 FormItem 时也会自动撑满。'],
  ['width', 'string | number', 'undefined', '触发器 CSS 宽度，数字按 px；未传时内部宽度为 280px，受 block 和容器影响。'],
  ['minWidth', 'string | number', '180', '触发器最小宽度。'],
  ['panelWidth', 'string | number', '320', '用 parseFloat 读取为像素，100% 会被读作 100；实际宽度至少为触发器宽度，并限制在视口内侧 12px。'],
  ['copyLabel', 'string', "'复制'", '复制按钮默认文案，实际名称附加当前格式。'],
  ['copiedLabel', 'string', "'已复制'", '复制成功后的文案。'],
  ['copyResetDelay', 'number', '1400', '复制成功状态恢复的延迟，单位毫秒。'],
  ['ariaLabel', 'string', 'undefined', '触发按钮的可访问名称。'],
  ['ariaDescribedby', 'string', 'undefined', '关联额外说明元素。'],
  ['status', "'default' | 'error' | 'success' | 'warning'", 'undefined', '表单状态；在 FormItem 中可继承校验状态。'],
  ['glass', 'boolean', 'true', '是否开启玻璃效果。'],
  ['glassBlur', 'string | number', 'undefined（主题默认 16）', '玻璃模糊强度，省略时跟随主题。'],
  ['glassOpacity', 'number', 'undefined（浅色 0.86 / 深色 0.92）', '玻璃底色不透明度，省略时跟随主题。'],
  ['glassSaturation', 'number', 'undefined（主题默认 1.05）', '玻璃饱和度，省略时跟随主题。'],
]

const presetRows = [
  ['string', "'#ec4899'", '只传颜色值，色块名称由颜色值兜底。'],
  ['object', "{ label: '冰粉', value: '#ec4899' }", '同时提供颜色值和可读名称。'],
]

const eventRows = [
  ['update:modelValue', 'string', '提交颜色时先发出六位 HEX，不含透明度；外部直接赋值不触发。'],
  ['change', 'BingColorPickerChangePayload', '更新模型后发出，包含完整颜色、value（六位 HEX）与 source；需要透明度读取 rgba、hexAlpha 或 rgb.a。'],
  ['copy', 'BingColorPickerCopyPayload', '点击复制按钮并成功写入剪贴板时触发。'],
  ['copyError', 'Error', '复制失败时触发。'],
  ['open', '-', '颜色面板打开时触发。'],
  ['close', '-', '颜色面板关闭时触发。'],
]

const exposeRows = [
  ['focus', '() => void', '聚焦触发器。'],
  ['blur', '() => void', '移除触发器焦点。'],
  ['openPanel', '() => void', '挂载后打开面板，已打开或禁用时无操作；返回 void，不是等待动画的 Promise。'],
  ['closePanel', '() => void', '提交待处理颜色后关闭，关闭动画结束聚焦触发器；已经关闭时无操作。'],
]

export const colorPickerApi: DocsApiTables = {
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  preset: { headers: ["写法","示例","说明"], codeColumns: 2, rows: presetRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
  expose: { headers: ["方法","签名","说明"], codeColumns: 2, rows: exposeRows },
  types: { headers: ['公开类型', '定义或用途'], codeColumns: 1, rows: [
    ['BingColorPickerSize', "'sm' | 'md' | 'lg'"],
    ['BingColorPickerFormat', "'hex' | 'rgba' | 'hsl'；影响面板展示与复制，没有 format 属性。"],
    ['BingColorPickerChangeSource', "'field' | 'slider' | 'alpha' | 'preset' | 'input'"],
    ['BingColorPickerModelValue', 'string'],
    ['BingColorPickerPreset', '{ label?: string; value: string }'],
    ['BingColorPickerPresetInput', 'string | BingColorPickerPreset'],
    ['BingColorPickerRgbValue', '{ r: number; g: number; b: number; a: number }；RGB 为 0–255 整数，alpha 为 0–1。'],
    ['BingColorPickerHslValue', '{ h: number; s: number; l: number; a: number }；h 为 0–359，s/l 为 0–100，alpha 为 0–1。'],
    ['BingColorPickerColorValue', '{ hex: string; hexAlpha: string; rgba: string; hsl: string; rgb: BingColorPickerRgbValue; hslParts: BingColorPickerHslValue }'],
    ['BingColorPickerChangePayload', 'BingColorPickerColorValue & { value: string; source: BingColorPickerChangeSource }'],
    ['BingColorPickerCopyPayload', '{ format: BingColorPickerFormat; value: string; color: BingColorPickerColorValue }'],
    ['BingColorPickerProps', '上表 19 个可选属性，包括继承的 4 个玻璃效果属性。'],
    ['BingColorPickerEmits', '上表 6 个事件及其参数。'],
    ['BingColorPickerExpose', '{ focus: () => void; blur: () => void; openPanel: () => void; closePanel: () => void }'],
  ] },
}
