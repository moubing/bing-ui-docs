import { expect, type Locator, type Page } from '@playwright/test'

async function cursorAtTarget(target: Locator) {
  // hover() 默认移动到可视中心；光标由实际命中元素决定，不依赖祖先的内部标记。
  return target.evaluate(node => {
    const rect = node.getBoundingClientRect()
    const x = (Math.max(0, rect.left) + Math.min(innerWidth, rect.right)) / 2
    const y = (Math.max(0, rect.top) + Math.min(innerHeight, rect.bottom)) / 2
    return getComputedStyle(document.elementFromPoint(x, y) ?? node).cursor
  })
}

export async function cursorSvg(target: Locator) {
  const cursor = await cursorAtTarget(target)
  const encoded = cursor.match(/data:image\/svg\+xml,([^"]+)/)?.[1]
  return encoded ? decodeURIComponent(encoded) : ''
}

export async function expectImageCursor(target: Locator, type: string, size?: number) {
  await expect.poll(() => cursorAtTarget(target)).toMatch(new RegExp('^url\\("data:image/svg\\+xml,.*\\),? .*' + type + '$'))
  if (size !== undefined) await expect.poll(() => cursorSvg(target)).toContain('width="' + size + '"')
}

export async function checkCursorBasic(page: Page, scope: Locator) {
  const button = scope.getByRole('button', { name: '点击计数：0', exact: true })
  await button.hover()
  await expectImageCursor(button, 'pointer', 28)
  await expect(page.locator('[data-bing-cursor-layer]')).toHaveCount(0)
  await button.click()
  await expect(scope.getByRole('button', { name: '点击计数：1', exact: true })).toBeVisible()
  const disabled = scope.getByRole('button', { name: '禁用按钮', exact: true })
  await disabled.hover()
  await expectImageCursor(disabled, 'not-allowed')
  const input = scope.getByRole('textbox', { name: '光标示例输入', exact: true })
  await input.hover()
  await expectImageCursor(input, 'text')
  await input.fill('原生光标不拦截输入')
  await expect(input).toHaveValue('原生光标不拦截输入')
  const editable = scope.getByRole('textbox', { name: '可编辑正文', exact: true })
  const paragraph = editable.locator('p')
  const originalContent = await editable.innerHTML()
  await paragraph.hover()
  await expectImageCursor(paragraph, 'text')
  await expect(editable.locator('[data-bing-cursor-native]')).toHaveCount(0)
  await editable.locator('a').hover()
  await expectImageCursor(editable.locator('a'), 'pointer')
  expect(await editable.innerHTML()).toBe(originalContent)
  await paragraph.click()
  await page.keyboard.press('End')
  await page.keyboard.insertText('继续编辑')
  await expect(paragraph).toContainText('继续编辑')
  const grab = scope.locator('[data-bing-cursor="grab"]')
  await grab.hover()
  await page.mouse.down()
  await expectImageCursor(grab, 'grabbing')
  await page.mouse.up()
  await expectImageCursor(grab, 'grab')
  const native = scope.locator('[data-bing-cursor="native"]')
  await native.hover()
  await expect(native).not.toHaveCSS('cursor', /url\(/)
  await expect(page.locator('[data-bing-cursor-native]')).toHaveCount(0)
}

export async function checkCursorAppearance(page: Page, scope: Locator) {
  const target = scope.locator('.appearance-target')
  await target.hover()
  await expectImageCursor(target, 'zoom-in', 36)
  await expect.poll(() => cursorSvg(target)).toContain('rgb(37, 99, 235)')
  await scope.getByLabel('光标主体色', { exact: true }).fill('#9333ea')
  await scope.getByLabel('光标描边色', { exact: true }).fill('#fafafa')
  await scope.getByRole('spinbutton', { name: '外观光标尺寸', exact: true }).fill('48')
  await scope.getByRole('button', { name: '使用热点 [8, 8]', exact: true }).click()
  await target.hover()
  await expectImageCursor(target, 'zoom-in', 48)
  await expect.poll(() => cursorSvg(target)).toContain('rgb(147, 51, 234)')
  await expect.poll(() => cursorSvg(target)).toContain('rgb(250, 250, 250)')
  await expect(target).toHaveCSS('cursor', /\) 8 8, zoom-in$/)
  await scope.getByRole('button', { name: '测试点击：0', exact: true }).click()
  await expect(scope.getByRole('button', { name: '测试点击：1', exact: true })).toBeVisible()
}

export async function checkCursorNative(page: Page, scope: Locator) {
  const themed = scope.locator('.themed')
  await themed.hover()
  await expectImageCursor(themed, 'crosshair')
  await scope.locator('.system').hover()
  await expect(scope.locator('.system')).toHaveCSS('cursor', 'crosshair')
  await scope.locator('.busy').hover()
  await expect(scope.locator('.busy')).toHaveCSS('cursor', 'wait')
  await scope.getByRole('button', { name: '停用光标', exact: true }).click()
  await themed.hover()
  await expect(themed).toHaveCSS('cursor', 'crosshair')
  await scope.getByRole('button', { name: '启用光标', exact: true }).click()
  await themed.hover()
  await expectImageCursor(themed, 'crosshair')
  await expect(page.locator('[data-bing-cursor-layer]')).toHaveCount(0)
}

export async function checkCursorScopes(page: Page, scope: Locator) {
  const local = scope.locator('.local-zone > p')
  await local.hover()
  await expectImageCursor(local, 'crosshair', 36)
  const inner = scope.locator('.inner-zone')
  await inner.hover()
  await expectImageCursor(inner, 'zoom-in', 44)
  await scope.getByRole('button', { name: '打开作用域弹窗', exact: true }).click()
  const input = page.getByRole('textbox', { name: '弹窗中的光标输入', exact: true })
  await input.hover()
  await expect(input).toHaveCSS('cursor', 'text')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Teleport 作用域', exact: true })).toHaveCount(0)
  await scope.getByRole('button', { name: '开启全局光标', exact: true }).click()
  const outside = scope.locator('.outside-zone')
  await outside.hover()
  await expectImageCursor(outside, 'default', 28)
  await inner.hover()
  await expectImageCursor(inner, 'zoom-in', 44)
  await scope.getByRole('button', { name: '打开作用域弹窗', exact: true }).click()
  await input.hover()
  await expectImageCursor(input, 'text', 28)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Teleport 作用域', exact: true })).toHaveCount(0)
  await scope.getByRole('button', { name: '关闭全局光标', exact: true }).click()
  await outside.hover()
  await expect(outside).not.toHaveCSS('cursor', /url\(/)
  await expect(page.locator('html')).not.toHaveAttribute('data-bing-cursor-native')
}
