import { expect, test, type Page } from '@playwright/test'
import { exerciseToastAction } from '../browser/toast-action'
test.use({ testIdAttribute: 'id' })

const errors = new WeakMap<Page, string[]>()
test.beforeEach(({ page }) => { const messages: string[] = []; errors.set(page, messages); page.on('pageerror', error => messages.push(error.message)) })
test.afterEach(({ page }) => expect(errors.get(page)).toEqual([]))
async function queue(page: Page) {
  return JSON.parse((await page.getByTestId('queue').textContent())!) as Array<{ id: string; type: string; duration: number; position: string; closable: boolean; title?: string; message: string; order: number; createdAt: number }>
}

test('Toast 导出基础：按钮关闭、服务关闭与队列清理', async ({ page }) => {
  await page.goto('/?component=toast&example=basic')
  await page.getByRole('button', { name: '创建提示', exact: true }).click()
  await expect(page.locator('.bing-toast')).toContainText('保存成功')
  await page.getByRole('button', { name: '关闭消息', exact: true }).click()
  await expect(page.locator('p[role=status]')).toHaveText('队列：0；用户关闭：success')
  await page.getByRole('button', { name: '创建提示', exact: true }).click()
  await page.getByRole('button', { name: '关闭上一条', exact: true }).click()
  await expect(page.locator('p[role=status]')).toHaveText('队列：0；服务关闭')
  await page.getByRole('button', { name: '创建提示', exact: true }).click()
  await page.getByRole('button', { name: '清空全部', exact: true }).click()
  await expect(page.locator('p[role=status]')).toContainText('队列：0')
})

test('Toast 导出类型：六种类型、默认计时与可访问角色', async ({ page }) => {
  await page.goto('/?component=toast&example=types')
  await page.clock.install()
  for (const type of ['default', 'success', 'error', 'loading', 'warning', 'info']) {
    await page.getByRole('button', { name: type, exact: true }).click()
    const item = page.locator('.bing-toast--' + type)
    await expect(item).toBeVisible()
    await expect(item).toHaveAttribute('role', ['error', 'warning'].includes(type) ? 'alert' : 'status')
    await expect(item).toHaveAttribute('aria-label', type)
  }
  await page.clock.runFor(6000)
  await expect(page.locator('.bing-toast')).toHaveCount(1)
  await expect(page.locator('.bing-toast--loading')).toBeVisible()
})

test('Toast 导出 loading：原位替换、取消和关闭后不重新弹出', async ({ page }) => {
  await page.goto('/?component=toast&example=loading')
  await page.clock.install()
  const start = page.getByRole('button', { name: '模拟 loading 到成功', exact: true })
  await start.click()
  await expect(page.locator('.bing-toast--loading')).toContainText('处理中')
  await page.clock.runFor(1400)
  await expect(page.locator('.bing-toast')).toHaveCount(1)
  await expect(page.locator('.bing-toast--success')).toContainText('同步完成')
  await start.click()
  await page.getByRole('button', { name: '关闭消息', exact: true }).last().click()
  await page.clock.runFor(1500)
  await expect(page.locator('.bing-toast')).toHaveCount(0)
  await start.click()
  await page.getByRole('button', { name: '取消演示', exact: true }).click()
  await page.clock.runFor(1500)
  await expect(page.locator('.bing-toast')).toHaveCount(0)
})

test('Toast 导出位置：别名清理与 max 不裁剪', async ({ page }) => {
  await page.goto('/?component=toast&example=positions')
  for (const name of ['top', 'top-center', 'bottom-center']) await page.getByRole('button', { name, exact: true }).click()
  await expect(page.locator('.bing-toast[data-position=top]')).toHaveCount(2)
  await expect(page.locator('.bing-toast[data-position=bottom]')).toHaveCount(1)
  await page.getByRole('button', { name: '清空顶部中央', exact: true }).click()
  await expect(page.locator('.bing-toast[data-position=top]')).toHaveCount(0)
  for (let index = 0; index < 6; index++) await page.getByRole('button', { name: 'top-right', exact: true }).click()
  await expect(page.locator('.bing-toast[data-position=top-right]')).toHaveCount(6)
  expect(await page.locator('.bing-toast[data-position=top-right]').evaluateAll(nodes => Math.max(...nodes.map(node => Number(node.getAttribute('data-depth')))))).toBe(1)
  await page.getByRole('button', { name: '清空全部', exact: true }).click()
  await expect(page.locator('.bing-toast')).toHaveCount(0)
})

