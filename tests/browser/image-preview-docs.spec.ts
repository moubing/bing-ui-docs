import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

const open = componentDocsTests({ slug: 'image-preview', title: 'BingImagePreview', ready: '#basic .image-preview-demo-stage .bing-button', previews: 4, tables: 4,
  sections: ['overview', 'basic', 'controlled-gallery', 'toolbar-behavior', 'glass', 'accessibility-lifecycle', 'props', 'item-events', 'item-shape', 'events', 'api-types'] })

test('ImagePreview：初始图片控制、缩略图、事件和缓存页面清理', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const before = await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))
  await page.getByRole('radiogroup', { name: '初始图片', exact: true }).getByRole('radio', { name: /^2/ }).locator('..').click()
  await page.getByRole('button', { name: '打开预览', exact: true }).click()
  await expect(page.locator('.bing-image-preview__counter')).toHaveAttribute('aria-label', '第 3 张，共 3 张')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: '预览图片二', exact: true }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#controlled-gallery .image-preview-feedback')).toHaveText('当前索引：2')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: '打开带事件的预览', exact: true }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('#toolbar-behavior .image-preview-feedback')).toContainText('最后切换：2：第二张图片')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('#toolbar-behavior .image-preview-feedback')).toContainText('关闭来源：escape')
  await page.getByRole('button', { name: '查看玻璃效果', exact: true }).click()
  await page.locator('a[href="/docs/components/button"]').first().evaluate((node: HTMLAnchorElement) => node.click())
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))).toEqual(before)
  await navigateToDocs(page, 'image-preview')
  await expect(page.locator('.doc-page h1')).toHaveText('BingImagePreview')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: '打开预览', exact: true }).click()
  await expect(page.locator('.bing-image-preview__counter')).toHaveAttribute('aria-label', '第 3 张，共 3 张')
})

test('ImagePreview：关闭工具栏和遮罩后仍保留 Escape 退出', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  for (const name of ['显示工具栏', '允许 Escape 关闭', '允许点击遮罩关闭']) {
    await page.getByRole('checkbox', { name, exact: true }).locator('..').click()
  }
  await page.getByRole('button', { name: '打开带事件的预览', exact: true }).click()
  await expect(page.getByRole('button', { name: '关闭预览', exact: true })).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('#toolbar-behavior .image-preview-feedback')).toContainText('关闭来源：escape')
})

test('ImagePreview：打开后的桌面与手机布局', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const { width, theme } of [{ width: 1440, theme: 'light' }, { width: 390, theme: 'dark' }]) {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
    await open(page)
    await page.getByRole('button', { name: '打开预览', exact: true }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toHaveClass(/is-active/)
    await expect.poll(() => dialog.locator('img').evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(900)
    expect(await dialog.evaluate(node => node.scrollWidth <= innerWidth)).toBe(true)
    await expect(dialog.getByRole('button', { name: '关闭预览', exact: true })).toBeVisible()
    await dialog.screenshot({ path: info.outputPath(`image-preview-${theme}-${width}.png`), animations: 'disabled', style: '#nuxt-devtools-container { display: none !important; }' })
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  }
})
