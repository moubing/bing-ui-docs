import { expect, test, type Page } from '@playwright/test'

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => {
  const messages: string[] = []
  errors.set(page, messages)
  page.on('pageerror', error => messages.push(error.message))
})
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))

test('Tag 导出基础和外观：close 不自动删除、颜色尺寸、插槽与长文本', async ({ page }) => {
  await page.goto('/?component=tag&example=basic')
  await page.getByRole('button', { name: '移除 Aurora', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('关闭事件：1')
  await expect(page.locator('.bing-tag')).toHaveCount(1)
  await page.goto('/?component=tag&example=tones')
  await expect(page.locator('.bing-tag')).toHaveCount(6)
  await expect(page.locator('.bing-tag').filter({ hasText: /^success$/ })).toHaveClass(/bing-tag--soft/)
  await page.goto('/?component=tag&example=sizes')
  await expect(page.locator('.bing-tag')).toHaveCount(3)
  for (const [size, height] of [['sm', '20px'], ['md', '24px'], ['lg', '28px']]) {
    await expect(page.locator(`.bing-tag--${size}`)).toHaveCSS('height', height!)
  }
  await expect(page.locator('.bing-tag').filter({ hasText: 'lg 标签' })).toHaveClass(/bing-tag--lg/)
  await page.goto('/?component=tag&example=slot')
  await expect(page.locator('.bing-tag')).toHaveCount(3)
  await expect(page.getByText('已发布', { exact: true })).toBeVisible()
  const long = page.locator('.bing-tag__label').filter({ hasText: '这是一个很长的标签文案' })
  await expect(long).toHaveCSS('text-overflow', 'ellipsis')
})

test('Tag 导出列表：键盘关闭、数据移除、恢复与禁用', async ({ page }) => {
  await page.goto('/?component=tag&example=closable')
  const close = page.getByRole('button', { name: '移除 文档', exact: true })
  await close.focus()
  await close.press('Enter')
  await expect(page.getByRole('status')).toHaveText('当前筛选：demo,api')
  await expect(page.getByRole('button', { name: '移除禁用标签', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '恢复标签', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('当前筛选：docs,demo,api')
})

test('Tag 阅读应用：插槽覆盖、关闭不冒泡、业务控制可见性', async ({ page }) => {
  await page.goto('/?understanding=tag')
  await expect(page.getByText('被插槽替代', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '移除已完成筛选', exact: true }).click()
  await expect(page.locator('.bing-tag')).toHaveCount(0)
  await expect(page.getByRole('status')).toHaveText('行点击：0；关闭事件：click')
  await page.getByText('筛选区域', { exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('行点击：1；关闭事件：click')
})
