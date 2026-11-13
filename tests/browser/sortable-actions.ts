import { expect, type Locator, type Page } from '@playwright/test'
export async function sortableKeys(list: Locator) { return list.locator(':scope > .bing-sortable-list__item').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-bing-sortable-key'))) }
export async function startSortableDrag(page: Page, list: Locator, from: string, to: string) {
  const source = list.locator(`[data-bing-sortable-key="${from}"]`).getByRole('button')
  await source.scrollIntoViewIfNeeded()
  const start = await source.boundingBox()
  const target = await list.locator(`[data-bing-sortable-key="${to}"]`).boundingBox()
  if (!start || !target) throw new Error('缺少拖拽位置')
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
  await page.mouse.down()
  await page.mouse.move(start.x + start.width / 2 + 8, start.y + start.height / 2 + 8, { steps: 3 })
  await expect(list).toHaveClass(/is-dragging/)
  const x = target.x + Math.min(target.width / 2, start.x + start.width / 2 - target.x)
  const y = target.y + target.height * 0.8
  await page.mouse.move(x, y, { steps: 14 })
  await page.mouse.move(x + 1, y + 1)
}
