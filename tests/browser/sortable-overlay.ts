import { expect, type Page } from '@playwright/test'
import { sortableKeys, startSortableDrag } from './sortable-actions'

export async function exerciseSortableOverlay(page: Page) {
  const list = page.getByRole('list', { name: '可排序列表', exact: true })
  await startSortableDrag(page, list, 'draft', 'publish')
  const overlay = page.locator('.bing-sortable-list__overlay:not(:empty)')
  await expect(overlay).toBeVisible()
  await expect(overlay).toHaveAttribute('aria-hidden', 'true')
  await expect(overlay).toHaveAttribute('inert', '')
  await expect(overlay.locator('button')).toHaveAttribute('tabindex', '-1')
  await expect(overlay.locator('button')).toHaveAttribute('aria-disabled', 'true')
  await expect(list.getByRole('button', { name: '移动 整理草稿', exact: true })).toHaveCount(1)
  await expect(page.locator('.overlay-example [role="status"]')).toContainText('draft / review / publish')
  await page.mouse.up()
  await expect.poll(() => sortableKeys(list)).toEqual(['review', 'publish', 'draft'])
  await expect(overlay).toHaveCount(0)
  await list.getByRole('button', { name: '移动 整理草稿', exact: true }).press('Home')
  await expect.poll(() => sortableKeys(list)).toEqual(['draft', 'review', 'publish'])
  await page.getByRole('checkbox', { name: '使用拖拽浮层' }).locator('..').click()
  await expect(page.locator('.bing-sortable-list__overlay')).toHaveCount(0)
}
