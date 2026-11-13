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

test('Checkbox 导出基础和状态：布尔模型、独立半选与禁用', async ({ page }) => {
  await page.goto('/?component=checkbox&example=basic')
  await page.getByRole('checkbox', { name: '启用动效反馈', exact: true }).locator('..').click()
  await expect(page.getByRole('status')).toHaveText('当前值：true；半选参数：false')
  await page.goto('/?component=checkbox&example=states')
  const partial = page.getByRole('checkbox', { name: '部分选中', exact: true })
  await expect(partial).toHaveJSProperty('indeterminate', true)
  await expect(partial).toHaveJSProperty('checked', false)
  await expect(page.getByRole('checkbox', { name: '禁用状态', exact: true })).toBeDisabled()
  await expect(page.getByRole('checkbox', { name: '禁用状态', exact: true })).toBeChecked()
  await page.getByRole('checkbox', { name: '已选中', exact: true }).locator('..').click()
  await expect(page.getByRole('checkbox', { name: '已选中', exact: true })).not.toBeChecked()
})

test('Checkbox 导出尺寸和装饰：34px、圆形、只读标记不生成 input', async ({ page }) => {
  await page.goto('/?component=checkbox&example=sizes')
  await expect(page.getByRole('checkbox', { name: '自定义 34px', exact: true }).locator('..')).toHaveCSS('--bing-checkbox-size', '34px')
  await expect(page.getByRole('checkbox', { name: '大尺寸圆形', exact: true }).locator('..')).toHaveClass(/bing-checkbox--circle/)
  await page.goto('/?component=checkbox&example=decorative')
  await expect(page.locator('input')).toHaveCount(0)
  await expect(page.locator('.bing-checkbox[aria-hidden="true"]')).toHaveCount(4)
})

test('Checkbox 导出事件：布尔值和原始 change 参数，focus/blur 可运行', async ({ page }) => {
  await page.goto('/?component=checkbox&example=events')
  const checkbox = page.getByRole('checkbox', { name: '接收通知', exact: true })
  await checkbox.focus()
  await expect(page.getByRole('status')).toHaveText('focus：获得焦点')
  await checkbox.press('Space')
  await expect(page.getByRole('status')).toHaveText('change：已选中；原始事件：change')
  await page.getByRole('button', { name: '移动焦点', exact: true }).focus()
  await expect(page.getByRole('status')).toHaveText('blur：失去焦点')
})

test('Checkbox 阅读应用：从子项计算全选和半选，组内变化由 Group 发出', async ({ page }) => {
  await page.goto('/?understanding=checkbox')
  const parent = page.getByRole('checkbox', { name: '全选通知', exact: true })
  await expect(page.getByRole('checkbox', { name: '被插槽替代的标签', exact: true })).toHaveCount(0)
  await expect(parent).toHaveJSProperty('indeterminate', true)
  await expect(parent).toHaveJSProperty('checked', false)
  await parent.locator('..').click()
  await expect(parent).toHaveJSProperty('indeterminate', false)
  await expect(parent).toBeChecked()
  await expect(page.getByRole('status')).toHaveText('全选：true；半选：false；值：email,inbox')
  await page.getByRole('checkbox', { name: '邮件', exact: true }).locator('..').click()
  await expect(parent).toHaveJSProperty('indeterminate', true)
  await expect(page.getByText('inbox:change；子项 change 次数：0', { exact: true })).toBeVisible()
})
