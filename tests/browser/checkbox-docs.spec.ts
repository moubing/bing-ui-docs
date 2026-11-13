import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { compileScript, parse } from '@vue/compiler-sfc'
import { extractVueExamples } from '../../scripts/lib/ai-docs.ts'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  page.on('console', message => {
    if (/hydration|failed to resolve component/i.test(message.text())) messages.push(message.text())
  })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
async function open(page: Page) {
  await page.goto('/docs/components/checkbox#overview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingCheckbox')
  await expect(page.getByRole('checkbox', { name: '启用动效反馈', exact: true })).toBeVisible()
}

for (const width of [1440, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`Checkbox ${width} ${theme}：章节、预览和 API`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
      await open(page)
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.doc-example')).toHaveCount(6)
      await expect(page.locator('.props-table')).toHaveCount(3)
      await expect(page.locator('.bing-code-block')).toHaveCount(6)
      expect(await page.locator('.doc-page h1[id], .doc-page h3[id], .doc-page section[id]').evaluateAll(nodes => nodes.map(node => node.id)))
        .toEqual(['overview', 'playground', 'states', 'sizes-tones', 'decorative', 'events-demo', 'interaction', 'props', 'slots-events', 'slots', 'events'])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.locator('#playground .doc-example').screenshot({ path: info.outputPath(`checkbox-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    })
  }
}

test('Checkbox：六段完整代码、标签转义、半选和禁用开关', async ({ page, context }) => {
  const examples = await extractVueExamples(await readFile(new URL('../../public/ai/components/checkbox.md', import.meta.url), 'utf8'))
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  for (const [index, code] of (await page.locator('.bing-code-block').all()).entries()) {
    await code.getByRole('button', { name: '复制代码', exact: true }).click()
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
  }
  const checkbox = page.locator('#playground .doc-example__preview input[type="checkbox"]')
  await checkbox.locator('..').click()
  await expect(checkbox).toBeChecked()
  await page.getByRole('checkbox', { name: '半选态', exact: true }).locator('..').click()
  await expect(checkbox).toHaveJSProperty('indeterminate', true)
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"indeterminate": true')
  await page.getByRole('checkbox', { name: '禁用', exact: true }).locator('..').click()
  await expect(checkbox).toBeDisabled()
  await page.locator('#checkbox-label').fill('测试 "引号" </script>\\路径')
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('\\u003c/script>')
  await page.locator('#playground .bing-code-block').getByRole('button', { name: '复制代码', exact: true }).click()
  const source = await page.evaluate(() => navigator.clipboard.readText())
  const parsed = parse(source)
  expect(parsed.errors).toEqual([])
  expect(() => compileScript(parsed.descriptor, { id: 'label-escaping' })).not.toThrow()
})

test('Checkbox：装饰模式没有 input，数字尺寸和事件反馈正确', async ({ page }) => {
  await open(page)
  await expect(page.locator('#decorative .doc-example input')).toHaveCount(0)
  await expect(page.locator('#decorative .doc-example .bing-checkbox[aria-hidden="true"]')).toHaveCount(4)
  const custom = page.getByRole('checkbox', { name: '自定义 34px', exact: true })
  await expect(custom.locator('..')).toHaveCSS('--bing-checkbox-size', '34px')
  const event = page.getByRole('checkbox', { name: '接收通知', exact: true })
  const log = page.locator('#events-demo .checkbox-feedback')
  await event.focus()
  await expect(log).toContainText('focus：获得焦点')
  await event.press('Space')
  await expect(log).toContainText('change：已选中')
  await page.locator('#checkbox-label').focus()
  await expect(log).toContainText('blur：失去焦点')
})
