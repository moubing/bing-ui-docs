import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { sortableKeys, startSortableDrag } from './sortable-actions'
import { exerciseSortableOverlay } from './sortable-overlay'
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'sortable-list', title: 'BingSortableList', ready: '#basic .bing-sortable-list', previews: 5, tables: 5,
  sections: ['overview','basic','disabled-handle','horizontal','controlled-order','drag-overlay','props','slots-events','slot-props','handle-props','events','types'] })
test('SortableList 窄屏：独立拖拽浮层与原列表顺序一致', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 1000 })
  await open(page)
  await exerciseSortableOverlay(page)
  await page.locator('#drag-overlay .doc-example__preview').screenshot({ path: testInfo.outputPath('sortable-overlay-390.png') })
})

test('SortableList：实际拖拽、键盘、禁用和代码同步', async ({ page }) => {
  await open(page)
  const list = page.getByRole('list', { name: '文档流程排序' })
  await startSortableDrag(page, list, 'idea', 'develop'); await page.mouse.up()
  await expect.poll(() => sortableKeys(list)).toEqual(['design','develop','idea','review'])
  await page.getByRole('button', { name: '重置', exact: true }).click()
  await list.getByRole('button', { name: '移动 需求收集' }).press('End')
  await expect.poll(() => sortableKeys(list)).toEqual(['design','develop','review','idea'])
  await page.getByRole('checkbox', { name: '禁用整个列表', exact: true }).locator('..').click()
  await expect(list.getByRole('button', { name: '移动 需求收集' })).toHaveAttribute('aria-disabled', 'true')
  await page.locator('#basic .docs-example-code > summary').click()
  await expect(page.locator('#basic .bing-code-block')).toContainText('"disabled": true')
  await page.locator('#basic .docs-example-code > summary').click()
})
test('SortableList：手柄切换与缓存页面清理', async ({ page }) => {
  await open(page)
  await page.getByRole('checkbox', { name: '整张卡片作为拖拽手柄', exact: true }).locator('..').click()
  const list = page.getByRole('list', { name: '文档区块排序' })
  await expect(list.locator('.sortable-handle')).toHaveCount(0)
  await list.getByRole('button', { name: '移动 示例' }).press('Home')
  await expect.poll(() => sortableKeys(list)).toEqual(['demo','summary','api','notes'])
  const old = await list.elementHandle()
  await navigateToDocs(page, 'button'); await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  expect(await old!.evaluate(node => node.isConnected)).toBe(false)
  await navigateToDocs(page, 'sortable-list')
  await expect.poll(() => sortableKeys(list)).toEqual(['demo','summary','api','notes'])
})
