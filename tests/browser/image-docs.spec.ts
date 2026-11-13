import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

const open = componentDocsTests({ slug: 'image', title: 'BingImage', ready: '#playground .bing-image.is-loaded', previews: 5, tables: 6,
  prepare: async page => { await page.locator('#playground .bing-image').scrollIntoViewIfNeeded() },
  sections: ['overview', 'playground', 'fallback', 'fit-ratio', 'preview', 'slots-events', 'slots', 'events', 'props', 'api-types', 'payloads', 'preview-item'] })

test('Image：裁剪控制、回退和错误重试恢复', async ({ page }) => {
  await open(page)
  await expect(page.locator('#playground .image-feedback')).toContainText('900 × 560')
  await page.getByRole('radiogroup', { name: '图片裁剪方式', exact: true }).getByRole('radio', { name: /^contain/ }).locator('..').click()
  await expect(page.locator('#playground img.bing-image__img')).toHaveCSS('object-fit', 'contain')
  await page.locator('#fallback .bing-image').scrollIntoViewIfNeeded()
  await expect(page.locator('#fallback .image-feedback')).toContainText('状态：loaded')
  await expect(page.locator('#fallback .image-feedback')).toContainText('错误事件：1')
  await page.locator('#slots-events .bing-image').scrollIntoViewIfNeeded()
  await expect(page.locator('#slots-events .image-feedback')).toContainText('错误事件：1')
  await page.getByRole('button', { name: '重试', exact: true }).click()
  await expect(page.locator('#slots-events .image-feedback')).toContainText('错误事件：2')
  await page.getByRole('button', { name: '使用有效图片', exact: true }).click()
  await expect(page.locator('#slots-events .bing-image')).toHaveClass(/is-loaded/)
  await page.getByRole('button', { name: '重置示例', exact: true }).click()
  await expect(page.locator('#slots-events .image-feedback')).toContainText('错误事件：3')
})

test('Image：预览图库索引与缓存页面清理滚动锁', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page)
  const before = await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))
  await page.locator('#preview .bing-image').nth(1).scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: '预览图库图片二', exact: true }).click()
  await expect(page.locator('.bing-image-preview__counter')).toHaveAttribute('aria-label', '第 2 张，共 3 张')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.bing-image-preview__counter')).toHaveAttribute('aria-label', '第 3 张，共 3 张')
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.locator('a[href="/docs/components/button"]').first().evaluate((node: HTMLAnchorElement) => node.click())
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))).toEqual(before)
  await navigateToDocs(page, 'image')
  await expect(page.locator('.doc-page h1')).toHaveText('BingImage')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.locator('#playground .bing-image').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: '预览组件封面图', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
