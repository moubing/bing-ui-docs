import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'app-switcher-transition', title: 'BingAppSwitcherTransition', ready: '#basic .bing-app-switcher-transition', previews: 3, tables: 5,
  sections: ['overview', 'basic', 'controls', 'wheel', 'slots', 'slot-props', 'props', 'item', 'events', 'types'] })

test('AppSwitcherTransition：外部赋值、内部选择与禁用', async ({ page }) => {
  await open(page)
  const controls = page.locator('#controls')
  await controls.getByRole('radiogroup', { name: '选择应用面板', exact: true }).getByRole('radio', { name: /^总览/ }).locator('..').click()
  await expect(controls.locator('.app-switcher-feedback')).toContainText('当前面板：总览')
  await expect(controls.locator('.app-switcher-feedback')).toContainText('change：等待切换')
  await controls.getByRole('tab', { name: '指标', exact: true }).click()
  await expect(controls.locator('.app-switcher-feedback')).toContainText('总览 -> 指标')
  await controls.getByRole('checkbox', { name: '禁用切换器', exact: true }).locator('..').click()
  await expect(controls.getByRole('tab', { name: '流程', exact: true })).toBeDisabled()
  await controls.getByRole('radiogroup', { name: '选择应用面板', exact: true }).getByRole('radio', { name: /^流程/ }).locator('..').click()
  await expect(controls.locator('.bing-app-switcher-transition__card.is-active')).toContainText('流程推进')
  await expect(controls.locator('.app-switcher-feedback')).toContainText('总览 -> 指标')
  await controls.getByRole('checkbox', { name: '显示内置 tabs', exact: true }).locator('..').click()
  await expect(controls.getByRole('tab')).toHaveCount(0)
})

test('AppSwitcherTransition：滚轮、插槽保留状态和缓存页面卸载', async ({ page }) => {
  await open(page)
  const slots = page.locator('#slots')
  await slots.getByRole('button', { name: '总览计数：0', exact: true }).click()
  await slots.locator('.bing-app-switcher-transition').dispatchEvent('wheel', { deltaX: 60, deltaY: 0 })
  await expect(slots.getByRole('tab', { name: '流程', exact: true })).toHaveAttribute('aria-selected', 'true')
  await slots.getByRole('tab', { name: '总览', exact: true }).click()
  await expect(slots.getByRole('button', { name: '总览计数：1', exact: true })).toBeVisible()
  const previous = await slots.locator('.bing-app-switcher-transition').elementHandle()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  expect(await previous!.evaluate(node => node.isConnected)).toBe(false)
  await navigateToDocs(page, 'app-switcher-transition')
  await expect(slots.getByRole('button', { name: '总览计数：1', exact: true })).toBeVisible()
})
