import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { dropZone, exerciseDragDropBasic, exerciseDragDropRules, startDrag } from './drag-drop-actions'

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'drag-drop', title: 'BingDragDrop', ready: '#basic .bing-drop-zone', previews: 2, tables: 8,
  sections: ['overview', 'basic', 'rules', 'props', 'drag-drop-props', 'draggable-props', 'drop-zone-props', 'overlay-props', 'slots-events', 'events', 'slot-props', 'methods', 'types'] })

test('DragDrop：跨区域拖动、区域外归位、链接与菜单入口', async ({ page }) => {
  await open(page)
  await exerciseDragDropBasic(page, page.locator('#basic'))
})

test('DragDrop：放置规则、事件、取消与拖动时出现的区域', async ({ page }) => {
  await open(page)
  await exerciseDragDropRules(page, page.locator('#rules'))
})

test('DragDrop 窄屏暗色：拖动中的浮层与区域状态', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 })
  await page.addInitScript(() => localStorage.setItem('bing-ui-docs-theme', 'dark'))
  await open(page)
  const root = page.locator('#basic')
  // 先定位预览，截图时不再滚动，浮层与指针保持一致。
  await root.locator('.doc-example__preview').evaluate(node => node.scrollIntoView({ block: 'start' }))
  await startDrag(page, dropZone(root, '待处理').locator('.card').first(), dropZone(root, '进行中'))
  await expect(dropZone(root, '进行中')).toHaveAttribute('data-bing-drop-state', 'over')
  await root.locator('.doc-example__preview').screenshot({ path: info.outputPath('drag-drop-dark-390.png') })
  await page.mouse.up()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('DragDrop：离开缓存页面卸载预览，返回后重新挂载', async ({ page }) => {
  await open(page)
  const root = page.locator('#basic')
  await startDrag(page, dropZone(root, '待处理').locator('.card').first(), dropZone(root, '进行中'))
  await page.mouse.up()
  const old = await root.locator('.bing-drop-zone').first().elementHandle()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  expect(await old!.evaluate(node => node.isConnected)).toBe(false)
  await expect(page.locator('.bing-drag-overlay')).toHaveCount(0)
  await navigateToDocs(page, 'drag-drop')
  await expect(dropZone(page.locator('#basic'), '进行中')).toBeVisible()
})
