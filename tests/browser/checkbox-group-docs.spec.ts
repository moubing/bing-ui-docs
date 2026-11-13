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
  await page.goto('/docs/components/checkbox-group#overview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingCheckboxGroup')
  await expect(page.getByRole('group', { name: '功能开关选项', exact: true })).toBeVisible()
}

for (const width of [1440, 390]) {
  for (const theme of ['light', 'dark']) {
    test(`CheckboxGroup ${width} ${theme}：章节、预览和 API 排版`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
      await open(page)
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.checkbox-group-doc .doc-example')).toHaveCount(5)
      await expect(page.locator('.props-table')).toHaveCount(4)
      await expect(page.locator('.bing-code-block')).toHaveCount(6)
      const groups = await page.locator('.doc-example [role="group"], .doc-example [role="radiogroup"]').evaluateAll(nodes => nodes.map(node => ({
        id: node.id, name: node.querySelector('input')?.getAttribute('name'),
      })))
      expect(new Set(groups.map(group => group.id)).size).toBe(groups.length)
      expect(new Set(groups.map(group => group.name)).size).toBe(groups.length)
      expect(await page.locator('.doc-page h1[id], .doc-page h3[id], .doc-page section[id]').evaluateAll(nodes => nodes.map(node => node.id)))
        .toEqual(['overview', 'playground', 'options', 'custom-slot', 'status-events', 'batch', 'props', 'options-api', 'slots-events', 'slots', 'events'])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      await page.locator('#playground .doc-example').screenshot({ path: info.outputPath(`checkbox-group-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    })
  }
}

test('CheckboxGroup：六个网页代码块等于导出文件，参数、选择和禁用正常', async ({ page, context }) => {
  const markdown = await readFile(new URL('../../public/ai/components/checkbox-group.md', import.meta.url), 'utf8')
  const examples = await extractVueExamples(markdown)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  for (const [index, code] of (await page.locator('.bing-code-block').all()).entries()) {
    await code.getByRole('button', { name: '复制代码', exact: true }).click()
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
  }
  const group = page.getByRole('group', { name: '功能开关选项', exact: true })
  await page.getByRole('button', { name: '全选可用项', exact: true }).click()
  await expect(group.locator('input:checked')).toHaveCount(3)
  await expect(group.getByRole('checkbox', { name: /^实验功能/ })).toBeDisabled()
  await page.getByRole('button', { name: '清空', exact: true }).click()
  await expect(group.locator('input:checked')).toHaveCount(0)
  await page.getByRole('radiogroup', { name: 'CheckboxGroup 排列方向', exact: true }).getByRole('radio', { name: /^column/ }).locator('..').click()
  await expect(group).toHaveClass(/bing-checkbox-group--column/)
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"direction": "column"')
  await page.getByRole('checkbox', { name: '禁用整组', exact: true }).locator('..').click()
  for (const checkbox of await group.getByRole('checkbox').all()) await expect(checkbox).toBeDisabled()
  await expect(page.locator('#playground .bing-code-block__code')).toContainText('"disabled": true')
})

test('CheckboxGroup：组内移动不重复触发焦点事件，离开整组触发 blur', async ({ page }) => {
  await open(page)
  const group = page.getByRole('group', { name: '通知渠道', exact: true })
  const first = group.getByRole('checkbox', { name: '站内提醒', exact: true })
  const second = group.getByRole('checkbox', { name: '邮件', exact: true })
  const log = page.locator('#status-events .checkbox-group-feedback')
  await first.focus()
  await expect(log).toContainText('focus：焦点进入选项组')
  await first.press('Space')
  await expect(log).toContainText('change：email、inbox')
  await second.focus()
  await expect(log).toContainText('change：email、inbox')
  await page.getByRole('button', { name: '清空', exact: true }).focus()
  await expect(log).toContainText('blur：焦点离开选项组')
})
