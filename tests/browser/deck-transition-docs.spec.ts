import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'deck-transition', title: 'BingDeckTransition', ready: '#basic .bing-deck-transition', previews: 3, tables: 5,
  sections: ['overview', 'basic', 'controls', 'wheel', 'props', 'slots', 'item', 'events', 'types'] })

test('DeckTransition：受控定位、事件、禁用和隐藏控制区', async ({ page }) => {
  await open(page)
  const preview = page.locator('#controls .doc-example').first()
  await preview.getByRole('radiogroup', { name: '选择卡片', exact: true }).getByRole('radio', { name: /^规划/ }).locator('..').click()
  await expect(preview.locator('.deck-feedback')).toContainText('当前卡片：规划')
  await expect(preview.locator('.deck-feedback')).toContainText('change：等待切换')
  await preview.getByRole('button', { name: '下一张', exact: true }).click()
  await expect(preview.locator('.deck-feedback')).toContainText('规划 -> 编写')
  await preview.getByRole('checkbox', { name: '禁用卡组', exact: true }).locator('..').click()
  await expect(preview.getByRole('button', { name: '下一张', exact: true })).toBeDisabled()
  await preview.getByRole('radiogroup', { name: '选择卡片', exact: true }).getByRole('radio', { name: /^验证/ }).locator('..').click()
  await expect(preview.locator('.deck-feedback')).toContainText('当前卡片：验证')
  await preview.getByRole('checkbox', { name: '显示控制区', exact: true }).locator('..').click()
  await expect(preview.locator('.deck-control-row')).toHaveCount(0)
})

test('DeckTransition：自定义终点、返回第一张与缓存页面卸载', async ({ page }) => {
  await open(page)
  const preview = page.locator('#controls .doc-example').nth(1)
  const next = preview.getByRole('button', { name: '下一张', exact: true })
  await next.click(); await expect(preview.locator('.deck-control-row')).toContainText('编写 / 2')
  await next.click(); await expect(next).toBeDisabled()
  await preview.getByRole('button', { name: '返回第一张', exact: true }).click()
  await expect(next).toBeEnabled()
  await next.click()
  const previous = await preview.locator('.bing-deck-transition').elementHandle()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  expect(await previous!.evaluate(node => node.isConnected)).toBe(false)
  await navigateToDocs(page, 'deck-transition')
  await expect(preview.locator('.deck-control-row')).toContainText('编写 / 2')
})
