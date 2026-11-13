import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { extractVueExamples } from '../../scripts/lib/ai-docs.ts'

const screenshotStyle = '#nuxt-devtools-container, .nuxt-loading-indicator { display: none !important; }'
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

async function open(page: Page, theme = 'light') {
  await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
  await page.goto('/docs/components/tabs#overview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingTabs')
  await expect(page.getByRole('tablist', { name: '文档分组', exact: true })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
}

for (const theme of ['light', 'dark']) {
  for (const width of [1440, 390]) {
    test(`Tabs ${theme} ${width}：交互区、插槽和 API 结构`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 })
      await open(page, theme)
      await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
      await expect(page.locator('.doc-example')).toHaveCount(4)
      await expect(page.locator('.props-table')).toHaveCount(4)
      await expect(page.locator('#props .props-table tbody tr').first()).toBeVisible()
      const toolbars = page.locator('#variants .tabs-toolbar')
      await expect(toolbars).toHaveCount(3)
      const offsets = await toolbars.evaluateAll(rows => rows.map(row => {
        const center = (selector: string) => {
          const rect = row.querySelector(selector)!.getBoundingClientRect()
          return rect.top + rect.height / 2
        }
        const tabs = center('[role="tablist"]')
        return [tabs - center('.tabs-toolbar__label'), tabs - center('.bing-button')]
      }))
      for (const offset of offsets.flat()) expect(Math.abs(offset)).toBeLessThanOrEqual(0.55)
      for (const id of ['basic', 'variants', 'item-slot', 'props']) {
        const target = page.locator('#' + id + (id === 'props' ? ' .props-table-wrap' : ' .doc-example'))
        await expect(target).toBeVisible()
        // 长预览需要更高视口，避免被文档滚动容器裁掉下半部分。
        const targetHeight = await target.evaluate(element => element.getBoundingClientRect().height)
        if (targetHeight + 400 > 1000) await page.setViewportSize({ width, height: Math.ceil(targetHeight + 400) })
        await target.evaluate(element => element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }))
        await target.screenshot({
          path: info.outputPath(`tabs-${theme}-${width}-${id}.png`),
          animations: 'disabled', style: screenshotStyle,
        })
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      expect(await page.locator('.doc-page h1[id], .doc-page section[id]').evaluateAll(elements => elements.map(element => element.id)))
        .toEqual(['overview', 'basic', 'variants', 'item-slot', 'keyboard', 'props', 'item', 'slots', 'events'])
    })
  }
}

test('Tabs：自动切换跳过禁用项，手动激活与基础区共享状态', async ({ page }) => {
  await open(page)
  const basic = page.getByRole('tablist', { name: '文档分组', exact: true })
  await basic.getByRole('tab', { name: '指标', exact: true }).click()
  await basic.getByRole('tab', { name: '指标', exact: true }).press('ArrowRight')
  await expect(basic.getByRole('tab', { name: '总览', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(basic.getByRole('tab', { name: '禁用项', exact: true })).toBeDisabled()
  const manual = page.getByRole('tablist', { name: '手动激活示例', exact: true })
  await manual.getByRole('tab', { name: '总览', exact: true }).focus()
  await manual.getByRole('tab', { name: '总览', exact: true }).press('ArrowRight')
  await expect(manual.getByRole('tab', { name: '用法', exact: true })).toBeFocused()
  await expect(manual.getByRole('tab', { name: '总览', exact: true })).toHaveAttribute('aria-selected', 'true')
  await manual.getByRole('tab', { name: '用法', exact: true }).press('Enter')
  await expect(basic.getByRole('tab', { name: '用法', exact: true })).toHaveAttribute('aria-selected', 'true')
  await manual.getByRole('tab', { name: '用法', exact: true }).press('End')
  await manual.getByRole('tab', { name: '指标', exact: true }).press('ArrowRight')
  await expect(manual.getByRole('tab', { name: '指标', exact: true })).toBeFocused()
})

test('Tabs：控制项同步完整代码，禁用整组，插槽正确显示业务字段', async ({ page }) => {
  await open(page)
  await page.getByRole('radiogroup', { name: 'Tabs 样式', exact: true }).getByRole('radio', { name: /^soft/ }).locator('..').click()
  await expect(page.locator('#basic .bing-code-block__code')).toContainText('"variant": "soft"')
  await page.getByRole('checkbox', { name: '禁用全部', exact: true }).locator('..').click()
  const basic = page.getByRole('tablist', { name: '文档分组', exact: true })
  for (const tab of await basic.getByRole('tab').all()) await expect(tab).toBeDisabled()
  await expect(page.locator('#basic .bing-code-block__code')).toContainText('"disabled": true')
  const rich = page.getByRole('tablist', { name: '任务阶段', exact: true })
  await rich.getByRole('tab', { name: /开发/ }).click()
  await expect(page.locator('#item-slot .tabs-panel')).toContainText('数量：6')
  await expect(rich.getByRole('tab', { name: /归档/ })).toBeDisabled()
})

test('Tabs：四个示例的网页复制代码与 AI 文档完全一致', async ({ page, context }) => {
  const markdown = await readFile(new URL('../../public/ai/components/tabs.md', import.meta.url), 'utf8')
  const examples = await extractVueExamples(markdown)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page)
  for (const [index, id] of ['basic', 'variants', 'item-slot', 'keyboard'].entries()) {
    await page.locator('#' + id + ' .bing-code-block').getByRole('button', { name: '复制代码', exact: true }).click()
    await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
  }
})
