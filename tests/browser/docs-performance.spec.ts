import { expect, test } from '@playwright/test'
import { sortableKeys, startSortableDrag } from './sortable-actions'

test('Table：代码按需高亮，关闭后释放高亮节点', async ({ page }) => {
  await page.goto('/docs/components/table')
  await expect(page.locator('#basic .bing-table')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.docs-example-code')).toHaveCount(7)
  await expect(page.locator('.docs-example-code .bing-code-block')).toHaveCount(0)
  expect(await page.locator('*').count()).toBeLessThan(10_000)

  const code = page.locator('#basic .docs-example-code')
  await code.locator('summary').click()
  await expect(code.locator('.bing-code-block')).toContainText('BingTable')
  await code.locator('summary').click()
  await expect(code.locator('.bing-code-block')).toHaveCount(0)
})

test('文档目录：滚动复用标题，仍能发现标题增删与改名', async ({ page }) => {
  await page.goto('/docs/components/table')
  const toc = page.locator('.docs-toc-list')
  await expect(toc.locator('a').first()).toBeVisible()
  await expect(page.locator('#basic .bing-table')).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const scans = await page.evaluate(async () => {
    const original = Element.prototype.querySelectorAll
    let calls = 0
    Element.prototype.querySelectorAll = function (this: Element, selector: string) {
      if (this.matches('.doc-page, .docs-content') && /\[id\]|\[data-docs-route\]/.test(selector)) calls++
      return original.call(this, selector)
    } as typeof original
    try {
      const viewport = document.querySelector('.docs-page-scrollbar > .bing-scrollbar__viewport')!
      for (let step = 0; step < 20; step++) {
        viewport.scrollTop += 20
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      }
      return calls
    } finally {
      Element.prototype.querySelectorAll = original
    }
  })
  expect(scans).toBeLessThan(3)
  await page.evaluate(() => {
    const section = document.createElement('section')
    section.id = 'performance-test-heading'
    section.innerHTML = '<h2>动态章节</h2>'
    document.querySelector('.doc-page')!.append(section)
  })
  await expect(toc.getByRole('link', { name: '动态章节', exact: true })).toHaveAttribute('href', '#performance-test-heading')
  await page.locator('#performance-test-heading h2').evaluate(node => { node.textContent = '更新后的章节' })
  await expect(toc.getByRole('link', { name: '更新后的章节', exact: true })).toHaveCount(1)
  await page.locator('#performance-test-heading').evaluate(node => node.remove())
  await expect(toc.getByRole('link', { name: '更新后的章节', exact: true })).toHaveCount(0)
})

test('SortableList：正常动画下可以拖拽排序', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/docs/components/sortable-list')
  const list = page.getByRole('list', { name: '文档流程排序' })
  await expect(list).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await startSortableDrag(page, list, 'idea', 'develop')
  await page.mouse.up()
  await expect.poll(() => sortableKeys(list)).toEqual(['design', 'develop', 'idea', 'review'])
  await list.getByRole('button', { name: '移动 需求收集', exact: true }).hover()
  await expect(page.locator('[data-bing-cursor-layer]')).toHaveCount(0)
  await expect(list.getByRole('button', { name: '移动 需求收集', exact: true })).toHaveCSS('cursor', 'grab')
})

test('折叠代码：禁用 JavaScript 时仍可展开完整 SSR 源码', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  try {
    const page = await context.newPage()
    await page.goto('/docs/components/table')
    const code = page.locator('#basic .docs-example-code')
    await code.locator('summary').click()
    await expect(code.locator('pre')).toBeVisible()
    await expect(code.locator('pre')).toContainText('BingTable')
  } finally {
    await context.close()
  }
})
