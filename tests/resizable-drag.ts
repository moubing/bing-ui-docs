import { expect, type Locator, type Page } from '@playwright/test'

/** 在同一次真实指针拖动中跨过横纵位移分界，包含反向和微小抖动。 */
export async function verifyContinuousRatioDrag(page: Page, group: Locator) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const handle = group.getByRole('button', { name: '调整右下角尺寸', exact: true })
  await handle.scrollIntoViewIfNeeded()
  const start = (await group.boundingBox())!
  const box = (await handle.boundingBox())!
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  try {
    for (const [dx, dy] of [[60, 60], [30, -30]] as const) {
      await page.mouse.move(x + dx, y + dy)
      const before = (await group.boundingBox())!
      for (const jitter of [1, -1, 0]) {
        await page.mouse.move(x + dx, y + dy + jitter)
        await expect(group).toHaveClass(/is-resizing/)
        const after = (await group.boundingBox())!
        expect(after.width / after.height).toBeCloseTo(start.width / start.height, 2)
        expect(Math.abs(after.width - before.width)).toBeLessThanOrEqual(1.1)
        expect(Math.abs(after.height - before.height)).toBeLessThanOrEqual(1.1)
      }
    }
  } finally {
    await page.mouse.up()
  }
  const final = (await group.boundingBox())!
  expect(final.width / final.height).toBeCloseTo(start.width / start.height, 2)
  expect(final.width % 12).toBeLessThan(0.02)
  await expect(group).not.toHaveClass(/is-resizing/)
}
