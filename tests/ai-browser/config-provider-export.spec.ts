import { expect, test, type Page } from '@playwright/test'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

test('ConfigProvider 导出尺寸：继承、显式优先与嵌套覆盖', async ({ page }) => {
  await page.goto('/?component=config-provider&example=size')
  const outer = page.locator('section[aria-label="外层 Provider"]')
  await expect(outer.locator('.bing-input')).toHaveClass(/bing-input--lg/)
  await expect(outer.getByRole('button', { name: '显式 sm', exact: true })).toHaveClass(/bing-button--sm/)
  await page.getByRole('radio', { name: 'sm', exact: true }).locator('..').click()
  await expect(outer.locator('.bing-select')).toHaveClass(/bing-select--sm/)
  await expect(outer.locator('.bing-tag')).toHaveClass(/bing-tag--sm/)
  await expect(page.locator('section[aria-label="嵌套 Provider"] .bing-input')).toHaveClass(/bing-input--sm/)
})

test('ConfigProvider 导出层级：基准切换后弹窗盖住挂件', async ({ page }) => {
  await page.goto('/?component=config-provider&example=layers')
  await page.getByRole('radio', { name: /提高到 3000/ }).locator('..').click()
  await page.getByRole('button', { name: '打开弹窗', exact: true }).click()
  await expect(page.locator('.bing-dialog-root')).toHaveCSS('z-index', '3000')
  await expect(page.getByRole('complementary', { name: '第三方客服挂件' })).toHaveCSS('z-index', '2500')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await page.getByRole('button', { name: '悬停查看提示层级', exact: true }).hover()
  await expect(page.getByRole('tooltip')).toHaveCSS('z-index', '4200')
})

test('ConfigProvider 导出动效：always / never 覆盖系统偏好', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?component=config-provider&example=motion')
  const text = page.locator('.bing-animated-text.motion-demo__title')
  await expect(text).toHaveText('跟随全局动效策略')
  await expect(text).not.toHaveAttribute('data-jump-ready')
  await page.getByRole('radio', { name: /^never/ }).locator('..').click()
  await expect(text).toHaveAttribute('data-jump-ready', 'true')
  await page.getByRole('radio', { name: /^always/ }).locator('..').click()
  await expect(text).not.toHaveAttribute('data-jump-ready')
  await page.getByRole('button', { name: '点击反馈', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('当前策略：always；按钮点击 1 次')

  // Tooltip 的 CSS 降级仍跟随系统；在无系统降级时检查两个局部 JS 策略。
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const panel = page.getByRole('tooltip')
  await page.getByRole('button', { name: '局部完整动效', exact: true }).hover()
  await expect(panel).toHaveText('这个提示始终完整播放动画。')
  await expect(panel).not.toHaveCSS('transform', 'none')
  await panel.evaluate(node => node.setAttribute('data-motion-test', 'shared'))
  await page.getByRole('button', { name: '局部减少动效', exact: true }).hover()
  await expect(panel).toHaveText('这个提示不播放过渡动画。')
  await expect(panel).toHaveAttribute('data-motion-test', 'shared')
  await expect(panel).toHaveCSS('transform', 'none')
  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
})
