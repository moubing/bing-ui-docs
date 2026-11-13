import { expect, type Locator, type Page } from '@playwright/test'

/** 网页预览与 AI 导出的操作按钮示例行为一致：第一次撤销失败并保留提示，第二次成功。 */
export async function exerciseToastAction(page: Page, root: Page | Locator) {
  // 只检查操作状态与计时；暂停真实时间，避免 600ms 回调在断言之间完成。
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install({ time: new Date('2026-11-08T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-11-08T00:01:00Z'))
  await root.getByRole('button', { name: '标记完成', exact: true }).click()
  const toast = page.locator('.bing-toast').filter({ hasText: 'REQ-26 已改为已完成' })
  await expect(toast).toBeVisible()
  const action = toast.getByRole('button', { name: '撤销 REQ-26 的状态修改', exact: true })
  // 带操作的 success 至少保留 6000ms。
  await page.clock.runFor(4000)
  await expect(toast).toBeVisible()

  await action.click()
  await expect(action).toBeDisabled()
  await expect(action).toHaveAttribute('aria-busy', 'true')
  // 处理中暂停计时。
  await page.clock.runFor(500)
  await expect(toast).toBeVisible()
  await expect(toast).toContainText('正在撤销…')
  await expect(action).toBeDisabled()
  await expect(action).toHaveAttribute('aria-busy', 'true')
  await page.clock.runFor(200)
  await expect(root.getByRole('status').filter({ hasText: '撤销失败' })).toBeVisible()
  await expect(page.locator('.bing-toast--error')).toContainText('状态已被他人修改')
  await expect(toast).toBeVisible()
  await expect(action).toBeEnabled()

  await action.click()
  await page.clock.runFor(700)
  await expect(toast).toHaveCount(0)
  await expect(root.getByRole('status').filter({ hasText: '已撤销，恢复为测试中' })).toBeVisible()
  await expect(root.getByText('REQ-26：测试中')).toBeVisible()
}
