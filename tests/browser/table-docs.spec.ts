import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { exerciseTableControls, exerciseTableLoading } from './table-controls'
import { exerciseRemoteTable } from './s1-interactions'
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'table', title: 'BingTable', ready: '#basic .bing-table', previews: 16, tables: 7,
  sections: ['overview','basic','tree','columns','virtual','controls-loading','expose','remote','keyboard','cascade','remote-selection','active','variable','error','skeleton','focus','theme','props','column-shape','slots-events','slots','events','types','smooth-options'] })
test('Table：实际文档内的编辑、全文提示和加载过程', async ({ page }, info) => {
  await open(page)
  await exerciseTableControls(page)
  await exerciseTableLoading(page)
  await page.locator('#controls-loading .doc-example__preview').screenshot({ path: info.outputPath('table-controls.png') })
})

test('Table：服务端排序、单次请求和真实末页', async ({ page }) => {
  await open(page)
  await exerciseRemoteTable(page)
})

test('Table：状态与代码同步、分页与独立展开', async ({ page }) => {
  await open(page)
  const basic = page.locator('#basic')
  await basic.getByRole('checkbox', { name: '加载态', exact: true }).locator('..').click()
  await expect(basic.locator('.bing-table')).toContainText('正在加载项目')
  await basic.locator('.docs-example-code > summary').click()
  await expect(basic.locator('.bing-code-block')).toContainText('"loading": true')
  await basic.locator('.docs-example-code > summary').click()
  await basic.getByRole('checkbox', { name: '加载态', exact: true }).locator('..').click()
  await basic.getByRole('button', { name: '收起行', exact: true }).click()
  await expect(page.locator('#tree .bing-table__row')).toHaveCount(7)
  await basic.getByRole('checkbox', { name: '选择行 grid', exact: true }).locator('..').click()
  await expect(basic.locator('.table-feedback')).toContainText('grid')
  await basic.getByRole('button', { name: '下一页', exact: true }).click()
  await expect(basic.locator('.table-feedback')).toContainText('第 2 页')
})
test('Table：关闭列拖拽后恢复普通表头语义、光标并保留排序', async ({ page }) => {
  await open(page)
  const section = page.locator('#columns')
  const toggle = section.getByRole('checkbox', { name: '允许拖动列顺序', exact: true })
  const plain = section.locator('th[data-bing-table-sortable-key="stage"]')
  const label = plain.locator('.bing-table__header-label')
  const sort = section.getByRole('button', { name: '项目', exact: true })
  for (const enabled of [false, true, false]) {
    await toggle.locator('..').click()
    await expect(plain).not.toHaveAttribute('role', 'button')
    await expect(plain).not.toHaveAttribute('aria-disabled')
    await expect(plain).toHaveAttribute('scope', 'col')
    await label.hover()
    await expect.poll(() => label.evaluate(node => getComputedStyle(node).cursor))
      .toMatch(enabled ? /, grab$/ : /, default$/)
    await sort.hover()
    // BingCursor 只标记实际命中元素；按钮中心可能落在内部文字或图标上。
    await expect.poll(() => sort.evaluate(node => {
      const bounds = node.getBoundingClientRect()
      const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
      return hit && node.contains(hit) ? getComputedStyle(hit).cursor : ''
    })).toMatch(/, pointer$/)
  }
  await sort.click()
  await expect(section.locator('.bing-table__row').nth(1)).toContainText('Aurora 分析')
  await sort.click()
  await expect(section.locator('.bing-table__row').first()).toContainText('Texture Planner')
})

test('Table：窄屏列面板、横向滚动与缓存页面卸载', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 1000 }); await open(page)
  const basic = page.locator('#basic .bing-table')
  await basic.getByRole('button', { name: '列设置', exact: true }).click()
  const panel = page.locator('.bing-table__column-panel-shell')
  await expect(panel).toBeVisible()
  const box = await panel.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  await panel.screenshot({ path: info.outputPath('table-light-390.png'), animations: 'disabled' })
  const old = await basic.elementHandle()
  await navigateToDocs(page, 'button'); await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await expect(panel).toHaveCount(0); expect(await old!.evaluate(node=>node.isConnected)).toBe(false)
  await navigateToDocs(page, 'table')
  const viewport = page.getByRole('region', { name: '项目表格', exact: true })
  await viewport.hover(); await page.mouse.wheel(500, 0)
  await expect.poll(() => viewport.evaluate(node=>node.scrollLeft)).toBeGreaterThan(0)
})
