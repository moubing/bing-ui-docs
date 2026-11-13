import { expect, test, type Page } from '@playwright/test'
import { exerciseDragDropBasic, exerciseDragDropRules } from '../browser/drag-drop-actions'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const list: string[] = []
  errors.set(page, list)
  page.on('pageerror', error => list.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

test('DragDrop 导出基础：跨区域拖动、区域外归位、链接与菜单入口', async ({ page }) => {
  await page.goto('/?component=drag-drop&example=basic')
  await exerciseDragDropBasic(page, page)
})

test('DragDrop 导出规则：accept、禁用条目、忽略输入框、取消、dropOnSource 与删除区', async ({ page }) => {
  await page.goto('/?component=drag-drop&example=rules')
  await exerciseDragDropRules(page, page)
})

test.describe('触屏', () => {
  test.use({ hasTouch: true, viewport: { width: 900, height: 800 } })

  test('DragDrop 导出基础：触屏长按后拖动，长按前滑动不拖动', async ({ page, context }) => {
    await page.goto('/?component=drag-drop&example=basic')
    const queued = page.locator('.bing-drop-zone[aria-label="待处理"]')
    const doing = page.locator('.bing-drop-zone[aria-label="进行中"]')
    const card = queued.locator('.card', { hasText: 'REQ-12' })
    await expect(card).toBeVisible()
    const from = (await card.boundingBox())!
    const to = (await doing.boundingBox())!
    const client = await context.newCDPSession(page)
    const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number, y: number) => client.send('Input.dispatchTouchEvent', {
      type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
    })
    const sx = from.x + 30
    const sy = from.y + from.height / 2
    // 立即滑动：视为滚动，不开始拖动。
    await touch('touchStart', sx, sy)
    for (let i = 1; i <= 8; i++) await touch('touchMove', sx + i * 20, sy)
    await touch('touchEnd', sx + 160, sy)
    await expect(queued.locator('.card', { hasText: 'REQ-12' })).toHaveCount(1)
    // 长按超过 300ms 后拖到进行中。
    await touch('touchStart', sx, sy)
    await page.waitForTimeout(450)
    const tx = to.x + to.width / 2
    const ty = to.y + 60
    for (let i = 1; i <= 10; i++) await touch('touchMove', sx + (tx - sx) * i / 10, sy + (ty - sy) * i / 10)
    await expect(doing).toHaveAttribute('data-bing-drop-state', 'over')
    await touch('touchEnd', tx, ty)
    await expect(doing.locator('.card', { hasText: 'REQ-12' })).toHaveCount(1)
  })
})
