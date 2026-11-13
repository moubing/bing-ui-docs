import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { extractVueExamples } from '../../scripts/lib/ai-docs.ts'

type ComponentPage = { slug: string; title: string; ready: string; previews: number; tables: number; sections: string[]; prepare?: (page: Page) => Promise<void> }

/** 通过真实导航切页；窄屏先展开目录，保留页面停用/恢复验证。 */
export async function navigateToDocs(page: Page, slug: string) {
  const toggle = page.getByRole('button', { name: '文档导航', exact: true })
  if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click()
  await page.locator(`.docs-nav-list a[href="/docs/components/${slug}"]`).click()
}

/** 迁移页面的共同验收：渲染、原有锚点、主题/窄屏和实际剪贴板代码。 */
export function componentDocsTests(config: ComponentPage) {
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
  const open = async (page: Page) => {
    await page.goto(`/docs/components/${config.slug}#overview`)
    await expect(page.locator('.doc-page h1')).toHaveText(config.title)
    await expect(page.locator('.doc-example').first()).toBeVisible()
    await config.prepare?.(page)
    // SSR 外壳可见时事件尚未绑定；等待 ClientOnly 内的真实预览控件。
    await expect(page.locator(config.ready).first()).toBeVisible()
  }
  for (const width of [1440, 390]) {
    for (const theme of ['light', 'dark']) {
      test(`${config.title} ${width} ${theme}：章节、预览和 API`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: 1000 })
        await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
        await open(page)
        await expect(page.locator('html')).toHaveAttribute('data-bing-theme', theme)
        await page.evaluate(() => document.fonts.ready)
        await expect(page.locator('.doc-example')).toHaveCount(config.previews)
        await expect(page.locator('.props-table')).toHaveCount(config.tables)
        expect(await page.locator('.doc-page h1[id], .doc-page h3[id], .doc-page section[id]').evaluateAll(nodes => nodes.map(node => node.id))).toEqual(config.sections)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        // 文档正文在独立滚动容器里；较长预览需要更高的截图视口，避免容器裁掉下半部分。
        const previewHeight = await page.locator('.doc-example').first().evaluate(node => node.getBoundingClientRect().height)
        if (previewHeight + 400 > 1000) await page.setViewportSize({ width, height: Math.ceil(previewHeight + 400) })
        await page.locator('.doc-example').first().evaluate(node => node.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }))
        await page.locator('.doc-example').first().screenshot({ path: info.outputPath(`${config.slug}-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
      })
    }
  }
  test(`${config.title}：网页复制内容与完整 AI 示例一致`, async ({ page, context }) => {
    const examples = await extractVueExamples(await readFile(new URL(`../../public/ai/components/${config.slug}.md`, import.meta.url), 'utf8'))
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await open(page)
    const blocks = page.locator('.doc-section > .bing-code-block, .doc-section > .docs-example-code')
    await expect(blocks).toHaveCount(examples.length)
    for (const [index, code] of (await blocks.all()).entries()) {
      const summary = code.locator(':scope > summary')
      if (await summary.count()) await summary.click()
      await code.getByRole('button', { name: '复制代码', exact: true }).click()
      await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(examples[index]!)
      if (await summary.count()) await summary.click()
    }
  })
  return open
}
