import { expect, type Page } from '@playwright/test'

export async function checkNestedPreviews(page: Page) {
  const before = await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))
  const entry = page.getByRole('button', { name: '查看项目附件', exact: true })
  await entry.click()
  const parent = page.getByRole('dialog', { name: '项目附件', exact: true })
  for (const [trigger, name] of [['预览说明文件', '项目说明预览'], ['预览示意图片', '项目图片预览']]) {
    const button = parent.getByRole('button', { name: trigger, exact: true })
    await button.click()
    const child = page.getByRole('dialog', { name, exact: true })
    await expect(child).toBeFocused()
    for (let step = 0; step < 10; step++) await page.keyboard.press('Tab')
    expect(await child.evaluate(node => node.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(child).toHaveCount(0)
    await expect(parent).toBeVisible()
    await expect(button).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  }
  await page.keyboard.press('Escape')
  await expect(parent).toHaveCount(0)
  await expect(entry).toBeFocused()
  await expect.poll(() => page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))).toEqual(before)
}
