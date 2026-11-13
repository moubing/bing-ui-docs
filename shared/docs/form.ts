import type { DocsApiTables } from './types'

const propsRows = [
  ['model', 'Record<string, unknown>', 'undefined', '表单数据对象；resetFields 会回到挂载时的快照。'],
  ['schema', 'BingFormSchema', 'undefined', '提供 safeParseAsync 的校验接口，兼容 Zod schema；0.12.4 起公共类型不再导入可选的 Zod 包。validate 和 submit 通过此接口执行校验。'],
  ['layout', "'grid' | 'stack' | 'inline'", "'grid'", '表单布局模式。'],
  ['columns', 'number | Partial<Record<BingFormBreakpoint, number>>', "{ base: 1, sm: 2, xl: 5 }", "grid 布局下的响应式列数；BingFormBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl'。"],
  ['gap', 'string | number | { row?: string | number; column?: string | number }', "{ row: 12, column: 16 }", '字段之间的行列间距。'],
  ['labelPosition', "'top' | 'left'", "'top'", '字段标签位置。'],
  ['labelWidth', 'string | number', '112', 'left 标签模式下的标签宽度。'],
  ['size', "'sm' | 'md' | 'lg'", "undefined（继承 ConfigProvider，否则 'md'）", '向 FormItem 和表单控件传递的尺寸上下文；优先于 ConfigProvider。0.12.0 起未传时不再预填 md。'],
  ['disabled', 'boolean', 'false', '下发表单禁用上下文，同时阻止表单 submit 回调；控件显式传入 false 可覆盖继承。'],
  ['validateTrigger', "BingFormValidateTrigger | BingFormValidateTrigger[]", "'auto'", "BingFormValidateTrigger = 'auto' | 'change' | 'blur' | 'submit' | 'manual'；auto 在失焦和提交时校验，有错误的字段在修改时复查；manual 仅主动调用方法。"],
  ['scrollToError', 'boolean', 'true', 'validate() 或提交失败时滚动到首个可用错误字段，与聚焦开关独立。'],
  ['focusOnError', 'boolean', 'true', '提交失败后聚焦首个可用错误字段；异步等待期间继续编辑或改变焦点时不抢焦点，validate() 本身不主动聚焦。'],
  ['nextStepHint', 'boolean', 'false', '实验性：提示实际下一个 Tab 落点，不改变键盘顺序；失焦或禁用时隐藏，业务保存成功后可关闭。'],
]

const eventRows = [
  ['submit', '{ valid: boolean; errors: Record<string, string[]>; event: SubmitEvent }', '校验失败也会触发，业务保存前必须检查 valid；如果 validateTrigger 不包含 auto 或 submit，则不执行提交校验，valid 直接为 true。'],
  ['invalid', '{ valid: boolean; errors: Record<string, string[]> }', '提交校验失败时，在 submit 之后触发。'],
]

const exposeRows = [
  ['validate()', 'Promise<boolean>', '校验整个表单，并更新所有字段错误。'],
  ['validateField(prop)', 'Promise<boolean>', '执行 schema 校验，只更新 prop 路径相关的错误，保留其他字段错误。'],
  ['clearValidate(prop?)', 'void', '清空全部错误，或只清空某个字段相关错误。'],
  ['resetFields()', 'void', '把 model 重置为表单挂载时的快照，并清空校验。'],
  ['getErrors()', 'BingFormErrors', '返回当前错误对象的拷贝；BingFormErrors = Record<string, string[]>，键为字段路径，值为错误消息数组。'],
]

export const formApi = {
  props: { headers: ['属性', '类型', '默认值', '说明'], codeColumns: 3, rows: propsRows },
  events: { headers: ['事件', '参数', '说明'], codeColumns: 2, rows: eventRows },
  expose: { headers: ['方法', '返回值', '说明'], codeColumns: 2, rows: exposeRows },
} satisfies DocsApiTables
