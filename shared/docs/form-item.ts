import type { DocsApiTables } from './types'

const propsRows = [
  ['prop', 'string', 'undefined', '字段路径。用于读取 Form schema 错误，也用于 validateField 和 clearValidate。'],
  ['label', 'string', 'undefined', '字段标签。'],
  ['required', 'boolean', 'false', '是否显示必填星号；实际校验仍由 schema 决定。'],
  ['span', 'number | Partial<Record<BingFormBreakpoint, number>>', '1', 'grid 布局的字段占列数，限制在 1 到对应断点的 Form columns 之间；缺省断点继承较小断点。stack 布局自动占满单列。'],
  ['help', 'string', 'undefined', '帮助文本；没有错误时显示在消息区域。'],
  ['showMessage', 'boolean', 'true', '是否保留并显示消息区域；false 不会关闭 schema 校验或清空错误。'],
  ['labelPosition', "'top' | 'left'", 'undefined', '覆盖当前字段的标签位置；未传时继承 Form。'],
]

const slotRows = [
  ['id', 'string', '传给自定义控件的唯一 id，对应 label for；每个字段自动生成独立值。'],
  ['status', "'default' | 'error'", '运行时有错误为 error，否则为 default；发布包类型声明为 string。'],
  ['ariaDescribedby', 'string | undefined', '运行时的消息节点 id；无消息或 showMessage=false 时为 undefined。0.6.0 发布类型仍误写为 aria-describedby，完整示例兼容两种名称。'],
  ['invalid', 'boolean', '是否存在错误。'],
  ['disabled', 'boolean', '从 Form 继承的禁用状态。'],
  ['size', "'sm' | 'md' | 'lg'", '从 Form 继承的尺寸；Form 未设置时取 ConfigProvider，否则 md。'],
]

export const formItemApi = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  slots: { headers: ['参数', '类型', '说明'], codeColumns: 2, rows: slotRows },
} satisfies DocsApiTables
