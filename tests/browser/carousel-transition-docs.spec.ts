import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })
const open = componentDocsTests({ slug: 'carousel-transition', title: 'BingCarouselTransition', ready: '#basic .bing-carousel-transition', previews: 3, tables: 5,
  sections: ['overview', 'basic', 'controls', 'wheel', 'slots', 'props', 'item', 'events', 'types'] })

test('CarouselTransition：外部赋值、内部选择与禁用', async ({ page }) => {
  await open(page)
  const controls = page.locator('#controls')
  await controls.getByRole('radiogroup', { name: '选择轮播面板', exact: true }).getByRole('radio', { name: /^概览/ }).locator('..').click()
  await expect(controls.locator('.carousel-feedback')).toContainText('当前面板：概览')
  await expect(controls.locator('.carousel-feedback')).toContainText('change：等待切换')
  await controls.getByRole('tab', { name: '洞察', exact: true }).click()
  await expect(controls.locator('.carousel-feedback')).toContainText('概览 -> 洞察')
  await controls.getByRole('checkbox', { name: '禁用切换器', exact: true }).locator('..').click()
  await expect(controls.getByRole('tab', { name: '动态', exact: true })).toBeDisabled()
  await controls.getByRole('radiogroup', { name: '选择轮播面板', exact: true }).getByRole('radio', { name: /^动态/ }).locator('..').click()
  await expect(controls.locator('.bing-carousel-transition__panel.is-active')).toContainText('最近活动')
  await expect(controls.locator('.carousel-feedback')).toContainText('概览 -> 洞察')
  await controls.getByRole('checkbox', { name: '显示内置 tabs', exact: true }).locator('..').click()
  await expect(controls.getByRole('tab')).toHaveCount(0)
})

test('CarouselTransition：滚轮、插槽保留状态和缓存页面卸载', async ({ page }) => {
  await open(page)
  const slots = page.locator('#wheel')
  await slots.getByRole('button', { name: '概览计数：0', exact: true }).click()
  await slots.locator('.bing-carousel-transition').dispatchEvent('wheel', { deltaX: 60, deltaY: 0 })
  await expect(slots.getByRole('tab', { name: '动态', exact: true })).toHaveAttribute('aria-selected', 'true')
  await slots.getByRole('tab', { name: '概览', exact: true }).click()
  await expect(slots.getByRole('button', { name: '概览计数：1', exact: true })).toBeVisible()
  const previous = await slots.locator('.bing-carousel-transition').elementHandle()
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  expect(await previous!.evaluate(node => node.isConnected)).toBe(false)
  await navigateToDocs(page, 'carousel-transition')
  await expect(slots.getByRole('button', { name: '概览计数：1', exact: true })).toBeVisible()
})
