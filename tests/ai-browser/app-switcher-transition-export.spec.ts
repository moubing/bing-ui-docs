import { expect, test, type Page } from '@playwright/test'
const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const messages: string[] = []; errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
const active = (page: Page) => page.locator('.bing-app-switcher-transition__card.is-active')

test('AppSwitcherTransition 导出基础：三张完整面板和键盘选择', async ({ page }) => {
  await page.goto('/?component=app-switcher-transition&example=basic')
  await expect(active(page)).toContainText('工作台总览')
  await expect(page.locator('.bing-app-switcher-transition__card')).toHaveCount(3)
  await page.getByRole('tab', { name: '总览', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toContainText('流程推进')
  await expect(page.getByRole('status')).toContainText('workflow')
})

test('AppSwitcherTransition 导出配置：外部赋值不发事件，真实动画更新插槽', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?component=app-switcher-transition&example=controls')
  await page.getByRole('button', { name: '选择总览', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('overview；change：等待切换')
  await expect(active(page).locator(':scope > div')).toHaveClass(/is-animating/)
  await expect(active(page).locator(':scope > div')).not.toHaveClass(/is-animating/)
  await page.getByRole('tab', { name: '指标', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('总览 -> 指标')
  await expect(active(page).locator(':scope > div')).not.toHaveClass(/is-animating/)
  await expect(active(page)).toHaveCSS('opacity', '1')
})

test('AppSwitcherTransition 导出插槽：隐藏内容 inert、计数常驻和横向滚轮', async ({ page }) => {
  await page.goto('/?component=app-switcher-transition&example=slots')
  await page.getByRole('button', { name: '总览计数：0', exact: true }).click()
  await page.locator('.bing-app-switcher-transition').dispatchEvent('wheel', { deltaX: 60, deltaY: 0 })
  await expect(active(page)).toContainText('流程')
  await expect(page.getByRole('button', { name: '总览计数：1', exact: true })).toHaveCount(0)
  await page.getByRole('tab', { name: '总览', exact: true }).click()
  await expect(page.getByRole('button', { name: '总览计数：1', exact: true })).toBeVisible()
})

test('AppSwitcherTransition 阅读应用：滚轮遇禁用邻项停止，键盘跳过', async ({ page }) => {
  await page.goto('/?understanding=app-switcher-transition')
  await page.clock.install()
  const prevented = await page.locator('.bing-app-switcher-transition').evaluate(node => {
    const wheel = new WheelEvent('wheel', { deltaX: 60, deltaY: 0, bubbles: true, cancelable: true }); node.dispatchEvent(wheel); return wheel.defaultPrevented
  })
  expect(prevented).toBe(true)
  await page.clock.fastForward(100)
  await expect(page.getByRole('status')).toHaveText('模型 a；更新 0；变化 0')
  await page.getByRole('tab', { name: '甲', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toContainText('丙')
  await expect(page.getByRole('status')).toHaveText('模型 c；更新 1；变化 1')
})

test('AppSwitcherTransition 阅读应用：全局和项目禁用不阻止外部赋值', async ({ page }) => {
  await page.goto('/?understanding=app-switcher-transition')
  await page.locator('#disabled').check()
  await page.locator('#external').click()
  await expect(active(page)).toContainText('乙')
  await expect(page.getByRole('status')).toHaveText('模型 b；更新 0；变化 0')
  await page.locator('#invalid').click()
  await expect(active(page)).toHaveCount(0)
  await expect(page.locator('.bing-app-switcher-transition__card[aria-hidden="true"]')).toHaveCount(3)
})

test('AppSwitcherTransition 阅读应用：忽略受控更新会让模型与卡片动画不一致', async ({ page }) => {
  await page.goto('/?understanding=app-switcher-transition')
  await page.locator('#sync').uncheck()
  await page.getByRole('tab', { name: '丙', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('模型 a；更新 1；变化 1')
  await expect(active(page)).toContainText('甲')
  await expect(page.locator('.bing-app-switcher-transition__card').nth(2)).toHaveCSS('opacity', '1')
  await expect(active(page)).toHaveCSS('opacity', '0')
})
