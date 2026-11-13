import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
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
  await page.goto('/docs/components/radio-group#overview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingRadioGroup')
  await expect(page.getByRole('radiogroup', { name: '展示模式', exact: true })).toBeVisible()
}

for (const width of [1440, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`RadioGroup ${width} ${theme}：章节、预览、API 和独立组名称`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
      await open(page)
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.doc-example')).toHaveCount(4)
      await expect(page.locator('.props-table')).toHaveCount(4)
      await expect(page.locator('.bing-code-block')).toHaveCount(4)
      expect(await page.locator('.doc-page h1[id], .doc-page h3[id], .doc-page section[id]').evaluateAll(nodes => nodes.map(node => node.id)))
        .toEqual(['overview', 'playground', 'options', 'custom-slot', 'keyboard-events', 'props', 'options-api', 'slots-events', 'slots', 'events'])
      const groups = await page.locator('.doc-example [role="radiogroup"]').evaluateAll(nodes => nodes.map(node => ({ id: node.id, name: node.querySelector('input')?.getAttribute('name') })))
      expect(new Set(groups.map(group => group.id)).size).toBe(groups.length)
      expect(new Set(groups.map(group => group.name)).size).toBe(groups.length)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.locator('#playground .doc-example').screenshot({ path: info.outputPath(`radio-group-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    })
  }
}

test('RadioGroup：四段网页代码等于导出，参数控制不取消其他单选组的选中项', async ({ page, context }) => {
  const examples = await extractVueExamples(await readFile(new URL('../../public/ai/components/radio-group.md', import.meta.url), 'utf8'))
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  for (const [index, code] of (await page.locator('.bing-code-block').all()).entries()) {
    await code.getByRole('button', { name: '复制代码', exact: true }).click()
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
  }
  const group = page.getByRole('radiogroup', { name: '展示模式', exact: true })
  await page.getByRole('button', { name: '清空外部值', exact: true }).click()
  await expect(group.locator('input:checked')).toHaveCount(0)
  await page.getByRole('button', { name: '选择推荐', exact: true }).click()
  await expect(group.getByRole('radio', { name: /^标准模式/ })).toBeChecked()
  await page.getByRole('radiogroup', { name: 'RadioGroup 排列方向', exact: true }).getByRole('radio', { name: /^column/ }).locator('..').click()
  await expect(group.getByRole('radio', { name: /^标准模式/ })).toBeChecked()
  await expect(page.getByRole('radiogroup', { name: 'RadioGroup 尺寸', exact: true }).getByRole('radio', { name: 'md', exact: true })).toBeChecked()
  await expect(group).toHaveClass(/bing-radio-group--column/)
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"direction": "column"')
  await page.getByRole('checkbox', { name: '禁用整组', exact: true }).locator('..').click()
  for (const radio of await group.getByRole('radio').all()) await expect(radio).toBeDisabled()
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"disabled": true')
})

test('RadioGroup：方向键跳过禁用项、首尾循环，离开组触发 blur', async ({ page }) => {
  await open(page)
  const group = page.getByRole('radiogroup', { name: '文档步骤', exact: true })
  const first = group.getByRole('radio', { name: /^第一步/ })
  const last = group.getByRole('radio', { name: /^第三步/ })
  const log = page.locator('#keyboard-events .radio-group-feedback')
  await first.focus()
  await first.press('ArrowRight')
  await expect(last).toBeFocused()
  await expect(last).toBeChecked()
  await expect(log).toContainText('change：step-3')
  await last.press('ArrowDown')
  await expect(first).toBeFocused()
  await expect(first).toBeChecked()
  await page.getByRole('button', { name: '清空外部值', exact: true }).focus()
  await expect(log).toContainText('blur：焦点离开选项组')
})
