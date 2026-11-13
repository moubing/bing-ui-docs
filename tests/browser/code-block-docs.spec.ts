import { expect, test } from '@playwright/test'
import { componentDocsTests } from './component-docs'

const open = componentDocsTests({ slug: 'code-block', title: 'BingCodeBlock', ready: '#basic .doc-example__preview .bing-code-block.is-ready', previews: 5, tables: 5,
  sections: ['overview', 'basic', 'highlight-scroll', 'wrap-readonly', 'resizable', 'tokens', 'props', 'resizable-options', 'events'] })

test('CodeBlock：原有行高亮、语言切换、复制反馈和提示框', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  const preview = page.locator('#basic .doc-example__preview .bing-code-block')
  await expect(preview.locator('.is-highlighted')).toHaveCount(5)
  await expect(page.locator('#highlight-scroll .doc-example__preview .is-highlighted')).toHaveCount(6)
  await expect(page.getByRole('complementary', { name: '关于 ?raw', exact: true })).toContainText('不依赖外部示例文件')
  await page.getByRole('radio', { name: /^ts / }).locator('..').click()
  await expect(preview.locator('.bing-code-block__title')).toHaveText('status.ts')
  await expect(preview.locator('.bing-code-block__language')).toHaveText('TypeScript')
  await preview.getByRole('button', { name: '复制代码', exact: true }).click()
  await expect(page.locator('#basic .codeblock-feedback')).toContainText('已复制 ts')
  const copied = (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')
  expect(copied.startsWith("type Status = 'idle' | 'loading' | 'ready'\n")).toBe(true)
  await page.getByRole('checkbox', { name: '显示复制按钮', exact: true }).locator('..').click()
  await expect(preview.getByRole('button')).toHaveCount(0)
  await page.getByRole('checkbox', { name: '长行换行', exact: true }).locator('..').click()
  await expect(preview).toHaveClass(/is-wrapped/)
  await expect(page.locator('#wrap-readonly .doc-example__preview .bing-code-block__line-number')).toHaveCount(0)
  const right = page.locator('#resizable .bing-resizable__handle--right')
  const root = page.locator('#resizable .bing-resizable')
  const before = (await root.boundingBox())!.width
  await right.focus()
  await right.press('ArrowRight')
  await expect.poll(async () => (await root.boundingBox())!.width).toBeGreaterThan(before)
})
