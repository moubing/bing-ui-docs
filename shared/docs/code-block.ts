import type { DocsApiTables } from './types'

const propsRows = [
  ['code', 'string', '必填', '需要展示的原始代码字符串，不会作为业务代码执行。'],
  ['language', 'string', "'text'", '传给 Shiki 的语言标识。当前内置 js、ts、jsx、tsx、vue、html、css、scss、json、markdown、shellscript、yaml。'],
  ['theme', 'BingCodeBlockTheme', "'auto'", 'Shiki 主题。auto 会按 Bing UI 全局主题解析为亮色或暗色高亮；显式主题固定使用指定值。当前内置 auto、vitesse-light、vitesse-dark、github-light、github-dark、light-plus、dark-plus。'],
  ['title', 'string', 'undefined', '头部标题，通常用文件名。'],
  ['languageLabel', 'string', 'undefined', '头部语言标签；为空时 text 显示“纯文本”，其他语言显示标识的大写形式。'],
  ['copyable', 'boolean', 'true', '是否显示复制按钮。'],
  ['copyLabel', 'string', "'复制代码'", '复制按钮默认文案。'],
  ['copiedLabel', 'string', "'已复制'", '复制成功后的按钮文案。'],
  ['copyResetDelay', 'number', '1600', '复制成功状态恢复延迟，单位毫秒。'],
  ['lineNumbers', 'boolean', 'true', '是否显示 1-based 行号。'],
  ['highlightLines', 'Array<number | [number, number]>', 'undefined', '需要高亮的行号或闭区间范围，例如 [2, [4, 6]]。非法行号会被忽略。'],
  ['width', 'string | number', 'undefined', '代码块宽度；数字会转为 px，空值撑满父容器。'],
  ['maxHeight', 'string | number', 'undefined', '代码区域最大高度；超出后通过内部 BingScrollbar 滚动。'],
  ['smoothScroll', 'SmoothScrollValue', 'true', '是否启用内部 BingScrollbar 的平滑滚动；传入 false 可关闭，也可传配置对象调整参数。'],
  ['resizable', 'boolean', 'false', '是否用 BingResizable 包裹代码块，让用户拖拽调整尺寸。'],
  ['resizableOptions', 'BingCodeBlockResizableOptions', 'undefined', '传给内部 BingResizable 的尺寸、方向、边界和无障碍配置。'],
  ['wrap', 'boolean', 'false', '是否保留缩进并允许长行换行。'],
  ['ariaLabel', 'string', "'代码块'", '代码块和滚动区域的可访问名称。'],
]

const resizableRows = [
  ['defaultSize', '{ width?: number | string; height?: number | string }', '默认尺寸。CodeBlock 默认使用 width 或 640 x 360。'],
  ['minWidth / minHeight', 'number | string', '最小宽高；CodeBlock 默认 380 x 240。'],
  ['maxWidth / maxHeight', 'number | string', '最大宽高。'],
  ['mode', "'fixed' | 'mirror'", 'BingResizable 的尺寸模式。'],
  ['snapMode', "'live' | 'end'", '拖拽时实时吸附还是结束后吸附。'],
  ['directions', 'BingResizableDirection[]', '允许拖拽的方向；默认 right、bottom、bottom-right。'],
  ['step', 'number | { x?: number; y?: number }', '拖拽步进。'],
  ['disabled', 'boolean', '是否禁用拖拽。'],
  ['lockAspectRatio', 'boolean', '是否锁定宽高比。'],
  ['contain', 'boolean', '是否限制在父容器内。'],
  ['showSize', 'boolean', '是否显示当前尺寸；CodeBlock 默认 true。'],
  ['handleSize', 'number', '拖拽手柄尺寸；CodeBlock 默认 12。'],
  ['ariaLabel', 'string', '内部 BingResizable 的可访问名称。'],
]

const eventRows = [
  ['copy', '{ code: string; language: string }', '复制成功后触发。'],
  ['copyError', 'Error', 'Clipboard API 拒绝，或 API 不存在且 textarea 兼容复制失败时触发；API 拒绝时不继续尝试兼容分支。'],
  ['highlightError', 'Error', 'Shiki 高亮失败时触发；组件会回退为纯文本展示。'],
]

export const codeBlockApi: DocsApiTables = {
  highlightApi: { headers: ['函数', '返回值', '说明'], codeColumns: 2, rows: [
    ['getCodeLanguages()', 'BingCodeLanguage[]', '返回支持语言的 value/label 副本，不含 text，不加载 Shiki。'],
    ['normalizeCodeLanguage(language?: string | null)', 'string', '规范化别名；空值为 text，未知值保持小写。'],
    ["resolveCodeTheme(theme = 'auto', mode?: 'light' | 'dark' | 'system')", 'string', '解析当前主题；显式主题优先，无自动订阅。'],
    ["highlightCode(code: string, language = 'text', theme = 'auto')", 'Promise<BingCodeBlockLine[]>', '逐行 token；纯文本保留空白，未知语言或加载失败拒绝。'],
  ] },
  highlightTypes: { headers: ['导出类型', '字段', '说明'], codeColumns: 2, rows: [
    ['BingCodeLanguage', '{ value: string; label: string }', '语言标识及友好名称。'],
    ['BingCodeBlockLine', '{ number: number; tokens: BingCodeBlockToken[] }', '从 1 开始的行号与有序 token。'],
    ['BingCodeBlockToken', '{ content: string; color?: string; fontStyle?: number }', 'fontStyle 为 Shiki 位标志：1 斜体、2 粗体、4 下划线；编辑器可仅使用颜色保持排版。'],
  ] },
  props: { headers: ["属性","类型","默认值","说明"], codeColumns: 3, rows: propsRows },
  resizable: { headers: ["字段","类型","说明"], codeColumns: 2, rows: resizableRows },
  events: { headers: ["事件","参数","说明"], codeColumns: 2, rows: eventRows },
}