test('Toast 阅读应用：字符串 id、整条替换、默认值与共享服务', async ({ page }) => {
  await page.goto('/?understanding=toast')
  await page.clock.install()
  await expect(page.getByTestId('same-service')).toHaveText('true')
  await page.getByRole('button', { name: '创建待更新消息', exact: true }).click()
  const original = (await queue(page))[0]!
  await page.getByRole('button', { name: '替换已有消息', exact: true }).click()
  const updated = await queue(page)
  expect(updated).toHaveLength(1)
  expect(updated[0]).toMatchObject({ id: '7', message: '替换后', type: 'default', position: 'top-right', closable: true, duration: 3200, createdAt: original.createdAt, order: original.order })
  expect(updated[0]!.title).toBeUndefined()
  await page.getByRole('button', { name: '创建默认类型', exact: true }).click()
  expect((await queue(page)).map(item => [item.type, item.duration])).toEqual([['default', 3200], ['success', 2600], ['error', 4200], ['loading', 0], ['warning', 3600], ['info', 3200]])
  expect((await queue(page))[5]).toMatchObject({ message: '仅标题' })
})

test('Toast 阅读应用：最先挂载的视口独占显示，卸载后接替；close 事件只来自按钮', async ({ page }) => {
  await page.goto('/?understanding=toast')
  await page.getByRole('button', { name: '创建两个位置', exact: true }).click()
  expect(await queue(page)).toHaveLength(2)
  await expect(page.locator('.bing-toast')).toHaveCount(1)
  await expect(page.locator('.bing-toast')).toContainText('第一个视口可见')
  await page.getByRole('button', { name: '卸载第一个视口', exact: true }).click()
  await expect(page.locator('.bing-toast')).toHaveCount(2)
  await page.locator('.bing-toast[data-position=bottom-right]').getByRole('button', { name: '关闭消息', exact: true }).click()
  await expect(page.getByTestId('closed')).toHaveText('1 / true')
  await page.getByRole('button', { name: '清空', exact: true }).click()
  expect(await queue(page)).toHaveLength(0)
  await expect(page.getByTestId('closed')).toHaveText('1 / true')
})

test('Toast 阅读应用：新增消息重启全队列计时，悬停暂停后重新计时', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?understanding=toast')
  // 此用例只检查服务计时；消除原生 CSS 换位动画与模拟时钟之间的时间差。
  await page.addStyleTag({ content: '.bing-toast { transition: none !important; animation: none !important; }' })
  await page.clock.install()
  await page.getByRole('button', { name: '创建定时消息', exact: true }).click()
  await page.clock.runFor(600)
  await page.getByRole('button', { name: '更新队列', exact: true }).click()
  await page.clock.runFor(600)
  expect((await queue(page)).map(item => item.id)).toEqual(['timer-a', 'timer-b'])
  await page.locator('.bing-toast').filter({ hasText: '定时消息 A' }).hover()
  await page.clock.runFor(2000)
  expect(await queue(page)).toHaveLength(2)
  await page.mouse.move(1000, 650)
  await page.clock.runFor(600)
  expect(await queue(page)).toHaveLength(2)
  await page.clock.runFor(800)
  expect((await queue(page)).map(item => item.id)).toEqual(['timer-b'])
  await expect(page.getByTestId('closed')).toHaveText('0 / false')
})

test('Toast 导出操作按钮：处理中暂停计时，失败保留提示，重试后关闭', async ({ page }) => {
  await page.goto('/?component=toast&example=action')
  await exerciseToastAction(page, page)
})
