import { expect, test } from '@playwright/test'
import { checkNestedPreviews } from './file-preview-nested'
import { componentDocsTests, navigateToDocs } from './component-docs'

const open = componentDocsTests({ slug: 'file-preview', title: 'BingFilePreview', ready: '#basic .file-preview-demo-stage .bing-button', previews: 4, tables: 5,
  sections: ['overview', 'basic', 'text-csv-limits', 'office-preview', 'nested-preview', 'events-lifecycle', 'props', 'file-shape', 'events', 'api-types', 'smooth-options'] })
const close = async (page: import('@playwright/test').Page) => { await page.getByRole('button', { name: '关闭文件预览', exact: true }).click(); await expect(page.getByRole('dialog')).toHaveCount(0) }

test('FilePreview：样例类型、PDF 和 Office 真实内容、限制控制与缓存清理', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const before = await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))
  await page.getByRole('button', { name: '打开预览', exact: true }).click()
  await expect(page.locator('.bing-file-preview__text')).toContainText('BingFilePreview')
  await close(page)
  await page.getByRole('radiogroup', { name: '文件预览样例', exact: true }).getByRole('radio', { name: /^PDF/ }).locator('..').click()
  await page.getByRole('button', { name: '打开预览', exact: true }).click()
  const pdf = await page.locator('iframe').getAttribute('src')
  const decoded = Buffer.from(pdf!.split(',')[1]!, 'base64').toString('ascii')
  expect(decoded).toContain('/Type /Page ')
  expect(decoded).toContain('Bing UI FilePreview demo')
  expect(decoded).toMatch(/startxref\n\d+\n%%EOF/)
  await close(page)
  await page.getByRole('button', { name: '已转换预览', exact: true }).click()
  await expect(page.frameLocator('iframe').getByRole('heading', { name: '组件交付说明', exact: true })).toBeVisible()
  await close(page)
  await page.getByRole('radiogroup', { name: '限制预览类型', exact: true }).getByRole('radio', { name: /^unknown/ }).locator('..').click()
  await page.getByRole('button', { name: '打开限制示例', exact: true }).click()
  await expect(page.getByRole('heading', { name: '暂不支持此文件预览', exact: true })).toBeVisible()
  await close(page)
  await page.getByRole('radiogroup', { name: '限制预览类型', exact: true }).getByRole('radio', { name: /^csv/ }).locator('..').click()
  await page.getByRole('button', { name: '打开限制示例', exact: true }).click()
  await expect(page.locator('.bing-file-preview__table tbody tr')).toHaveCount(2)
  await page.locator('a[href="/docs/components/button"]').first().evaluate((node: HTMLAnchorElement) => node.click())
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))).toEqual(before)
  await navigateToDocs(page, 'file-preview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingFilePreview')
  await page.getByRole('button', { name: '打开限制示例', exact: true }).click()
  await expect(page.locator('.bing-file-preview__table tbody tr')).toHaveCount(2)
})

test('FilePreview：桌面和手机的 JSON 预览布局', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const { width, theme } of [{ width: 1440, theme: 'light' }, { width: 390, theme: 'dark' }]) {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
    await open(page)
    await page.getByRole('button', { name: '打开预览', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toHaveClass(/is-active/)
    await expect(page.locator('.bing-file-preview__text')).toContainText('BingFilePreview')
    expect(await dialog.evaluate(node => node.scrollWidth <= innerWidth)).toBe(true)
    await dialog.screenshot({ path: info.outputPath(`file-preview-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    await close(page)
  }
})

test('FilePreview：附件预览逐层关闭、焦点恢复与共享滚动锁', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  await checkNestedPreviews(page)
})
