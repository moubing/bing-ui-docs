import { expect, test } from '@playwright/test'
import { componentDocsTests, navigateToDocs } from './component-docs'
import { exerciseToastAction } from './toast-action'

const open = componentDocsTests({ slug: 'toast', title: 'BingToast', ready: '#viewport-service .bing-select', previews: 5, tables: 7,
  prepare: async page => { await expect(page.locator('.bing-toast-root')).toHaveCount(1) },
  sections: ['overview', 'viewport-service', 'types', 'loading-update', 'action', 'positions', 'props', 'options', 'action-api', 'service', 'events', 'api-types'] })

for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
  test(`Toast 实际消息 ${width} ${theme}：长文案可见、关闭可达`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 860 })
    await page.addInitScript(value => localStorage.setItem('bing-ui-docs-theme', value), theme)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page)
    await page.getByRole('textbox', { name: '持续时间 ms', exact: true }).fill('0')
    await page.getByRole('textbox', { name: '内容', exact: true }).fill('新版文档已经保存。较长的提示会在当前宽度内换行，关闭按钮仍可通过鼠标和键盘操作。')
    await page.getByRole('button', { name: '创建当前提示', exact: true }).click()
    const toast = page.locator('.bing-toast')
    await expect(toast).toBeVisible()
    const box = (await toast.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(width)
    expect(await toast.evaluate(node => node.scrollWidth <= node.clientWidth)).toBe(true)
    await toast.screenshot({ path: info.outputPath(`toast-message-${theme}-${width}.png`), animations: 'disabled' })
    await toast.getByRole('button', { name: '关闭消息', exact: true }).press('Enter')
    await expect(toast).toHaveCount(0)
  })
}

test('Toast：配置创建、关闭反馈、整条替换与清理', async ({ page }) => {
  await open(page)
  await page.getByRole('textbox', { name: '持续时间 ms', exact: true }).fill('0')
  await page.getByRole('button', { name: '创建当前提示', exact: true }).click()
  await expect(page.locator('.bing-toast')).toContainText('保存成功')
  await page.getByRole('button', { name: '关闭消息', exact: true }).click()
  await expect(page.locator('.toast-feedback')).toContainText('用户关闭：')
  await page.clock.install()
  await page.getByRole('button', { name: '模拟 loading 到成功', exact: true }).click()
  await page.clock.runFor(1500)
  await expect(page.locator('.bing-toast')).toHaveCount(1)
  await expect(page.locator('.bing-toast')).toContainText('同步完成')
  await page.getByRole('button', { name: '清空全部', exact: true }).click()
  await page.clock.runFor(500)
  await expect(page.locator('.bing-toast')).toHaveCount(0)
})

test('Toast：离开页面会取消未完成的演示任务', async ({ page }) => {
  await open(page)
  await page.clock.install()
  await page.getByRole('button', { name: '模拟 loading 到成功', exact: true }).click()
  // 点击真实站内链接，保留同一 JS 环境以检验 KeepAlive 停用清理。
  await navigateToDocs(page, 'button')
  await expect(page.locator('.doc-page h1')).toHaveText('BingButton')
  await page.clock.runFor(1600)
  await expect(page.locator('.bing-toast-root')).toHaveCount(1)
  await expect(page.locator('.bing-toast')).toHaveCount(0)
  await page.getByRole('button', { name: '连续点击试试', exact: true }).click()
  await page.clock.runFor(500)
  await expect(page.locator('.bing-toast')).toContainText('点击已生效')
  await page.getByRole('button', { name: '关闭消息', exact: true }).click()
  await page.clock.runFor(500)
  await navigateToDocs(page, 'toast')
  await expect(page.locator('.doc-page h1')).toHaveText('BingToast')
  await page.clock.runFor(600)
  await expect(page.locator('.bing-toast-root')).toHaveCount(1)
  await expect(page.locator('.bing-toast')).toHaveCount(0)
  await page.getByRole('button', { name: '创建当前提示', exact: true }).click()
  await page.clock.runFor(500)
  await expect(page.locator('.bing-toast')).toContainText('保存成功')
  await page.getByRole('button', { name: '清空全部', exact: true }).click()
  await page.locator('a[href="/"]').first().click()
  await expect(page).toHaveURL('/')
  await page.clock.runFor(600)
  await expect(page.locator('.bing-toast-root')).toHaveCount(1)
  await page.locator('a[href="/docs"]').first().click()
  await expect(page).toHaveURL('/docs')
  await page.clock.runFor(600)
  await expect(page.locator('.bing-toast-root')).toHaveCount(0)
  await navigateToDocs(page, 'toast')
  await expect(page.locator('.doc-page h1')).toHaveText('BingToast')
  await page.clock.runFor(600)
  await expect(page.locator('.bing-toast-root')).toHaveCount(1)
})

test('Toast：操作按钮处理中暂停计时，失败保留提示，重试后关闭', async ({ page }) => {
  await open(page)
  await exerciseToastAction(page, page.locator('#action'))
})
