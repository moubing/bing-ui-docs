import { expect, test, type Page } from '@playwright/test'
const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const messages: string[] = []; errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
const active = (page: Page) => page.locator('.bing-carousel-transition__panel.is-active')

test('CarouselTransition 导出基础：三张完整面板和键盘选择', async ({ page }) => {
  await page.goto('/?component=carousel-transition&example=basic')
  await expect(active(page)).toContainText('当前状态快照')
  await expect(page.locator('.bing-carousel-transition__panel')).toHaveCount(3)
  await page.getByRole('tab', { name: '概览', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toContainText('最近活动')
  await expect(page.getByRole('status')).toContainText('activity')
})

test('CarouselTransition 导出配置：外部赋值不发事件，真实动画更新插槽', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/?component=carousel-transition&example=controls')
  await page.getByRole('button', { name: '选择概览', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('snapshot；change：等待切换')
  await expect(active(page).locator(':scope > div')).toHaveClass(/is-animating/)
  await expect(active(page).locator(':scope > div')).not.toHaveClass(/is-animating/)
  await page.getByRole('tab', { name: '洞察', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('概览 -> 洞察')
  await expect(active(page).locator(':scope > div')).not.toHaveClass(/is-animating/)
  await expect(page.locator('.bing-carousel-transition__track')).toHaveCSS('transform', /matrix/)
})

test('CarouselTransition 导出滚轮：隐藏内容 inert、计数常驻和横向滚轮', async ({ page }) => {
  await page.goto('/?component=carousel-transition&example=wheel')
  await page.getByRole('button', { name: '概览计数：0', exact: true }).click()
  await page.locator('.bing-carousel-transition').dispatchEvent('wheel', { deltaX: 60, deltaY: 0 })
  await expect(active(page)).toContainText('动态')
  await expect(page.getByRole('button', { name: '概览计数：1', exact: true })).toHaveCount(0)
  await page.getByRole('tab', { name: '概览', exact: true }).click()
  await expect(page.getByRole('button', { name: '概览计数：1', exact: true })).toBeVisible()
})

test('CarouselTransition 阅读应用：滚轮禁用邻项的轨道偏差，键盘跳过', async ({ page }) => {
  await page.goto('/?understanding=carousel-transition')
  await page.clock.install()
  const prevented = await page.locator('.bing-carousel-transition').evaluate(node => {
    const wheel = new WheelEvent('wheel', { deltaX: 60, deltaY: 0, bubbles: true, cancelable: true }); node.dispatchEvent(wheel); return wheel.defaultPrevented
  })
  expect(prevented).toBe(true)
  await page.clock.fastForward(100)
  await expect(page.getByRole('status')).toHaveText('模型 a；更新 0；变化 0')
  expect(await page.locator('.bing-carousel-transition__track').evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).e / node.getBoundingClientRect().width)).toBeCloseTo(-1)
  await page.getByRole('tab', { name: '甲', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(active(page)).toContainText('丙')
  await expect(page.getByRole('status')).toHaveText('模型 c；更新 1；变化 1')
})

test('CarouselTransition 阅读应用：全局和项目禁用不阻止外部赋值', async ({ page }) => {
  await page.goto('/?understanding=carousel-transition')
  await page.locator('#disabled').check()
  await page.locator('#external').click()
  await expect(active(page)).toContainText('乙')
  await expect(page.getByRole('status')).toHaveText('模型 b；更新 0；变化 0')
  await page.locator('#invalid').click()
  await expect(active(page)).toHaveCount(0)
  await expect(page.locator('.bing-carousel-transition__panel[aria-hidden="true"]')).toHaveCount(3)
})

test('CarouselTransition 阅读应用：忽略受控更新会让模型与卡片动画不一致', async ({ page }) => {
  await page.goto('/?understanding=carousel-transition')
  await page.locator('#sync').uncheck()
  await page.getByRole('tab', { name: '丙', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('模型 a；更新 1；变化 1')
  await expect(active(page)).toContainText('甲')
  expect(await page.locator('.bing-carousel-transition__track').evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).e / node.getBoundingClientRect().width)).toBeCloseTo(-2)
})

 test('CarouselTransition 导出滚轮：阈值内回弹、边界不循环', async ({ page }) => {
  await page.goto('/?component=carousel-transition&example=wheel')
  await page.clock.install()
  const root = page.locator('.bing-carousel-transition')
  await root.dispatchEvent('wheel', { deltaX: 40, deltaY: 0 })
  await page.clock.fastForward(100)
  await expect(active(page)).toContainText('概览')
  await root.dispatchEvent('wheel', { deltaX: -60, deltaY: 0 })
  await page.clock.fastForward(100)
  await expect(active(page)).toContainText('概览')
  await root.dispatchEvent('wheel', { deltaX: 60, deltaY: 0 })
  await page.clock.fastForward(100)
  await expect(active(page)).toContainText('动态')
})
