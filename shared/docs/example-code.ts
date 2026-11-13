import type { BingFormProps } from '@moubing/bing-ui'

export type FormExampleOptions = Pick<BingFormProps,
  'layout' | 'labelPosition' | 'labelWidth' | 'size' | 'columns' |
  'gap' | 'validateTrigger' | 'disabled' | 'scrollToError' | 'focusOnError'>

// 默认参数保存在完整示例中，网页代码区和 AI 导出共用这一个替换规则。
export function renderExampleCode(source: string, overrides: object = {}): string {
  const region = /\/\/ @docs-options:start\r?\nconst options: (\w+) = (\{[\s\S]*?\})\r?\n\/\/ @docs-options:end/g
  const matches = Array.from(source.matchAll(region))
  if (matches.length !== 1) throw new Error('完整示例必须包含且只包含一个默认参数区')
  const defaults = JSON.parse(matches[0]![2]!) as Record<string, unknown>
  // 防止参数中的 </script> 提前结束 Vue SFC。
  const options = JSON.stringify({ ...defaults, ...overrides }, null, 2).replaceAll('<', '\\u003c')
  return source.replace(region, () => 'const options: ' + matches[0]![1] + ' = ' + options)
    .replaceAll('\r\n', '\n').trim()
}

export function renderFormLayoutCode(source: string, overrides: FormExampleOptions = {}): string {
  return renderExampleCode(source, overrides)
}
