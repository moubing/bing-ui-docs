import { expect, test, type Page } from '@playwright/test'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
  page.on('console', message => {
    if (/failed to resolve component|unhandled error/i.test(message.text())) messages.push(message.text())
  })
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

test('Tabs 阅读应用：三档尺寸、中文名称和窄屏长标签键盘定位', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?understanding=tabs')
  for (const [size, height] of [['sm', 32], ['md', 36], ['lg', 40]] as const) {
    const tabs = page.getByRole('tablist', { name: size === 'sm' ? '标签页' : '尺寸 ' + size, exact: true })
    await expect(tabs).toHaveCSS('height', height + 'px')
    const last = tabs.getByRole('tab').last()
    await tabs.getByRole('tab').first().press('End')
    await expect(last).toBeFocused()
    await expect(last).toHaveAttribute('aria-selected', 'true')
    await expect(page.locator('#tabs-value-' + size)).toHaveText('当前：7')
    const box = (await last.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(390)
  }
})

test('Tabs 导出基础示例：自动激活、循环、事件和业务面板', async ({ page }) => {
  await page.goto('/?component=tabs&example=basic')
  const tabs = page.getByRole('tablist', { name: '文档分组', exact: true })
  await tabs.getByRole('tab', { name: '指标', exact: true }).click()
  await expect(page.getByRole('heading', { name: '指标', exact: true })).toBeVisible()
  await expect(page.getByRole('status')).toContainText('总览 -> 指标')
  await tabs.getByRole('tab', { name: '指标', exact: true }).press('ArrowRight')
  await expect(tabs.getByRole('tab', { name: '总览', exact: true })).toBeFocused()
  await expect(page.getByRole('heading', { name: '总览', exact: true })).toBeVisible()
  await expect(tabs.getByRole('tab', { name: '禁用项', exact: true })).toBeDisabled()
})

test('Tabs 导出手动激活示例：焦点不改变值，Enter 和空格确认，边界不循环', async ({ page }) => {
  await page.goto('/?component=tabs&example=keyboard')
  const first = page.getByRole('tab', { name: '总览', exact: true })
  const second = page.getByRole('tab', { name: '用法', exact: true })
  const last = page.getByRole('tab', { name: '指标', exact: true })
  await first.focus()
  await first.press('ArrowRight')
  await expect(second).toBeFocused()
  await expect(first).toHaveAttribute('aria-selected', 'true')
  await second.press('Enter')
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await second.press('End')
  await last.press('ArrowRight')
  await expect(last).toBeFocused()
  await expect(second).toHaveAttribute('aria-selected', 'true')
  await last.press('Space')
  await expect(last).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('status')).toContainText('用法 -> 指标')
})

test('Tabs 导出样式与插槽：三组值独立，自定义字段和禁用状态可用', async ({ page }) => {
  await page.goto('/?component=tabs&example=variants')
  await page.getByRole('tablist', { name: 'glass 样式', exact: true }).getByRole('tab', { name: '用法', exact: true }).click()
  await expect(page.getByRole('tablist', { name: 'pill 样式', exact: true }).getByRole('tab', { name: '总览', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('各组独立选中值：overview / usage / overview', { exact: true })).toBeVisible()
  await page.goto('/?component=tabs&example=item-slot')
  await page.getByRole('tab', { name: /开发/ }).click()
  await expect(page.locator('p[aria-live]')).toHaveText('开发，数量：6')
  await expect(page.getByRole('tab', { name: /归档/ })).toBeDisabled()
  await expect(page.getByRole('tab', { name: /开发/ }).locator('.dot')).toHaveCSS('background-color', 'rgb(56, 189, 248)')
})
