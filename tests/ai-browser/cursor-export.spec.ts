import { expect, test, type Page } from '@playwright/test'
import { checkCursorAppearance, checkCursorBasic, checkCursorNative, checkCursorScopes, cursorSvg, expectImageCursor } from '../browser/cursor-interactions'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(async ({ page }) => {
  const messages: string[] = []; errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
const businessClick = (page: Page, id: string) => page.locator('#' + id).evaluate((node: HTMLElement) => node.click())

test('Cursor 导出基础：识别、抓取、原生边界与真实点击输入', async ({ page }) => {
  await page.goto('/?component=cursor&example=basic')
  await checkCursorBasic(page, page.locator('#app'))
})

test('Cursor 导出状态：16 种原生图片与大小参数', async ({ page }) => {
  await page.goto('/?component=cursor&example=states')
  const cells = page.locator('.states [data-bing-cursor]')
  await expect(cells).toHaveCount(16)
  for (const cell of await cells.all()) {
    await cell.hover()
    await expectImageCursor(cell, (await cell.getAttribute('data-bing-cursor'))!)
  }
  await page.getByRole('spinbutton', { name: '光标尺寸', exact: true }).fill('48')
  await cells.first().hover()
  await expectImageCursor(cells.first(), 'default', 48)
  await expect(page.locator('[data-bing-cursor-layer]')).toHaveCount(0)
})

test('Cursor 导出外观：配色、尺寸、热点与真实点击', async ({ page }) => {
  await page.goto('/?component=cursor&example=appearance')
  await checkCursorAppearance(page, page.locator('#app'))
})

test('Cursor 导出回退：显式系统光标、忙碌状态和停用', async ({ page }) => {
  await page.goto('/?component=cursor&example=native')
  await checkCursorNative(page, page.locator('#app'))
})

test('Cursor 导出作用域：全局、嵌套局部与 Teleport', async ({ page }) => {
  await page.goto('/?component=cursor&example=scope')
  await checkCursorScopes(page, page.locator('#app'))
})

test('Cursor 阅读应用：静止鼠标时更新禁用、固定类型和样式', async ({ page }) => {
  await page.goto('/?understanding=cursor')
  const target = page.locator('#target')
  await target.hover()
  await expectImageCursor(target, 'pointer')
  await businessClick(page, 'target-disable')
  await expectImageCursor(target, 'not-allowed')
  await businessClick(page, 'fixed')
  await expectImageCursor(target, 'not-allowed')
  const plain = page.locator('#plain')
  await plain.hover()
  await expectImageCursor(plain, 'zoom-out')
  await businessClick(page, 'style')
  await expectImageCursor(plain, 'zoom-out', 128)
  await expect.poll(() => cursorSvg(plain)).toContain('rgb(82, 82, 91)')
  await expect(plain).toHaveCSS('cursor', /\) 8 9, zoom-out$/)
  await businessClick(page, 'disable')
  await expect(plain).not.toHaveCSS('cursor', /url\(/)
  await expect(page.locator('html')).not.toHaveAttribute('data-bing-cursor-native')
  await businessClick(page, 'enable')
  await expectImageCursor(plain, 'zoom-out')
})

test('Cursor 阅读应用：原生控件、触摸、键盘与强制颜色', async ({ page }) => {
  await page.goto('/?understanding=cursor')
  for (const selector of ['#wait', '#native', 'select']) {
    await page.locator('#target').hover()
    await expectImageCursor(page.locator('#target'), 'pointer')
    await page.locator(selector).hover()
    await expect(page.locator(selector)).not.toHaveCSS('cursor', /url\(/)
    await expect(page.locator('[data-bing-cursor-native]')).toHaveCount(0)
  }
  await page.locator('#target').hover()
  await page.keyboard.press('Tab')
  await expect(page.locator('[data-bing-cursor-native]')).toHaveCount(0)
  await page.locator('#target').hover()
  await page.locator('#target').dispatchEvent('pointerdown', { pointerType: 'touch', buttons: 1, bubbles: true })
  await expect(page.locator('[data-bing-cursor-native]')).toHaveCount(0)
  await page.locator('#target').hover()
  await page.emulateMedia({ forcedColors: 'active' })
  await expect(page.locator('[data-bing-cursor-native]')).toHaveCount(0)
})

test('Cursor 阅读应用：指针捕获与卸载后恢复样式', async ({ page }) => {
  await page.goto('/?understanding=cursor')
  const grab = page.locator('#grab')
  await grab.hover()
  await page.mouse.down()
  await expectImageCursor(grab, 'grabbing')
  await page.locator('#plain').hover()
  await expectImageCursor(page.locator('#plain'), 'grabbing')
  await page.mouse.up()
  await expectImageCursor(page.locator('#plain'), 'default')
  await businessClick(page, 'unmount')
  await expect(page.locator('[data-bing-cursor-layer], [data-bing-cursor-native]')).toHaveCount(0)
  await expect(page.locator('style[data-bing-cursor-style], style[data-bing-cursor-source]')).toHaveCount(0)
  await expect(grab).toHaveCSS('cursor', 'grab')
})

test('Cursor 导出状态：减少动态效果仍可使用静态光标', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?component=cursor&example=states')
  const pointer = page.locator('.states [data-bing-cursor="pointer"]')
  await pointer.hover()
  await expectImageCursor(pointer, 'pointer')
  await expect(page.locator('[data-bing-cursor-layer]')).toHaveCount(0)
})
